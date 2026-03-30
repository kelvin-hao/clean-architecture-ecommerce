import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import VendorRepository from './vendor.repository'
import { GetVendorsQueryDto, RegisterVendorDto, RejectVendorDto } from './vendor.dto'
import { VendorApplicationStatusEnum } from '~/types/type'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { slugify, convertToObjectId } from '~/utils'
import UserRepository from '../user/user.repository'
import RoleRepository from '../rbac/role.repository'

@injectable()
class VendorService {
  constructor(
    @inject(ContainerInjectionRegistry.VendorRepository) private vendorRepository: VendorRepository,
    @inject(ContainerInjectionRegistry.UserRepository) private userRepository: UserRepository,
    @inject(ContainerInjectionRegistry.RoleRepository) private roleRepository: RoleRepository
  ) {}

  async registryVendor(userId: string, payload: RegisterVendorDto) {
    const normalizedUserId = convertToObjectId(userId)
    const existedVendor = await this.vendorRepository.findOne({
      user_id: normalizedUserId
    })

    if (existedVendor?.status_application === VendorApplicationStatusEnum.PENDING) {
      throw new BadRequestError('Vendor application is already pending')
    }

    if (existedVendor?.status_application === VendorApplicationStatusEnum.APPROVED) {
      throw new BadRequestError('Vendor already approved')
    }

    if (existedVendor) {
      const updatedVendor = await this.vendorRepository.update(
        { _id: existedVendor._id },
        {
          shop_name: payload.shop_name,
          shop_slug: slugify(payload.shop_name),
          description: payload.description,
          status_application: VendorApplicationStatusEnum.PENDING,
          reject_reason: '',
          verified: false
        }
      )

      return {
        id: updatedVendor?._id
      }
    }

    const vendor = await this.vendorRepository.create({
      user_id: normalizedUserId,
      shop_name: payload.shop_name,
      shop_slug: slugify(payload.shop_name),
      description: payload.description,
      verified: false,
      status_application: VendorApplicationStatusEnum.PENDING
    })

    return {
      id: vendor._id
    }
  }

  async getVendors(query: GetVendorsQueryDto) {
    const filter = query.status_application
      ? {
          status_application: query.status_application
        }
      : undefined

    return this.vendorRepository.findAll(filter)
  }

  async getMyVendor(userId: string) {
    const vendor = await this.vendorRepository.findOne({
      user_id: convertToObjectId(userId)
    })

    if (!vendor) {
      throw new NotFoundError('Vendor not found')
    }

    return vendor
  }

  async getVendor(vendorId: string) {
    const vendor = await this.vendorRepository.findById(vendorId)

    if (!vendor) {
      throw new NotFoundError('Vendor not found')
    }

    return vendor
  }

  async rejectVendor(vendorId: string, payload: RejectVendorDto) {
    const vendor = await this.vendorRepository.findById(vendorId)

    if (!vendor) throw new NotFoundError('Vendor not found')

    if (vendor.status_application !== VendorApplicationStatusEnum.PENDING) {
      throw new BadRequestError('Only pending vendor can be rejected')
    }

    return this.vendorRepository.update(
      { _id: vendorId },
      {
        status_application: VendorApplicationStatusEnum.REJECTED,
        reject_reason: payload.reason,
        verified: false
      }
    )
  }

  async approveVendor(vendorId: string) {
    const vendor = await this.vendorRepository.findById(vendorId)

    if (!vendor) throw new NotFoundError('Vendor not found')

    if (vendor.status_application !== VendorApplicationStatusEnum.PENDING) {
      throw new BadRequestError('Only pending vendor can be approved')
    }

    const updatedVendor = await this.vendorRepository.update(
      { _id: vendorId },
      {
        status_application: VendorApplicationStatusEnum.APPROVED,
        verified: true,
        reject_reason: ''
      }
    )

    await this.syncSellerRole(vendor.user_id.toString())

    return updatedVendor
  }

  private async syncSellerRole(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError('User not found')

    const sellerRole = await this.roleRepository.findByName('seller')
    if (!sellerRole) return

    const roles = Array.from(new Set([...(user.roles ?? []), sellerRole.name]))
    const permissions = Array.from(new Set([...(user.permissions ?? []), ...(sellerRole.permissions ?? [])]))

    await this.userRepository.update(
      { _id: userId },
      {
        roles,
        permissions
      }
    )
  }
}

export default VendorService
