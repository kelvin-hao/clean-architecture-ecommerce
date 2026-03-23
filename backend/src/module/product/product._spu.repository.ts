import { inject, injectable } from 'inversify'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import mongoose, { ClientSession, Model } from 'mongoose'
import { IProductSPU } from './product_spu.model'
import { Query } from 'mongoose'

export interface IProductSPURepository extends IRepositoryBase<IProductSPU> {
  getQuery(): Query<IProductSPU[], IProductSPU>
  withTransaction<T>(callback: (session: ClientSession) => Promise<T>): Promise<T>
}

@injectable()
class ProductSPURepository extends RepositoryBase<IProductSPU> {
  constructor(@inject(ContainerInjectionRegistry.ProductSPUModel) model: Model<IProductSPU>) {
    super(model)
  }

  getQuery(): Query<IProductSPU[], IProductSPU> {
    return this.model.find()
  }

  async withTransaction<T>(callback: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession()

    try {
      session.startTransaction()
      const result = await callback(session)
      await session.commitTransaction()

      return result
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}

export default ProductSPURepository
