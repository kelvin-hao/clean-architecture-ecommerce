import { inject, injectable } from 'inversify'
import { Model, Types } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { IDiscount } from '~/types/interface'

type DiscountUserUsage = {
  user_id: Types.ObjectId
  used_count: number
}

interface IDiscountRepository extends IRepositoryBase<IDiscount> {
  findByCode(code: string): Promise<IDiscount | null>
  getUserUsage(discountId: Types.ObjectId | string, userId: string): Promise<DiscountUserUsage | null>
  incrementUsedCount(discountId: Types.ObjectId | string, userId: string): Promise<IDiscount | null>
}

@injectable()
class DiscountRepository extends RepositoryBase<IDiscount> implements IDiscountRepository {
  constructor(@inject(ContainerInjectionRegistry.DiscountModel) discountModel: Model<IDiscount>) {
    super(discountModel)
  }

  async findByCode(code: string): Promise<IDiscount | null> {
    return await this.model.findOne({ code: code.trim().toUpperCase() }).exec()
  }

  async getUserUsage(discountId: Types.ObjectId | string, userId: string): Promise<DiscountUserUsage | null> {
    const discount = await this.model.findById(discountId).select('user_usage').lean<IDiscount>().exec()
    const usage = discount?.user_usage?.find((item) => item.user_id.toString() === userId)

    return usage ?? null
  }

  async incrementUsedCount(discountId: Types.ObjectId | string, userId: string): Promise<IDiscount | null> {
    const updatedDiscount = await this.model
      .findOneAndUpdate(
        { _id: discountId, 'user_usage.user_id': userId },
        {
          $inc: {
            used_count: 1,
            'user_usage.$.used_count': 1
          }
        },
        { new: true }
      )
      .exec()

    if (updatedDiscount) {
      return updatedDiscount
    }

    return await this.model
      .findByIdAndUpdate(
        discountId,
        {
          $inc: { used_count: 1 },
          $push: {
            user_usage: {
              user_id: new Types.ObjectId(userId),
              used_count: 1
            }
          }
        },
        { new: true }
      )
      .exec()
  }
}

export default DiscountRepository
