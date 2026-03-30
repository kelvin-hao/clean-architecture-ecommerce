import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'
import DiscountController from './discount.controller'
import {
  ApplyDiscountDto,
  CreateDiscountDto,
  DiscountIdParamDto,
  GetAvailableDiscountDto,
  GetDiscountByCodeDto,
  UpdateDiscountDto,
  VendorDiscountParamsDto
} from './discount.dto'

const createDiscountRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const discountController = await container.getAsync<DiscountController>(ContainerInjectionRegistry.DiscountController)
  const discountRoute = express.Router()

  discountRoute
    .route(routeConfig.discounts.child.insert.path)
    .post(
      validationInput(CreateDiscountDto, RequestPartEnum.BODY),
      catchErrorHandler(discountController.createDiscount.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.getByCode.path)
    .get(
      validationInput(GetDiscountByCodeDto, RequestPartEnum.QUERY),
      catchErrorHandler(discountController.getDiscountByCode.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.apply.path)
    .post(
      validationInput(ApplyDiscountDto, RequestPartEnum.BODY),
      catchErrorHandler(discountController.applyDiscount.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.available.path)
    .get(
      validationInput(GetAvailableDiscountDto, RequestPartEnum.QUERY),
      catchErrorHandler(discountController.getAvailableDiscounts.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.getVendor.path)
    .get(
      validationInput(VendorDiscountParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(discountController.getVendorDiscounts.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.update.path)
    .patch(
      validationInput(DiscountIdParamDto, RequestPartEnum.PARAMS),
      validationInput(UpdateDiscountDto, RequestPartEnum.BODY),
      catchErrorHandler(discountController.updateDiscount.bind(discountController))
    )

  discountRoute
    .route(routeConfig.discounts.child.disable.path)
    .patch(
      validationInput(DiscountIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(discountController.disableDiscount.bind(discountController))
    )

  return discountRoute
}

export default createDiscountRoute
