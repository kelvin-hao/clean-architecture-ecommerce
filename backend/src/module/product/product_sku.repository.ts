import { inject, injectable } from 'inversify'
import { RepositoryBase } from '~/helper'
import { IProductSKU } from './product_sku.model'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { Model } from 'mongoose'

@injectable()
class ProductSKURepository extends RepositoryBase<IProductSKU> {
  constructor(@inject(ContainerInjectionRegistry.ProductSKUModel) model: Model<IProductSKU>) {
    super(model)
  }
}

export default ProductSKURepository
