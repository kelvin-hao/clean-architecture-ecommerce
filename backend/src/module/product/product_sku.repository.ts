import { injectable, inject } from 'inversify'
import { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose'

import { IRepositoryBase, RepositoryBase } from '~/helper'
import { IProductSKU } from './product_sku.model'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'

export interface IProductSKURepository extends IRepositoryBase<IProductSKU> {
  createMany(data: Partial<IProductSKU>[], session?: ClientSession): Promise<IProductSKU[]>
  findBySpu(spuId: string): Promise<IProductSKU[]>
  updateMany(
    filter: FilterQuery<IProductSKU>,
    update: UpdateQuery<IProductSKU>,
    session?: ClientSession
  ): Promise<number>
}

@injectable()
class ProductSKURepository extends RepositoryBase<IProductSKU> implements IProductSKURepository {
  constructor(
    @inject(ContainerInjectionRegistry.ProductSKUModel)
    private readonly skuModel: Model<IProductSKU>
  ) {
    super(skuModel)
  }

  async createMany(data: Partial<IProductSKU>[], session?: ClientSession): Promise<IProductSKU[]> {
    const docs = await this.model.insertMany(data, { session })

    return docs.map((doc) => doc.toObject<IProductSKU>())
  }

  async findBySpu(spuId: string): Promise<IProductSKU[]> {
    return this.model.find({ spu: spuId, is_delete: false }).exec()
  }

  async updateMany(filter: FilterQuery<IProductSKU>, update: UpdateQuery<IProductSKU>, session?: ClientSession) {
    const result = await this.model.updateMany(filter, update, { session }).exec()

    return result.modifiedCount
  }
}

export default ProductSKURepository
