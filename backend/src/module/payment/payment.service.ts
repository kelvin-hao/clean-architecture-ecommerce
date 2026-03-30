import { inject, injectable } from 'inversify'
import { ConflictError, NotFoundError, BadRequestError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { convertToObjectId } from '~/utils'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '~/types/type'
import PaymentRepository from './payment.repository'
import { CreateCodPaymentDto, GetPaymentsQueryDto } from './paymnet.dto'

@injectable()
class PaymentService {
  constructor(@inject(ContainerInjectionRegistry.PaymentRepository) private paymentRepository: PaymentRepository) {}

  async createPayment(payload: CreateCodPaymentDto) {
    if (payload.method && payload.method !== PAYMENT_METHOD.COD) {
      throw new BadRequestError('Only COD payment is supported')
    }

    const existingPayment = await this.paymentRepository.findByOrderId(payload.orderId)

    if (existingPayment) {
      throw new ConflictError('Payment already exists for this order')
    }

    return this.paymentRepository.create({
      orderId: convertToObjectId(payload.orderId),
      amount: payload.amount,
      method: PAYMENT_METHOD.COD,
      status: PAYMENT_STATUS.PENDING
    })
  }

  async getPayments(query: GetPaymentsQueryDto) {
    const condition: Record<string, unknown> = {}

    if (query.orderId) {
      condition.orderId = query.orderId
    }

    if (query.status) {
      condition.status = query.status
    }

    return this.paymentRepository.findPayments(condition)
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findPaymentById(id)

    if (!payment) {
      throw new NotFoundError('Payment not found')
    }

    return payment
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.paymentRepository.findByOrderId(orderId)

    if (!payment) {
      throw new NotFoundError('Payment not found for this order')
    }

    return payment
  }

  async markPaid(id: string) {
    const payment = await this.getPaymentById(id)

    if (payment.status === PAYMENT_STATUS.SUCCESS) {
      throw new BadRequestError('Payment already marked as paid')
    }

    return this.paymentRepository.update(
      { _id: id },
      {
        status: PAYMENT_STATUS.SUCCESS,
        paid_at: new Date(),
        failure_reason: null
      }
    )
  }

  async markFailed(id: string, reason?: string) {
    const payment = await this.getPaymentById(id)

    if (payment.status === PAYMENT_STATUS.SUCCESS) {
      throw new BadRequestError('Cannot mark a successful payment as failed')
    }

    return this.paymentRepository.update(
      { _id: id },
      {
        status: PAYMENT_STATUS.FAILED,
        failure_reason: reason ?? 'COD payment failed',
        paid_at: null
      }
    )
  }
}

export default PaymentService
