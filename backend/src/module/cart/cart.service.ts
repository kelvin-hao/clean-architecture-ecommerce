import { inject, injectable } from 'inversify'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ProductStatusEnum } from '~/types/type'
import CartRepository from './cart.repository'
import ProductSKURepository from '../product/product_sku.repository'
import ProductSPURepository from '../product/product._spu.repository'
import { AddCartItemDto } from './cart.dto'

@injectable()
class CartService {
  constructor(
    @inject(ContainerInjectionRegistry.CartRepository) private cartRepository: CartRepository,
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository
  ) {}

  async addItem(userId: string, payload: AddCartItemDto) {
    await this.ensureSkuCanBeAdded(payload.sku_id)
    await this.cartRepository.addItem(userId, payload.sku_id, payload.quantity)

    return this.getCart(userId)
  }

  async updateItem(userId: string, skuId: string, quantity: number) {
    if (quantity > 0) {
      await this.ensureSkuCanBeAdded(skuId)
    }

    await this.cartRepository.setItem(userId, skuId, quantity)

    return this.getCart(userId)
  }

  async removeItem(userId: string, skuId: string) {
    await this.cartRepository.removeItem(userId, skuId)

    return this.getCart(userId)
  }

  async clearCart(userId: string) {
    await this.cartRepository.clear(userId)

    return {
      message: 'Cart cleared successfully'
    }
  }

  async getCart(userId: string) {
    const items = await this.cartRepository.getItems(userId)

    if (items.length === 0) {
      return {
        items: [],
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0
      }
    }

    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const sku = await this.skuRepository.findById(item.skuId)

        if (!sku || sku.is_active === false) {
          await this.cartRepository.removeItem(userId, item.skuId)
          return null
        }

        const spu = await this.spuRepository.findById(String(sku.spu))

        if (!spu) {
          await this.cartRepository.removeItem(userId, item.skuId)
          return null
        }

        const unitPrice = sku.price ?? spu.base_price ?? 0

        return {
          sku_id: item.skuId,
          sku_code: sku.sku_code,
          quantity: item.quantity,
          unitPrice,
          subtotal: unitPrice * item.quantity,
          variation_values: sku.variation_values,
          product: {
            id: spu._id,
            name: spu.name,
            slug: spu.slug,
            images: spu.images,
            status: spu.status
          }
        }
      })
    )

    const validItems = detailedItems.filter((item) => item !== null)
    const totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = validItems.reduce((sum, item) => sum + item.subtotal, 0)

    return {
      items: validItems,
      totalItems: validItems.length,
      totalQuantity,
      totalAmount
    }
  }

  private async ensureSkuCanBeAdded(skuId: string) {
    const sku = await this.skuRepository.findById(skuId)

    if (!sku) {
      throw new NotFoundError('SKU not found')
    }

    if (sku.is_active === false) {
      throw new BadRequestError('SKU is inactive')
    }

    const spu = await this.spuRepository.findById(String(sku.spu))

    if (!spu) {
      throw new NotFoundError('Product not found')
    }

    if (spu.status && spu.status !== ProductStatusEnum.ACTIVE) {
      throw new BadRequestError('Product is not available for purchase')
    }

    return { sku, spu }
  }
}

export default CartService
