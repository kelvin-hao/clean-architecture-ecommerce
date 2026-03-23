import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import ProductService from './product.service'
import { Request, Response } from 'express'
import { CreateProductSPUDto } from './product.dto'
import { OKResponse } from '~/helper/response/successResponse'

@injectable()
class ProductController {
  constructor(@inject(ContainerInjectionRegistry.ProductService) private productService: ProductService) {}

  async insertProduct(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateProductSPUDto
    const data = await this.productService.createProduct(payload)

    return new OKResponse(data).send(req, res)
  }

  async getProducts(req: Request, res: Response) {
    const data = await this.productService.getProducts()

    return new OKResponse(data).send(req, res)
  }
}

export default ProductController
