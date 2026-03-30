import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import catchErrorHandler from '~/middleware/catchError.mid'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import isAuth from '~/middleware/isAuth.mid'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import OrderController from './order.controller'
import { CreateOrderDto, OrderIdParamsDto, OrderQueryDto } from './order.dto'

const createOrderRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const orderController = await container.getAsync<OrderController>(ContainerInjectionRegistry.OrderController)
  const orderRoute = express.Router()

  orderRoute.use(isAuth)

  orderRoute
    .route(routeConfig.orders.child.root.path)
    .get(
      validationInput(OrderQueryDto, RequestPartEnum.QUERY),
      catchErrorHandler(orderController.getMyOrders.bind(orderController))
    )
    .post(
      validationInput(CreateOrderDto, RequestPartEnum.BODY),
      catchErrorHandler(orderController.createOrder.bind(orderController))
    )

  orderRoute
    .route(routeConfig.orders.child.getById.path)
    .get(
      validationInput(OrderIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(orderController.getOrderById.bind(orderController))
    )

  orderRoute
    .route(routeConfig.orders.child.markDelivery.path)
    .patch(
      validationInput(OrderIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(orderController.markDelivery.bind(orderController))
    )

  orderRoute
    .route(routeConfig.orders.child.cancel.path)
    .patch(
      validationInput(OrderIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(orderController.cancelOrder.bind(orderController))
    )

  return orderRoute
}

export default createOrderRoute
