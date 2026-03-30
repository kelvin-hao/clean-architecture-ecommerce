import { inject, injectable } from 'inversify'
import { ClientSession, FilterQuery, Model, Query, Types, UpdateQuery } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { IInventory } from './inventory.model'

export interface IInventoryRepository extends IRepositoryBase<IInventory> {
  getQuery(condition?: FilterQuery<IInventory>): Query<IInventory[], IInventory>
  findBySkuId(skuId: string): Promise<IInventory | null>
  upsertInventory(skuId: string, data: Partial<IInventory>, session?: ClientSession): Promise<IInventory | null>
  reserveStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null>
  releaseReservedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null>
  commitReservedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null>
  restockCommittedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null>
  updateMany(filter: FilterQuery<IInventory>, update: UpdateQuery<IInventory>, session?: ClientSession): Promise<number>
}

@injectable()
class InventoryRepository extends RepositoryBase<IInventory> implements IInventoryRepository {
  constructor(@inject(ContainerInjectionRegistry.InventoryModel) private readonly inventoryModel: Model<IInventory>) {
    super(inventoryModel)
  }

  getQuery(condition: FilterQuery<IInventory> = {}): Query<IInventory[], IInventory> {
    return this.model.find({ is_delete: false, ...condition })
  }

  async findBySkuId(skuId: string): Promise<IInventory | null> {
    return this.model.findOne({ skuId: new Types.ObjectId(skuId), is_delete: false }).exec()
  }

  async upsertInventory(skuId: string, data: Partial<IInventory>, session?: ClientSession): Promise<IInventory | null> {
    return this.model
      .findOneAndUpdate(
        { skuId: new Types.ObjectId(skuId), is_delete: false },
        {
          $set: {
            ...data,
            skuId: new Types.ObjectId(skuId)
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          session
        }
      )
      .exec()
  }

  async reserveStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null> {
    return this.model
      .findOneAndUpdate(
        {
          skuId: new Types.ObjectId(skuId),
          is_delete: false,
          available: { $gte: quantity }
        },
        {
          $inc: {
            reserved: quantity,
            available: -quantity
          }
        },
        { new: true, session }
      )
      .exec()
  }

  async releaseReservedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null> {
    return this.model
      .findOneAndUpdate(
        {
          skuId: new Types.ObjectId(skuId),
          is_delete: false,
          reserved: { $gte: quantity }
        },
        {
          $inc: {
            reserved: -quantity,
            available: quantity
          }
        },
        { new: true, session }
      )
      .exec()
  }

  async commitReservedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null> {
    return this.model
      .findOneAndUpdate(
        {
          skuId: new Types.ObjectId(skuId),
          is_delete: false,
          reserved: { $gte: quantity }
        },
        {
          $inc: {
            reserved: -quantity,
            stock: -quantity,
            sold: quantity
          }
        },
        { new: true, session }
      )
      .exec()
  }

  async restockCommittedStock(skuId: string, quantity: number, session?: ClientSession): Promise<IInventory | null> {
    return this.model
      .findOneAndUpdate(
        {
          skuId: new Types.ObjectId(skuId),
          is_delete: false,
          sold: { $gte: quantity }
        },
        {
          $inc: {
            stock: quantity,
            available: quantity,
            sold: -quantity
          }
        },
        { new: true, session }
      )
      .exec()
  }

  async updateMany(filter: FilterQuery<IInventory>, update: UpdateQuery<IInventory>, session?: ClientSession) {
    const result = await this.model.updateMany(filter, update, { session }).exec()

    return result.modifiedCount
  }
}

export default InventoryRepository
