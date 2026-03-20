import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import VendorRepository from './vendor.repository'
import Redis from 'ioredis'
import { RegisterVendorDto, RejectVendorDto } from './vendor.dto'
import { VendorApplicationStatusEnum } from '~/types/type'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { slugify, convertToObjectId } from '~/utils'

@injectable()
class VendorService {
  constructor(
    @inject(ContainerInjectionRegistry.VendorRepository) private vendorRepository: VendorRepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async registryVendor(userId: string, payload: RegisterVendorDto) {
    const existedVendor = await this.vendorRepository.findOne({
      user_id: userId,
      status_application: VendorApplicationStatusEnum.PENDING
    })

    if (existedVendor) throw new BadRequestError('vendor already registered')

    const vendor = await this.vendorRepository.create({
      user_id: convertToObjectId(userId),
      shop_name: payload.shop_name,
      shop_slug: slugify(payload.shop_name),
      description: payload.description
    })

    return {
      id: vendor._id
    }
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

    return this.vendorRepository.update(vendorId, {
      status_application: VendorApplicationStatusEnum.REJECTED,
      reject_reason: payload.reason,
      verified: false
    })
  }

  async approveVendor(vendorId: string) {
    const vendor = await this.vendorRepository.findById(vendorId)

    if (!vendor) throw new NotFoundError('Vendor not found')

    if (vendor.status_application !== VendorApplicationStatusEnum.PENDING) {
      throw new BadRequestError('Only pending vendor can be approved')
    }

    return this.vendorRepository.update(vendorId, {
      status_application: VendorApplicationStatusEnum.APPROVED,
      verified: true
    })
  }
}

export default VendorService
