import { inject, injectable } from 'inversify'
import { RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { Model } from 'mongoose'
import { IProductSPU } from './product_spu.model'

@injectable()
class ProductSPURepository extends RepositoryBase<IProductSPU> {
  constructor(@inject(ContainerInjectionRegistry.ProductSPUModel) model: Model<IProductSPU>) {
    super(model)
  }
}

export default ProductSPURepository
