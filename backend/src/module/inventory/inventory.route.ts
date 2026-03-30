import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'
import InventoryController from './inventory.controller'
import {
  CreateInventoryDto,
  InventoryQueryDto,
  InventoryQuantityDto,
  InventorySkuParamsDto,
  UpdateInventoryDto
} from './inventory.dto'

const createInventoryRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const inventoryController = await container.getAsync<InventoryController>(
    ContainerInjectionRegistry.InventoryController
  )
  const inventoryRoute = express.Router()

  inventoryRoute
    .route(routeConfig.inventory.child.root.path)
    .get(
      validationInput(InventoryQueryDto, RequestPartEnum.QUERY),
      catchErrorHandler(inventoryController.getInventories.bind(inventoryController))
    )

  inventoryRoute
    .route(routeConfig.inventory.child.bySku.path)
    .post(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      validationInput(CreateInventoryDto, RequestPartEnum.BODY),
      catchErrorHandler(inventoryController.createInventory.bind(inventoryController))
    )
    .get(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      catchErrorHandler(inventoryController.getInventoryBySku.bind(inventoryController))
    )
    .patch(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      validationInput(UpdateInventoryDto, RequestPartEnum.BODY),
      catchErrorHandler(inventoryController.updateInventory.bind(inventoryController))
    )

  inventoryRoute
    .route(routeConfig.inventory.child.reserve.path)
    .post(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      validationInput(InventoryQuantityDto, RequestPartEnum.BODY),
      catchErrorHandler(inventoryController.reserveStock.bind(inventoryController))
    )

  inventoryRoute
    .route(routeConfig.inventory.child.release.path)
    .post(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      validationInput(InventoryQuantityDto, RequestPartEnum.BODY),
      catchErrorHandler(inventoryController.releaseReservedStock.bind(inventoryController))
    )

  inventoryRoute
    .route(routeConfig.inventory.child.commit.path)
    .post(
      validationInput(InventorySkuParamsDto, RequestPartEnum.PARAMS),
      validationInput(InventoryQuantityDto, RequestPartEnum.BODY),
      catchErrorHandler(inventoryController.commitReservedStock.bind(inventoryController))
    )

  return inventoryRoute
}

export default createInventoryRoute
