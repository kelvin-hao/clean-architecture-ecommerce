import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'
import isAuth from '~/middleware/isAuth.mid'
import CartController from './cart.controller'
import { AddCartItemDto, CartItemParamsDto, UpdateCartItemDto } from './cart.dto'

const createCartRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const cartController = await container.getAsync<CartController>(ContainerInjectionRegistry.CartController)
  const cartRoute = express.Router()

  cartRoute.use(isAuth)

  cartRoute
    .route(routeConfig.cart.child.root.path)
    .get(catchErrorHandler(cartController.getMyCart.bind(cartController)))
    .delete(catchErrorHandler(cartController.clearCart.bind(cartController)))

  cartRoute
    .route(routeConfig.cart.child.addItem.path)
    .post(
      validationInput(AddCartItemDto, RequestPartEnum.BODY),
      catchErrorHandler(cartController.addItem.bind(cartController))
    )

  cartRoute
    .route(routeConfig.cart.child.updateItem.path)
    .patch(
      validationInput(CartItemParamsDto, RequestPartEnum.PARAMS),
      validationInput(UpdateCartItemDto, RequestPartEnum.BODY),
      catchErrorHandler(cartController.updateItem.bind(cartController))
    )
    .delete(
      validationInput(CartItemParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(cartController.removeItem.bind(cartController))
    )

  return cartRoute
}

export default createCartRoute
