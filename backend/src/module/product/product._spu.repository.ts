import { inject, injectable } from 'inversify'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import mongoose, { ClientSession, FilterQuery, Model, Query } from 'mongoose'
import { IProductSPU } from './product_spu.model'

export interface IProductSPURepository extends IRepositoryBase<IProductSPU> {
  getQuery(condition?: FilterQuery<IProductSPU>): Query<IProductSPU[], IProductSPU>
  findBySlug(slug: string): Promise<IProductSPU | null>
  withTransaction<T>(callback: (session: ClientSession) => Promise<T>): Promise<T>
}

@injectable()
class ProductSPURepository extends RepositoryBase<IProductSPU> implements IProductSPURepository {
  constructor(@inject(ContainerInjectionRegistry.ProductSPUModel) model: Model<IProductSPU>) {
    super(model)
  }

  getQuery(condition: FilterQuery<IProductSPU> = {}): Query<IProductSPU[], IProductSPU> {
    return this.model.find({ is_delete: false, ...condition })
  }

  async findBySlug(slug: string): Promise<IProductSPU | null> {
    return this.model.findOne({ slug, is_delete: false }).exec()
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
