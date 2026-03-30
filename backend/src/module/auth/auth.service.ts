import UserRepository from '../user/user.repository'
import { IUser } from '../user/user.model'
import { inject, injectable } from 'inversify'
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  TooManyRequest,
  UnauthorizedError
} from '~/helper/response/errorResponse'
import bcrypt from 'bcryptjs'
import { generatePassword, generateVerificationToken } from '~/utils'
import Redis from 'ioredis'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import {
  EMAIL_TEMPLATE_RESET_PASSWORD,
  EMAIL_TEMPLATE_TWO_STEP_VERIFICATION,
  FIFTEN_MINUTES_IN_SECONDS,
  ONE_MINUTES_IN_SECONDS
} from '~/utils/const.util'
import jsonWebToken from '~/helper/jwt'
import { JwtPayload } from '~/types/type'
import { v4 as uuidv4 } from 'uuid'
import {
  RegisterDTO,
  ForgotPasswordDTO,
  GoogleLoginDTO,
  LoginDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  VerifyOtpDto,
  VerifyToken2FADTO
} from './auth.dto'
import { OAuth2Client } from 'google-auth-library'
import { SEVEN_DAYS_IN_SECONDS } from '~/utils/const.util'
import { randomBytes } from 'crypto'

import env from '~/config/env/dotenv.config'
import { verify } from 'otplib'
import RoleRepository from '../rbac/role.repository'
import { QueueManager, QueueName } from '~/helper/jobs/queueManager'
import { JobType } from '~/helper/jobs/jobManager'

const SALT_NUMBER = 10
const EMAIL_REGISTRATION_SUBJECT = 'Verify your email for Account registration'
const EMAIL_RESET_PASSWORD = 'Reset Password Request'

@injectable()
class AuthService {
  private googleClient: OAuth2Client
  constructor(
    @inject(ContainerInjectionRegistry.UserRepository) private userRepository: UserRepository,
    @inject(ContainerInjectionRegistry.RoleRepository) private roleRepository: RoleRepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {
    this.googleClient = new OAuth2Client({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_REDIRECT_URI
    })
  }

  async signUp(payload: RegisterDTO) {
    const existingUser = await this.userRepository.findByEmail(payload.email)
    if (existingUser) throw new ConflictError('User already existed')

    const hashPassword = bcrypt.hashSync(payload.password, SALT_NUMBER)
    const userData = JSON.stringify({
      ...payload,
      email: payload.email.trim().toLowerCase(),
      password: hashPassword
    })

    return this.sendVerificationOtp(payload.email, userData)
  }

  async resendOtp(email: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await this.userRepository.findByEmail(normalizedEmail)

    if (existingUser) throw new ConflictError('User already existed')

    const pendingRegistrationKey = `pending-registration:${normalizedEmail}`
    const userDataJSON = await this.redisClient.get(pendingRegistrationKey)

    if (!userDataJSON) {
      throw new BadRequestError('Registration session expired. Please sign up again')
    }

    return this.sendVerificationOtp(normalizedEmail, userDataJSON)
  }

  async verificationToken({ otp, email }: VerifyOtpDto) {
    const normalizedEmail = email.trim().toLowerCase()
    const verificationKey = `verification-token:${normalizedEmail}:${otp}`
    const pendingRegistrationKey = `pending-registration:${normalizedEmail}`
    const userDataJSON = await this.redisClient.get(verificationKey)

    if (!userDataJSON) throw new BadRequestError('Verification token is expired or wrong')

    await Promise.all([this.redisClient.del(verificationKey), this.redisClient.del(pendingRegistrationKey)])

    const userData = JSON.parse(userDataJSON) as RegisterDTO
    const existingUser = await this.userRepository.findByEmail(userData.email)
    if (existingUser) throw new ConflictError('User already existed')

    const userRole = await this.roleRepository.findOne({
      name: 'user'
    })
    if (!userRole) throw new BadRequestError('Something went wrong. Please try again')

    const user = await this.userRepository.create({
      ...userData,
      roles: [userRole.name],
      permissions: userRole.permissions
    })

    return {
      id: user._id
    }
  }

  async loginWithGoogle() {
    const url = this.googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile']
    })

    return url
  }

  async loginWithGoogleCallback({ code }: GoogleLoginDTO) {
    const { tokens } = await this.googleClient.getToken(code)

    if (!tokens.id_token) throw new BadRequestError('No id_tokens present google')

    const ticket = await this.googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    if (!payload?.email) {
      throw new UnauthorizedError('Invalid Google token.')
    }

    let user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      const password = bcrypt.hashSync(generatePassword())

      user = await this.userRepository.create({
        email: payload.email,
        name: payload.name,
        avatar: {
          url: payload.picture!
        },
        password
      })
    }

    return this.generateSessionToken(user)
  }

  async signin(payload: LoginDTO) {
    const rateLimitKey = `login:${payload.email}`

    if (await this.redisClient.get(rateLimitKey)) throw new TooManyRequest()
    const user = await this.userRepository.findByEmailAndSelectPassword(payload.email)

    if (!user) throw new NotFoundError('User does not exist. Please sign up')

    const isMatchPassword = bcrypt.compareSync(payload.password, user.password)
    if (!isMatchPassword) throw new BadRequestError('Email or password is not matching')

    const userData = JSON.stringify({
      id: user._id
    })

    await this.redisClient.set(
      rateLimitKey,
      userData,
      'EX',
      5 // one per 5 second
    )

    // case user enable 2fa
    if (user.two_FA) {
      // handle login 2fa
    }

    return this.generateSessionToken(user)
  }

  async refreshToken({ refresh_token: oldRefreshToken }: RefreshTokenDTO) {
    const decodedToken = jsonWebToken.verifyRefreshToken(oldRefreshToken)

    if (!decodedToken) throw new UnauthorizedError('Invalid or expired refresh token')

    const user = await this.userRepository.findById(decodedToken.id)
    if (!user) throw new UnauthorizedError('User does not exist. Please log in again')

    const sessionKey = `session:${decodedToken.id}:${decodedToken.sessionId}`
    const storedRefreshToken = await this.redisClient.get(sessionKey)

    if (!storedRefreshToken) throw new UnauthorizedError('Session not found. Please log in again.')

    // If the token in the DB is not the one submitted, it means the submitted
    if (storedRefreshToken !== oldRefreshToken) {
      await this.redisClient.del(sessionKey)
      throw new UnauthorizedError('Refresh token reuse detected. Session terminated')
    }

    // generate new pair of token
    await this.redisClient.del(sessionKey)

    const jwtPayload: JwtPayload = {
      id: decodedToken.id,
      roles: user.roles,
      sessionId: decodedToken.sessionId,
      permissions: user.permissions
    }

    const { accessToken, refreshToken: newRefreshToken } = jsonWebToken.generatePairOfJWTToken(jwtPayload)
    await this.redisClient.setex(sessionKey, SEVEN_DAYS_IN_SECONDS, newRefreshToken)

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(payload: JwtPayload, accessToken: string) {
    const { sessionId, id: userId } = payload
    const sessionKey = `session:${userId}:${sessionId}`

    const decoded = jsonWebToken.decoded(accessToken) as { exp: number }

    const expiresIn = decoded?.exp - Math.floor(Date.now() / 1000)

    if (expiresIn > 0) {
      await this.redisClient.set(`blacklist:${accessToken}`, 'true', 'EX', expiresIn)
    }

    await this.redisClient.del(sessionKey)
    return { id: userId }
  }

  async forgotPassowrd(payload: ForgotPasswordDTO) {
    const user = await this.userRepository.findByEmail(payload.email)
    if (!user) throw new NotFoundError('Can not find user')

    const resetToken = randomBytes(32).toString('hex')
    const resetKey = `password-reset:${resetToken}`

    await this.redisClient.setex(resetKey, FIFTEN_MINUTES_IN_SECONDS, user.id)

    const resetUrl = `http://${env.CLIENT_DOMAIN}/reset-password?&token=${resetToken}`
    const recipient = payload.email
    const subject = EMAIL_RESET_PASSWORD
    const holder = {
      reset_url: resetUrl
    }

    const htmlResetPasswordTemplate = EMAIL_TEMPLATE_RESET_PASSWORD

    const emailQueue = await QueueManager.getQueue(QueueName.EMAIL)
    await emailQueue.add(JobType.SEND_EMAIL, {
      payload: {
        recipient,
        message: htmlResetPasswordTemplate,
        holder,
        subject
      }
    })

    return {
      message: 'Reset password request has been set to your email'
    }
  }

  async resetPassword({ token, newPassword }: ResetPasswordDTO) {
    const resetKey = `password-reset:${token}`
    const userId = await this.redisClient.get(resetKey)

    if (!userId) {
      throw new BadRequestError('Token is invalid or has expired.')
    }

    await this.redisClient.del(resetKey)

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User associated with this token no longer exists.')
    }

    const newHashedPassword = await bcrypt.hash(newPassword, SALT_NUMBER)
    await this.userRepository.update({ _id: user.id }, { password: newHashedPassword })

    return {
      id: user._id,
      message: 'Reset password is successful. Please login again'
    }
  }

  async verifyToken2FA({ token }: VerifyToken2FADTO, userId: string) {
    const twoFAKey = `2fa:${userId}`
    const secret = await this.redisClient.get(twoFAKey)
    if (!secret) throw new BadRequestError('2FA expired')

    const isValid = await verify({ secret, token })
    if (!isValid) throw new BadRequestError('Invalid OPT 2FA')

    const result = await this.userRepository.update(
      { _id: userId },
      {
        two_FA: true,
        two_FA_secret: secret
      }
    )
    if (result) throw new BadRequestError('Something went wrong. Try again please')

    await this.redisClient.del(twoFAKey)

    return {
      userId
    }
  }

  private async sendVerificationOtp(email: string, userData: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const rateLimitKey = `register-rate-limit:${normalizedEmail}`

    if (await this.redisClient.get(rateLimitKey)) {
      throw new TooManyRequest('Too many requests. Please try again later')
    }

    const verificationToken = generateVerificationToken()
    const verificationKey = `verification-token:${normalizedEmail}:${verificationToken}`
    const pendingRegistrationKey = `pending-registration:${normalizedEmail}`
    const emailQueue = await QueueManager.getQueue(QueueName.EMAIL)

    await Promise.all([
      this.redisClient.set(verificationKey, userData, 'EX', ONE_MINUTES_IN_SECONDS),
      this.redisClient.set(pendingRegistrationKey, userData, 'EX', FIFTEN_MINUTES_IN_SECONDS),
      this.redisClient.set(rateLimitKey, 'true', 'EX', ONE_MINUTES_IN_SECONDS),
      emailQueue.add(JobType.SEND_EMAIL, {
        payload: {
          recipient: normalizedEmail,
          message: EMAIL_TEMPLATE_TWO_STEP_VERIFICATION,
          holder: {
            verification_code: verificationToken
          },
          subject: EMAIL_REGISTRATION_SUBJECT
        }
      })
    ])

    return {
      email: normalizedEmail,
      expiredIn: ONE_MINUTES_IN_SECONDS
    }
  }

  private async generateSessionToken(user: IUser) {
    const existingSessionKeys = await this.redisClient.keys(`session:${user._id}:*`)

    if (existingSessionKeys.length > 0) {
      await this.redisClient.del(existingSessionKeys)
    }

    const sessionId = uuidv4()
    const jwtPayload: JwtPayload = {
      id: `${user._id}`,
      permissions: user.permissions,
      roles: user.roles,
      sessionId
    }

    const { accessToken, refreshToken } = jsonWebToken.generatePairOfJWTToken(jwtPayload)
    const sessionKey = `session:${user._id}:${sessionId}`

    await this.redisClient.setex(sessionKey, SEVEN_DAYS_IN_SECONDS, refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }
}
export default AuthService
