import { inject, injectable } from 'inversify'
import { Model } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { IDiscount } from '~/types/interface'

interface IDiscountRepository extends IRepositoryBase<IDiscount> {
  findByCode(code: string): Promise<IDiscount | null>
}

@injectable()
class DiscountRepository extends RepositoryBase<IDiscount> implements IDiscountRepository {
  constructor(@inject(ContainerInjectionRegistry.DiscountModel) discountModel: Model<IDiscount>) {
    super(discountModel)
  }

  async findByCode(code: string): Promise<IDiscount | null> {
    return await this.model.findOne({ code }).exec()
  }
}

export default DiscountRepository
