import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import routeConfig from '~/config/route.config'
import catchErrorHandler from '~/middleware/catchError.mid'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import isAuth from '~/middleware/isAuth.mid'
import VendorController from './vendor.controller'
import { GetVendorsQueryDto, RegisterVendorDto, RejectVendorDto, VendorIdParamsDto } from './vendor.dto'

const createVendorRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const vendorController = await container.getAsync<VendorController>(ContainerInjectionRegistry.VendorController)
  const vendorRoute = express.Router()

  vendorRoute
    .route(routeConfig.vendors.child.root.path)
    .post(
      isAuth,
      validationInput(RegisterVendorDto, RequestPartEnum.BODY),
      catchErrorHandler(vendorController.registerVendor.bind(vendorController))
    )
    .get(
      isAuth,
      validationInput(GetVendorsQueryDto, RequestPartEnum.QUERY),
      catchErrorHandler(vendorController.getVendors.bind(vendorController))
    )

  vendorRoute
    .route(routeConfig.vendors.child.me.path)
    .get(isAuth, catchErrorHandler(vendorController.getMyVendor.bind(vendorController)))

  vendorRoute
    .route(routeConfig.vendors.child.getById.path)
    .get(
      validationInput(VendorIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(vendorController.getVendor.bind(vendorController))
    )

  vendorRoute
    .route(routeConfig.vendors.child.approve.path)
    .patch(
      isAuth,
      validationInput(VendorIdParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(vendorController.approveVendor.bind(vendorController))
    )

  vendorRoute
    .route(routeConfig.vendors.child.reject.path)
    .patch(
      isAuth,
      validationInput(VendorIdParamsDto, RequestPartEnum.PARAMS),
      validationInput(RejectVendorDto, RequestPartEnum.BODY),
      catchErrorHandler(vendorController.rejectVendor.bind(vendorController))
    )

  return vendorRoute
}

export default createVendorRoute
