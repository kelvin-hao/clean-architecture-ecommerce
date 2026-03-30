import { inject, injectable } from 'inversify'
import { FilterQuery, Model } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { IPayment } from './payment.model'

interface IPaymentRepository extends IRepositoryBase<IPayment> {
  findPaymentById(id: string): Promise<IPayment | null>
  findByOrderId(orderId: string): Promise<IPayment | null>
  findPayments(condition?: FilterQuery<IPayment>): Promise<IPayment[]>
}

@injectable()
class PaymentRepository extends RepositoryBase<IPayment> implements IPaymentRepository {
  constructor(@inject(ContainerInjectionRegistry.PaymentModel) paymentModel: Model<IPayment>) {
    super(paymentModel)
  }

  async findPaymentById(id: string): Promise<IPayment | null> {
    return this.model.findById(id).exec()
  }

  async findByOrderId(orderId: string): Promise<IPayment | null> {
    return this.model.findOne({ orderId }).exec()
  }

  async findPayments(condition: FilterQuery<IPayment> = {}): Promise<IPayment[]> {
    return this.model.find(condition).sort({ createdAt: -1 }).exec()
  }
}

export default PaymentRepository
