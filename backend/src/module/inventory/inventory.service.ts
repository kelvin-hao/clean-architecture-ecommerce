import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { APIFeatures } from '~/helper'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { convertToObjectId } from '~/utils'
import { ONE_DAYS_IN_SECONDS } from '~/utils/const.util'
import ProductSKURepository from '../product/product_sku.repository'
import InventoryRepository from './inventory.repository'
import { CreateInventoryDto, InventoryQueryDto, InventoryQuantityDto, UpdateInventoryDto } from './inventory.dto'

@injectable()
class InventoryService {
  constructor(
    @inject(ContainerInjectionRegistry.InventoryRepository) private inventoryRepository: InventoryRepository,
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async createInventory(skuId: string, payload: CreateInventoryDto) {
    await this.ensureSkuExists(skuId)

    const existingInventory = await this.inventoryRepository.findBySkuId(skuId)
    if (existingInventory) {
      throw new BadRequestError('Inventory already exists for this SKU')
    }

    const createdInventory = await this.inventoryRepository.create({
      skuId: convertToObjectId(skuId),
      location: payload.location?.trim() || 'default',
      stock: payload.stock,
      reserved: 0,
      available: payload.stock,
      sold: 0,
      is_delete: false
    })

    await this.syncAvailableStockCache(skuId, createdInventory.available)

    return createdInventory
  }

  async getInventories(query: InventoryQueryDto) {
    const filters: Record<string, unknown> = { is_delete: false }

    if (query.skuId) {
      filters.skuId = convertToObjectId(query.skuId)
    }

    if (query.location) {
      filters.location = query.location.trim()
    }

    if (query.lowStockOnly) {
      filters.available = { $lte: Number(query.threshold ?? 5) }
    }

    const inventoryFeatures = new APIFeatures(this.inventoryRepository.getQuery(filters), query).sort().paginate()
    const inventories = await inventoryFeatures.exec()

    return {
      data: inventories,
      meta: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        count: inventories.length
      }
    }
  }

  async getInventoryBySku(skuId: string) {
    await this.ensureSkuExists(skuId)

    const inventory = await this.inventoryRepository.findBySkuId(skuId)
    if (!inventory) {
      throw new NotFoundError('Inventory not found for this SKU')
    }

    return inventory
  }

  async updateInventory(skuId: string, payload: UpdateInventoryDto) {
    await this.ensureSkuExists(skuId)

    const inventory = await this.inventoryRepository.findBySkuId(skuId)
    if (!inventory) {
      throw new NotFoundError('Inventory not found for this SKU')
    }

    const nextStock = payload.stock ?? inventory.stock

    if (nextStock < inventory.reserved) {
      throw new BadRequestError('Stock can not be less than reserved quantity')
    }

    const updatedInventory = await this.inventoryRepository.upsertInventory(skuId, {
      location: payload.location?.trim() ?? inventory.location,
      stock: nextStock,
      reserved: inventory.reserved,
      available: nextStock - inventory.reserved,
      sold: inventory.sold
    })

    if (!updatedInventory) {
      throw new BadRequestError('Can not update inventory. Please try again')
    }

    await this.syncAvailableStockCache(skuId, updatedInventory.available)

    return updatedInventory
  }

  async reserveStock(skuId: string, payload: InventoryQuantityDto) {
    await this.ensureInventoryExists(skuId)

    const inventory = await this.inventoryRepository.reserveStock(skuId, payload.quantity)

    if (!inventory) {
      throw new BadRequestError('Not enough available stock to reserve')
    }

    await this.syncAvailableStockCache(skuId, inventory.available)

    return inventory
  }

  async releaseReservedStock(skuId: string, payload: InventoryQuantityDto) {
    await this.ensureInventoryExists(skuId)

    const inventory = await this.inventoryRepository.releaseReservedStock(skuId, payload.quantity)

    if (!inventory) {
      throw new BadRequestError('Reserved quantity is not enough to release')
    }

    await this.syncAvailableStockCache(skuId, inventory.available)

    return inventory
  }

  async commitReservedStock(skuId: string, payload: InventoryQuantityDto) {
    await this.ensureInventoryExists(skuId)

    const inventory = await this.inventoryRepository.commitReservedStock(skuId, payload.quantity)

    if (!inventory) {
      throw new BadRequestError('Reserved quantity is not enough to commit')
    }

    await this.syncAvailableStockCache(skuId, inventory.available)

    return inventory
  }

  private getInventoryStockKey(skuId: string) {
    return `inventory:available:${skuId}`
  }

  private async syncAvailableStockCache(skuId: string, available: number) {
    await this.redisClient.set(
      this.getInventoryStockKey(skuId),
      String(Math.max(0, available)),
      'EX',
      ONE_DAYS_IN_SECONDS
    )
  }

  private async ensureSkuExists(skuId: string) {
    const sku = await this.skuRepository.findOne({ _id: skuId, is_delete: false })

    if (!sku) {
      throw new NotFoundError('SKU not found')
    }

    return sku
  }

  private async ensureInventoryExists(skuId: string) {
    await this.ensureSkuExists(skuId)

    const inventory = await this.inventoryRepository.findBySkuId(skuId)

    if (!inventory) {
      throw new NotFoundError('Inventory not found for this SKU')
    }

    return inventory
  }
}

export default InventoryService
