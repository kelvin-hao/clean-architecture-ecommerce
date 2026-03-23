import { injectable, inject } from 'inversify'
import { ClientSession, Model } from 'mongoose'

import { IRepositoryBase, RepositoryBase } from '~/helper'
import { IProductSKU } from './product_sku.model'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'

export interface IProductSKURepository extends IRepositoryBase<IProductSKU> {
  createMany(data: Partial<IProductSKU>[], session?: ClientSession): Promise<IProductSKU[]>
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
}

export default ProductSKURepository
