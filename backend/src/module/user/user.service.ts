import { plainToInstance } from 'class-transformer'
import UserRepository from './user.repository'
import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { BadRequest } from '~/helper/response/errorResponse'
import { ChangePasswordDTO, EditProfileDTO, GetUsersQueryDTO, ImportUseFromCSVDTO, ResponseUserDTO } from './user.dto'
import { FIVE_MINUTES_IN_SECONDS } from '~/utils/const.util'
import bcrypt from 'bcryptjs'
import { generateSecret, generateURI } from 'otplib'
import Qrcode from 'qrcode'
import { IUser, IUserWithRoles } from './user.model'
import fs from 'fs'
import { validate } from 'class-validator'
import RoleRepository from '../rbac/role.repository'
import { IRoleWithPermissions } from '../rbac/role.model'
import { parse } from 'fast-csv'

@injectable()
class UserService {
  constructor(
    @inject(ContainerInjectionRegistry.UserRepository) private userRepository: UserRepository,
    @inject(ContainerInjectionRegistry.RoleRepository) private roleRepository: RoleRepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async enable2FA(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new BadRequest('Can not enable 2FA')

    const secret = generateSecret()
    const issuer = 'E-commerce'
    const otpAuthUrl = generateURI({
      issuer,
      label: user.email,
      secret
    })

    const qrCode = await Qrcode.toDataURL(otpAuthUrl)
    const twoFAKey = `2fa:${user._id}`

    await this.redisClient.set(twoFAKey, secret, 'EX', FIVE_MINUTES_IN_SECONDS)

    return {
      qrCode
    }
  }

  async getProfile(userId: string) {
    const userKey = `user:${userId}`
    const userCache = await this.redisClient.get(userKey)

    if (userCache)
      return {
        user: JSON.parse(userCache)
      }

    const user = await this.userRepository.findById(userId)
    if (!user) throw new BadRequest('Can not get profile')

    const userWithRole = (await user.populate('roles')) as IUserWithRoles

    const safeUser = plainToInstance(ResponseUserDTO, userWithRole, {
      excludeExtraneousValues: true
    })

    await this.redisClient.set(userKey, JSON.stringify(safeUser), 'EX', FIVE_MINUTES_IN_SECONDS)

    return {
      user: safeUser
    }
  }

  async changePassword(userId: string, payload: ChangePasswordDTO) {
    const user = await this.userRepository.findByIdAndSelectPassword(userId)
    if (!user) throw new BadRequest('Can not change password')

    const isMatchPassword = bcrypt.compareSync(payload.oldPassword, user.password)
    if (!isMatchPassword) throw new BadRequest('Passowrd is not match')

    const hashPassword = bcrypt.hashSync(payload.password)
    const result = await this.userRepository.update(userId, { password: hashPassword })

    if (!result) throw new BadRequest('Change password was failed')

    return {
      id: user._id
    }
  }

  async deleteAccount(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new BadRequest('Can not remove account')

    const result = await this.userRepository.update(userId, { is_delete: true })
    if (!result) throw new BadRequest('Remove user failled')

    return {
      id: user._id
    }
  }

  async editProfile(userId: string, payload: EditProfileDTO) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new BadRequest('Can not edit profile')

    const userKey = `user:${userId}`
    await this.redisClient.del(userKey)

    const result = await this.userRepository.update(userId, { ...payload, avatar: { url: payload.avatar } })
    if (!result) throw new BadRequest('Edit profile failed')

    const safeUser = plainToInstance(ResponseUserDTO, result, {
      excludeExtraneousValues: true
    })

    await this.redisClient.set(userKey, JSON.stringify(safeUser), 'EX', FIVE_MINUTES_IN_SECONDS)
    return {
      id: safeUser.id
    }
  }

  async importUsersFromCSV(filePath: string) {
    const BATCH_SIZE = 1000

    const batch: Partial<IUser>[] = []

    let inserted = 0
    let failed = 0

    const userRole = await this.roleRepository.findOne({ name: 'User' })
    if (!userRole) {
      throw new BadRequest('Role User not found')
    }
    const role = (await userRole.populate('permissions')) as IRoleWithPermissions
    const permissions = role.permissions.map((p) => p.key)

    const existingUsers = await this.userRepository.getAllEmails()
    const emailSet = new Set(existingUsers)

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(parse())

      stream.on('data', async (row: ImportUseFromCSVDTO) => {
        stream.pause()
        try {
          const rawData = {
            full_name: row.full_name,
            email: row.email,
            phone_number: row.phone_number,
            avatar: row.avatar,
            password: row.password
          }
          const data = plainToInstance(ImportUseFromCSVDTO, rawData)

          const errs = await validate(data, {
            whitelist: true,
            forbidNonWhitelisted: true
          })

          if (errs.length) {
            failed++
            stream.resume()
            return
          }

          if (emailSet.has(data.email)) {
            failed++
            stream.resume()
            return
          }

          const hashed = await bcrypt.hash(data.password, 10)

          batch.push({
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            avatar: {
              url: data.avatar
            },
            password: hashed,
            roles: [userRole._id],
            permissions
          })

          emailSet.add(data.email)

          if (batch.length >= BATCH_SIZE) {
            const docs = await this.userRepository.insertMany(batch)

            inserted += docs.length

            batch.length = 0
          }
          stream.resume()
        } catch (err) {
          failed++
          console.error(err)
        }
      })

      stream.on('end', async () => {
        try {
          if (batch.length) {
            const docs = await this.userRepository.insertMany(batch)

            inserted += docs.length
          }

          resolve({
            inserted,
            failed
          })
        } catch (err) {
          reject(err)
        }
      })

      stream.on('error', reject)
    })
  }

  async exportUsersToCSV() {
    const users = await this.userRepository.findAll()
    const formatUser = plainToInstance(ResponseUserDTO, users)

    return formatUser
  }

  async getUsers(query: GetUsersQueryDTO) {
    const users = await this.userRepository.paginate({
      page: query.page,
      limit: query.limit
    })

    const formatUser = users.data.map((u) => plainToInstance(ResponseUserDTO, u))

    return {
      ...users,
      data: formatUser
    }
  }
}

export default UserService
