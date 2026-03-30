import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import ProductController from './product.controller'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import {
  BulkUpdateProductSKUDto,
  CreateProductSPUDto,
  ProductIdParamDto,
  ProductQueryDto,
  ProductSkuIdParamDto,
  UpdateProductSKUDto,
  UpdateProductSPUDto
} from './product.dto'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'

const createProductRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const productController = await container.getAsync<ProductController>(ContainerInjectionRegistry.ProductController)
  const productRoute = express.Router()

  productRoute
    .route(routeConfig.products.child.insert.path)
    .post(
      validationInput(CreateProductSPUDto, RequestPartEnum.BODY),
      catchErrorHandler(productController.insertProduct.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.getList.path)
    .get(
      validationInput(ProductQueryDto, RequestPartEnum.QUERY),
      catchErrorHandler(productController.getProducts.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.getSkuById.path)
    .get(
      validationInput(ProductSkuIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.getSkuById.bind(productController))
    )
    .patch(
      validationInput(ProductSkuIdParamDto, RequestPartEnum.PARAMS),
      validationInput(UpdateProductSKUDto, RequestPartEnum.BODY),
      catchErrorHandler(productController.updateSku.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.getSkuList.path)
    .get(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.getProductSkus.bind(productController))
    )
    .patch(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      validationInput(BulkUpdateProductSKUDto, RequestPartEnum.BODY),
      catchErrorHandler(productController.bulkUpdateProductSkus.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.publish.path)
    .patch(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.publishProduct.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.archive.path)
    .patch(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.archiveProduct.bind(productController))
    )

  productRoute
    .route(routeConfig.products.child.getById.path)
    .get(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.getProductById.bind(productController))
    )
    .patch(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      validationInput(UpdateProductSPUDto, RequestPartEnum.BODY),
      catchErrorHandler(productController.updateProduct.bind(productController))
    )
    .delete(
      validationInput(ProductIdParamDto, RequestPartEnum.PARAMS),
      catchErrorHandler(productController.deleteProduct.bind(productController))
    )

  return productRoute
}

export default createProductRoute
