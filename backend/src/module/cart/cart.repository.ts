import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ONE_DAYS_IN_SECONDS } from '~/utils/const.util'

@injectable()
class CartRepository {
  constructor(@inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis) {}

  private getKey(userID: string) {
    return `cart:${userID}`
  }

  async addItem(userID: string, sku_id: string, quantity: number) {
    const key = this.getKey(userID)

    await this.redisClient.hincrby(key, sku_id, quantity)
    await this.redisClient.expire(key, ONE_DAYS_IN_SECONDS)
  }

  async setItem(userID: string, sku_id: string, quantity: number) {
    const key = this.getKey(userID)

    if (quantity <= 0) await this.redisClient.hdel(key)
    else await this.redisClient.hset(key, sku_id, quantity)
  }

  async removeItem(userID: string, sku_id: string) {
    await this.redisClient.hdel(this.getKey(userID), sku_id)
  }

  async getItems(userId: string): Promise<{ skuId: string; quantity: number }[]> {
    const data = await this.redisClient.hgetall(this.getKey(userId))

    return Object.entries(data).map(([skuId, qty]) => ({
      skuId,
      quantity: Number(qty)
    }))
  }

  async clear(userID: string) {
    await this.redisClient.del(this.getKey(userID))
  }
}

export default CartRepository
