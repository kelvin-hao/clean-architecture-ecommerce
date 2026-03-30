import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import PaymentService from './payment.service'
import {
  CreateCodPaymentDto,
  GetPaymentsQueryDto,
  MarkFailedPaymentDto,
  OrderPaymentParamsDto,
  PaymentIdParamsDto
} from './paymnet.dto'

@injectable()
class PaymentController {
  constructor(@inject(ContainerInjectionRegistry.PaymentService) private paymentService: PaymentService) {}

  async createPayment(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateCodPaymentDto
    const data = await this.paymentService.createPayment(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getPayments(req: Request, res: Response) {
    const query = (req.queryValidated ?? req.query) as GetPaymentsQueryDto
    const data = await this.paymentService.getPayments(query)

    return new OKResponse(data).send(req, res)
  }

  async getPaymentById(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as PaymentIdParamsDto
    const data = await this.paymentService.getPaymentById(id)

    return new OKResponse(data).send(req, res)
  }

  async getPaymentByOrderId(req: Request, res: Response) {
    const { orderId } = (req.paramsValidated ?? req.params) as OrderPaymentParamsDto
    const data = await this.paymentService.getPaymentByOrderId(orderId)

    return new OKResponse(data).send(req, res)
  }

  async markPaid(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as PaymentIdParamsDto
    const data = await this.paymentService.markPaid(id)

    return new OKResponse(data).send(req, res)
  }

  async markFailed(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as PaymentIdParamsDto
    const { reason } = (req.bodyValidated ?? req.body) as MarkFailedPaymentDto
    const data = await this.paymentService.markFailed(id, reason)

    return new OKResponse(data).send(req, res)
  }
}

export default PaymentController
