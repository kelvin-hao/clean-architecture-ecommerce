import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import catchErrorHandler from '~/middleware/catchError.mid'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import isAuth from '~/middleware/isAuth.mid'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import PaymentController from './payment.controller'
import {
  CreateCodPaymentDto,
  GetPaymentsQueryDto,
  MarkFailedPaymentDto,
  OrderPaymentParamsDto,
  PaymentIdParamsDto
} from './paymnet.dto'

const createPaymentRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const paymentController = await container.getAsync<PaymentController>(ContainerInjectionRegistry.PaymentController)
  const paymentRoute = express.Router()

  paymentRoute
    .route(routeConfig.payments.child.root.path)
    .get(
      isAuth,
      validationInput(GetPaymentsQueryDto, RequestPartEnum.QUERY),
      catchErrorHandler(paymentController.getPayments.bind(paymentController))
    )
    .post(
      isAuth,
      validationInput(CreateCodPaymentDto, RequestPartEnum.BODY),
      catchErrorHandler(paymentController.createPayment.bind(paymentController))
    )

  paymentRoute
    .route(routeConfig.payments.child.getByOrderId.path)
    .get(
      isAuth,
      validationInput(OrderPaymentParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(paymentController.getPaymentByOrderId.bind(paymentController))
    )

  paymentRoute
    .route(routeConfig.payments.child.getById.path)
    .get(
      isAuth,
      validationInput(PaymentIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(paymentController.getPaymentById.bind(paymentController))
    )

  paymentRoute
    .route(routeConfig.payments.child.markPaid.path)
    .patch(
      isAuth,
      validationInput(PaymentIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(paymentController.markPaid.bind(paymentController))
    )

  paymentRoute
    .route(routeConfig.payments.child.markFailed.path)
    .patch(
      isAuth,
      validationInput(PaymentIdParamsDto, RequestPartEnum.PARAMS),
      validationInput(MarkFailedPaymentDto, RequestPartEnum.BODY),
      catchErrorHandler(paymentController.markFailed.bind(paymentController))
    )

  return paymentRoute
}

export default createPaymentRoute
