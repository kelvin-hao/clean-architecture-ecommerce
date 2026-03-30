import { inject, injectable } from 'inversify'
import { FilterQuery, Model, Query } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ORDER_STATUS } from '~/types/type'
import { IOrder } from './order.model'

export interface IOrderRepository extends IRepositoryBase<IOrder> {
  getQuery(condition?: FilterQuery<IOrder>): Query<IOrder[], IOrder>
  findByUser(userId: string): Promise<IOrder[]>
  findByIdForUser(id: string, userId: string): Promise<IOrder | null>
  updateStatus(id: string, status: ORDER_STATUS): Promise<IOrder | null>
}

@injectable()
class OrderRepository extends RepositoryBase<IOrder> implements IOrderRepository {
  constructor(@inject(ContainerInjectionRegistry.OrderModel) private readonly orderModel: Model<IOrder>) {
    super(orderModel)
  }

  getQuery(condition: FilterQuery<IOrder> = {}): Query<IOrder[], IOrder> {
    return this.model.find({ is_delete: false, ...condition })
  }

  async findByUser(userId: string): Promise<IOrder[]> {
    return this.model.find({ user: userId, is_delete: false }).sort({ createdAt: -1 }).exec()
  }

  async findByIdForUser(id: string, userId: string): Promise<IOrder | null> {
    return this.model.findOne({ _id: id, user: userId, is_delete: false }).exec()
  }

  async updateStatus(id: string, status: ORDER_STATUS): Promise<IOrder | null> {
    return this.model.findOneAndUpdate({ _id: id, is_delete: false }, { status }, { new: true }).exec()
  }
}

export default OrderRepository
