import { inject, injectable } from 'inversify'
import { APIFeatures } from '~/helper'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { convertToObjectId } from '~/utils'
import { ORDER_STATUS, PAYMENT_METHOD, ProductStatusEnum } from '~/types/type'
import CartRepository from '../cart/cart.repository'
import InventoryRepository from '../inventory/inventory.repository'
import PaymentService from '../payment/payment.service'
import ProductSPURepository from '../product/product._spu.repository'
import ProductSKURepository from '../product/product_sku.repository'
import { CreateCodPaymentDto } from '../payment/paymnet.dto'
import { CreateOrderDto, OrderQueryDto } from './order.dto'
import OrderRepository from './order.repository'
import { IOrder } from './order.model'

type ReservedStockItem = {
  skuId: string
  quantity: number
}

@injectable()
class OrderService {
  constructor(
    @inject(ContainerInjectionRegistry.OrderRepository) private orderRepository: OrderRepository,
    @inject(ContainerInjectionRegistry.CartRepository) private cartRepository: CartRepository,
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository,
    @inject(ContainerInjectionRegistry.InventoryRepository) private inventoryRepository: InventoryRepository,
    @inject(ContainerInjectionRegistry.PaymentService) private paymentService: PaymentService
  ) {}

  async createOrder(userId: string, payload: CreateOrderDto) {
    if (payload.payment_method && payload.payment_method !== PAYMENT_METHOD.COD) {
      throw new BadRequestError('Only COD payment is supported right now')
    }

    const cartItems = await this.cartRepository.getItems(userId)

    if (cartItems.length === 0) {
      throw new BadRequestError('Cart is empty')
    }

    const reservedItems: ReservedStockItem[] = []
    let createdOrder: IOrder | null = null
    let inventoryCommitted = false

    try {
      const orderItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          const sku = await this.skuRepository.findOne({ _id: convertToObjectId(cartItem.skuId), is_delete: false })

          if (!sku) {
            throw new NotFoundError('SKU not found')
          }

          if (sku.is_active === false) {
            throw new BadRequestError('SKU is inactive')
          }

          const spu = await this.spuRepository.findOne({ _id: convertToObjectId(String(sku.spu)), is_delete: false })

          if (!spu) {
            throw new NotFoundError('Product not found')
          }

          if (spu.status && spu.status !== ProductStatusEnum.ACTIVE) {
            throw new BadRequestError('Product is not available for ordering')
          }

          const reserved = await this.inventoryRepository.reserveStock(cartItem.skuId, cartItem.quantity)

          if (!reserved) {
            throw new BadRequestError(`Not enough stock for SKU ${sku.sku_code}`)
          }

          reservedItems.push({ skuId: cartItem.skuId, quantity: cartItem.quantity })

          const price = sku.price ?? spu.base_price ?? 0

          return {
            product_spu: convertToObjectId(String(spu._id)),
            product_sku: convertToObjectId(cartItem.skuId),
            name: spu.name,
            image: spu.images?.[0]?.url ?? '',
            price,
            quantity: cartItem.quantity,
            total: price * cartItem.quantity
          }
        })
      )

      const totalPrice = orderItems.reduce((sum, item) => sum + item.total, 0)

      createdOrder = await this.orderRepository.create({
        user: convertToObjectId(userId),
        items: orderItems,
        total_price: totalPrice,
        status: ORDER_STATUS.PENDDING,
        shipping_address: payload.shipping_address.trim(),
        payment_method: PAYMENT_METHOD.COD,
        isPaied: false,
        is_delete: false
      })

      const payment = await this.paymentService.createPayment({
        orderId: String(createdOrder._id),
        amount: totalPrice,
        method: PAYMENT_METHOD.COD
      } as CreateCodPaymentDto)

      await Promise.all(
        reservedItems.map((item) => this.inventoryRepository.commitReservedStock(item.skuId, item.quantity))
      )
      inventoryCommitted = true

      await this.cartRepository.clear(userId).catch(() => undefined)

      return {
        order: createdOrder,
        payment
      }
    } catch (error) {
      if (!inventoryCommitted) {
        await Promise.all(
          reservedItems.map((item) =>
            this.inventoryRepository.releaseReservedStock(item.skuId, item.quantity).catch(() => null)
          )
        )

        if (createdOrder) {
          await this.orderRepository.delete({ _id: createdOrder._id }).catch(() => false)
        }
      }

      throw error
    }
  }

  async getOrders(userId: string, query: OrderQueryDto) {
    const filters: Record<string, unknown> = {
      user: convertToObjectId(userId)
    }

    if (query.status) {
      filters.status = query.status
    }

    const orderFeatures = new APIFeatures(this.orderRepository.getQuery(filters), query).sort().paginate()
    const orders = await orderFeatures.exec()

    return {
      data: orders,
      meta: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        count: orders.length
      }
    }
  }

  async getOrderById(userId: string, id: string) {
    const order = await this.orderRepository.findByIdForUser(id, userId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    return order
  }

  async markDelivery(id: string) {
    const order = await this.orderRepository.findOne({ _id: convertToObjectId(id) })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new BadRequestError('Cancelled order can not be shipped')
    }

    if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.COMEPLETED) {
      throw new BadRequestError('Order has already been shipped')
    }

    const updatedOrder = await this.orderRepository.updateStatus(id, ORDER_STATUS.SHIPPED)

    if (!updatedOrder) {
      throw new BadRequestError('Can not update order status')
    }

    return updatedOrder
  }

  async cancelOrder(userId: string, id: string) {
    const order = await this.getOrderById(userId, id)

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new BadRequestError('Order already cancelled')
    }

    if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.COMEPLETED) {
      throw new BadRequestError('Can not cancel order after shipping')
    }

    await Promise.all(
      order.items.map((item) => this.inventoryRepository.restockCommittedStock(String(item.product_sku), item.quantity))
    )

    const updatedOrder = await this.orderRepository.update(
      { _id: convertToObjectId(id), user: convertToObjectId(userId) },
      { status: ORDER_STATUS.CANCELLED }
    )

    try {
      const payment = await this.paymentService.getPaymentByOrderId(id)
      await this.paymentService.markFailed(String(payment._id), 'Order cancelled by user')
    } catch {
      // ignore missing payment record during cancellation cleanup
    }

    if (!updatedOrder) {
      throw new BadRequestError('Can not cancel order. Please try again')
    }

    return updatedOrder
  }
}

export default OrderService
