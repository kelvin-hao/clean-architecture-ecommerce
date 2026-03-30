import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import DiscountRepository from './discount.repository'
import { ApplyDiscountDto, CreateDiscountDto, ProductItemDto, UpdateDiscountDto } from './discount.dto'
import { IDiscount } from '~/types/interface'
import { convertToObjectId } from '~/utils'
import { DISCOUNT_APPLY_TO, DISCOUNT_TYPE } from '~/types/type'
import { BadRequestError } from '~/helper/response/errorResponse'

@injectable()
class DiscountService {
  constructor(@inject(ContainerInjectionRegistry.DiscountRepository) private discountRepository: DiscountRepository) {}

  async createDiscount(payload: CreateDiscountDto) {
    const existing = await this.discountRepository.findByCode(payload.code)

    if (existing) {
      throw new BadRequestError('Discount code already exists')
    }

    return this.discountRepository.create({
      ...payload,
      code: payload.code.trim().toUpperCase(),
      vendor: convertToObjectId(payload.vendor),
      category_ids: payload.category_ids?.map((c) => convertToObjectId(c)),
      product_ids: payload.product_ids?.map((p) => convertToObjectId(p)),
      used_count: 0,
      user_usage: []
    })
  }

  async updateDiscount(id: string, payload: UpdateDiscountDto) {
    const discount = await this.discountRepository.findById(id)

    if (!discount) throw new BadRequestError('Discount not found')

    if (discount.used_count > 0) {
      throw new BadRequestError('Cannot update used discount')
    }

    return this.discountRepository.update({ _id: id }, payload)
  }

  async disableDiscount(id: string) {
    return this.discountRepository.update(
      { _id: id },
      {
        is_active: false
      }
    )
  }

  async getDiscountByCode(code: string) {
    const discount = await this.discountRepository.findByCode(code)

    if (!discount) throw new BadRequestError('Discount not found')

    return discount
  }

  async applyDiscount({ code, userId, products, orderValue }: ApplyDiscountDto) {
    const discount = await this.getDiscountByCode(code)

    await this.validateDiscount(discount, userId, orderValue, products)

    const discountAmount = this.calculateDiscount(discount, orderValue)

    // update usage counters
    await this.discountRepository.incrementUsedCount(discount._id, userId)

    return {
      discountAmount,
      finalPrice: orderValue - discountAmount
    }
  }

  private async validateDiscount(discount: IDiscount, userId: string, orderValue: number, products: ProductItemDto[]) {
    const now = new Date()

    if (!discount.is_active) {
      throw new BadRequestError('Discount inactive')
    }

    if (now < discount.start_date || now > discount.end_date) {
      throw new BadRequestError('Discount expired or not started')
    }

    if (orderValue < discount.min_order_value) {
      throw new BadRequestError('Order value not enough')
    }

    if (discount.max_uses && discount.used_count >= discount.max_uses) {
      throw new BadRequestError('Discount exhausted')
    }

    // 🔥 per user check
    const usage = await this.discountRepository.getUserUsage(discount._id, userId)

    if (usage && usage.used_count >= discount.max_uses_per_user) {
      throw new BadRequestError('User already used this discount')
    }

    // 🔥 product validation
    if (discount.apply_to === DISCOUNT_APPLY_TO.PRODUCT) {
      const discountProductIds = (discount.product_ids ?? []).map((id) => id.toString())
      const valid = products.some((product) => discountProductIds.includes(product.product_id))

      if (!valid) throw new BadRequestError('Discount not applicable to products')
    }
  }

  private calculateDiscount(discount: IDiscount, orderValue: number) {
    let discountAmount = 0

    if (discount.type === DISCOUNT_TYPE.PERCENT) {
      discountAmount = orderValue * (discount.value / 100)

      if (discount.max_discount_value) {
        discountAmount = Math.min(discountAmount, discount.max_discount_value)
      }
    }

    if (discount.type === DISCOUNT_TYPE.FIX) {
      discountAmount = discount.value
    }

    return Math.min(discountAmount, orderValue)
  }

  async getAvailableDiscounts({ vendorId, orderValue }: { vendorId: string; orderValue: number }) {
    const now = new Date()

    return this.discountRepository.findAll({
      vendor: vendorId,
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      min_order_value: { $lte: orderValue }
    })
  }

  async getVendorDiscounts(vendorId: string) {
    return this.discountRepository.findAll({
      vendor: vendorId
    })
  }
}

export default DiscountService
