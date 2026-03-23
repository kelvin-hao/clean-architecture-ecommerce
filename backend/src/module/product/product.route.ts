import express, { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import ProductController from './product.controller'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { CreateProductSPUDto } from './product.dto'
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

  productRoute.route('/').get(catchErrorHandler(productController.getProducts.bind(productController)))

  return productRoute
}

export default createProductRoute
