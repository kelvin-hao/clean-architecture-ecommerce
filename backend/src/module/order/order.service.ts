import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { APIFeatures } from '~/helper'
import { BadRequestError, ConflictError, NotFoundError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { convertToObjectId } from '~/utils'
import { ONE_DAYS_IN_SECONDS } from '~/utils/const.util'
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

type PreparedOrderItem = {
  skuId: string
  skuCode: string
  quantity: number
  available: number
  orderItem: IOrder['items'][number]
}

const ORDER_LOCK_TTL_SECONDS = 60

const RESERVE_ORDER_STOCK_LUA = `
local lockKey = KEYS[1]
local ttl = tonumber(ARGV[2])
local itemCount = tonumber(ARGV[3])
local reservationKey = KEYS[itemCount + 2]

if redis.call('EXISTS', lockKey) == 1 then
  return {0, 'ORDER_IN_PROGRESS'}
end

redis.call('SET', lockKey, ARGV[1], 'EX', ttl)

for index = 1, itemCount do
  local stockKey = KEYS[index + 1]
  local quantity = tonumber(ARGV[index + 3])
  local available = tonumber(redis.call('GET', stockKey) or '-1')

  if available < 0 then
    redis.call('DEL', lockKey)
    return {0, 'STOCK_KEY_MISSING', stockKey}
  end

  if available < quantity then
    redis.call('DEL', lockKey)
    return {0, 'INSUFFICIENT_STOCK', stockKey, tostring(available)}
  end
end

for index = 1, itemCount do
  local stockKey = KEYS[index + 1]
  local quantity = tonumber(ARGV[index + 3])

  redis.call('DECRBY', stockKey, quantity)
  redis.call('HSET', reservationKey, stockKey, quantity)
end

redis.call('EXPIRE', reservationKey, ttl)

return {1, 'RESERVED'}
`

const RELEASE_ORDER_STOCK_LUA = `
local itemCount = tonumber(ARGV[1])

for index = 1, itemCount do
  local stockKey = KEYS[index]
  local quantity = tonumber(ARGV[index + 1])

  if quantity and quantity > 0 then
    redis.call('INCRBY', stockKey, quantity)
  end
end

redis.call('DEL', KEYS[itemCount + 1], KEYS[itemCount + 2])

return {1, 'RELEASED'}
`

@injectable()
class OrderService {
  constructor(
    @inject(ContainerInjectionRegistry.OrderRepository) private orderRepository: OrderRepository,
    @inject(ContainerInjectionRegistry.CartRepository) private cartRepository: CartRepository,
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository,
    @inject(ContainerInjectionRegistry.InventoryRepository) private inventoryRepository: InventoryRepository,
    @inject(ContainerInjectionRegistry.PaymentService) private paymentService: PaymentService,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async createOrder(userId: string, payload: CreateOrderDto) {
    if (payload.payment_method && payload.payment_method !== PAYMENT_METHOD.COD) {
      throw new BadRequestError('Only COD payment is supported right now')
    }

    const shippingAddress = payload.shipping_address.trim()

    if (!shippingAddress) {
      throw new BadRequestError('Shipping address is required')
    }

    const cartItems = await this.cartRepository.getItems(userId)

    if (cartItems.length === 0) {
      throw new BadRequestError('Cart is empty')
    }

    const reservationKey = this.getOrderReservationKey(userId)
    const reservedItems: ReservedStockItem[] = []
    const committedItems: ReservedStockItem[] = []
    let createdOrder: IOrder | null = null
    let redisReservationCreated = false

    try {
      const preparedItems = await Promise.all(
        cartItems.map(async (cartItem): Promise<PreparedOrderItem> => {
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

          const inventory = await this.inventoryRepository.findBySkuId(cartItem.skuId)

          if (!inventory) {
            throw new NotFoundError(`Inventory not found for SKU ${sku.sku_code}`)
          }

          await this.ensureInventoryStockCache(cartItem.skuId, inventory.available)

          const price = sku.price ?? spu.base_price ?? 0

          return {
            skuId: cartItem.skuId,
            skuCode: sku.sku_code,
            quantity: cartItem.quantity,
            available: inventory.available,
            orderItem: {
              product_spu: convertToObjectId(String(spu._id)),
              product_sku: convertToObjectId(cartItem.skuId),
              name: spu.name,
              image: spu.images?.[0]?.url ?? '',
              price,
              quantity: cartItem.quantity,
              total: price * cartItem.quantity
            }
          }
        })
      )

      const skuCodeById = new Map(preparedItems.map((item) => [item.skuId, item.skuCode]))

      await this.reserveStockWithLua(
        userId,
        reservationKey,
        preparedItems.map(({ skuId, quantity }) => ({ skuId, quantity })),
        skuCodeById
      )
      redisReservationCreated = true

      for (const item of preparedItems) {
        const reserved = await this.inventoryRepository.reserveStock(item.skuId, item.quantity)

        if (!reserved) {
          throw new BadRequestError(`Not enough stock for SKU ${item.skuCode}`)
        }

        reservedItems.push({ skuId: item.skuId, quantity: item.quantity })
      }

      const orderItems = preparedItems.map((item) => item.orderItem)
      const totalPrice = orderItems.reduce((sum, item) => sum + item.total, 0)

      createdOrder = await this.orderRepository.create({
        user: convertToObjectId(userId),
        items: orderItems,
        total_price: totalPrice,
        status: ORDER_STATUS.PENDDING,
        shipping_address: shippingAddress,
        payment_method: PAYMENT_METHOD.COD,
        isPaied: false,
        is_delete: false
      })

      const payment = await this.paymentService.createPayment({
        orderId: String(createdOrder._id),
        amount: totalPrice,
        method: PAYMENT_METHOD.COD
      } as CreateCodPaymentDto)

      for (const item of reservedItems) {
        const committed = await this.inventoryRepository.commitReservedStock(item.skuId, item.quantity)

        if (!committed) {
          throw new BadRequestError(`Can not commit stock for SKU ${skuCodeById.get(item.skuId) ?? item.skuId}`)
        }

        committedItems.push(item)
      }

      await Promise.all([
        this.cartRepository.clear(userId).catch(() => undefined),
        this.clearRedisOrderState(userId, reservationKey).catch(() => undefined)
      ])

      return {
        order: createdOrder,
        payment
      }
    } catch (error) {
      await this.rollbackMongoStockChanges(reservedItems, committedItems)

      if (createdOrder) {
        await this.orderRepository.delete({ _id: createdOrder._id }).catch(() => false)
      }

      if (redisReservationCreated) {
        await this.releaseReservedStockWithLua(userId, reservationKey, cartItems).catch(() => null)
      } else {
        await this.clearRedisOrderState(userId, reservationKey).catch(() => null)
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
      order.items.map(async (item) => {
        const inventory = await this.inventoryRepository.restockCommittedStock(String(item.product_sku), item.quantity)

        if (inventory) {
          await this.setInventoryStockCache(String(item.product_sku), inventory.available)
        }
      })
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

  private getOrderLockKey(userId: string) {
    return `order:lock:${userId}`
  }

  private getOrderReservationKey(userId: string) {
    return `order:reservation:${userId}:${Date.now()}`
  }

  private getInventoryStockKey(skuId: string) {
    return `inventory:available:${skuId}`
  }

  private async ensureInventoryStockCache(skuId: string, available: number) {
    await this.redisClient.set(
      this.getInventoryStockKey(skuId),
      String(Math.max(0, available)),
      'EX',
      ONE_DAYS_IN_SECONDS,
      'NX'
    )
  }

  private async setInventoryStockCache(skuId: string, available: number) {
    await this.redisClient.set(
      this.getInventoryStockKey(skuId),
      String(Math.max(0, available)),
      'EX',
      ONE_DAYS_IN_SECONDS
    )
  }

  private async reserveStockWithLua(
    userId: string,
    reservationKey: string,
    items: ReservedStockItem[],
    skuCodeById: Map<string, string>
  ) {
    const stockKeys = items.map((item) => this.getInventoryStockKey(item.skuId))
    const result = (await this.redisClient.eval(
      RESERVE_ORDER_STOCK_LUA,
      stockKeys.length + 2,
      this.getOrderLockKey(userId),
      ...stockKeys,
      reservationKey,
      reservationKey,
      String(ORDER_LOCK_TTL_SECONDS),
      String(items.length),
      ...items.map((item) => String(item.quantity))
    )) as Array<string | number | null>

    const status = Number(result[0] ?? 0)
    const reason = String(result[1] ?? '')

    if (status === 1) {
      return
    }

    if (reason === 'ORDER_IN_PROGRESS') {
      throw new ConflictError('An order from this cart is already being processed')
    }

    if (reason === 'INSUFFICIENT_STOCK') {
      const failedKey = String(result[2] ?? '')
      const failedSkuId = failedKey.replace('inventory:available:', '')
      const skuCode = skuCodeById.get(failedSkuId) ?? failedSkuId

      throw new BadRequestError(`Not enough stock for SKU ${skuCode}`)
    }

    throw new BadRequestError('Unable to reserve stock for this order right now')
  }

  private async releaseReservedStockWithLua(userId: string, reservationKey: string, items: ReservedStockItem[]) {
    if (items.length === 0) {
      await this.clearRedisOrderState(userId, reservationKey)
      return
    }

    const stockKeys = items.map((item) => this.getInventoryStockKey(item.skuId))

    await this.redisClient.eval(
      RELEASE_ORDER_STOCK_LUA,
      stockKeys.length + 2,
      ...stockKeys,
      reservationKey,
      this.getOrderLockKey(userId),
      String(items.length),
      ...items.map((item) => String(item.quantity))
    )
  }

  private async clearRedisOrderState(userId: string, reservationKey: string) {
    await this.redisClient.del(this.getOrderLockKey(userId), reservationKey)
  }

  private async rollbackMongoStockChanges(reservedItems: ReservedStockItem[], committedItems: ReservedStockItem[]) {
    const committedSkuIds = new Set(committedItems.map((item) => item.skuId))
    const itemsToRelease = reservedItems.filter((item) => !committedSkuIds.has(item.skuId))

    await Promise.allSettled([
      ...committedItems.map((item) => this.inventoryRepository.restockCommittedStock(item.skuId, item.quantity)),
      ...itemsToRelease.map((item) => this.inventoryRepository.releaseReservedStock(item.skuId, item.quantity))
    ])
  }
}

export default OrderService
