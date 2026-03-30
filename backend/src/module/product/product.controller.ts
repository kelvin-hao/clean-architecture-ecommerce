import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import ProductService from './product.service'
import {
  BulkUpdateProductSKUDto,
  CreateProductSPUDto,
  ProductIdParamDto,
  ProductQueryDto,
  ProductSkuIdParamDto,
  UpdateProductSKUDto,
  UpdateProductSPUDto
} from './product.dto'

@injectable()
class ProductController {
  constructor(@inject(ContainerInjectionRegistry.ProductService) private productService: ProductService) {}

  async insertProduct(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateProductSPUDto
    const data = await this.productService.createProduct(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getProducts(req: Request, res: Response) {
    const query = (req.queryValidated ?? req.query) as ProductQueryDto
    const data = await this.productService.getProducts(query)

    return new OKResponse(data).send(req, res)
  }

  async getProductById(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const data = await this.productService.getProductById(id)

    return new OKResponse(data).send(req, res)
  }

  async getProductSkus(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const data = await this.productService.getProductSkus(id)

    return new OKResponse(data).send(req, res)
  }

  async getSkuById(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as ProductSkuIdParamDto
    const data = await this.productService.getSkuById(skuId)

    return new OKResponse(data).send(req, res)
  }

  async updateSku(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as ProductSkuIdParamDto
    const payload = req.bodyValidated as UpdateProductSKUDto
    const data = await this.productService.updateSku(skuId, payload)

    return new OKResponse(data).send(req, res)
  }

  async bulkUpdateProductSkus(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const payload = req.bodyValidated as BulkUpdateProductSKUDto
    const data = await this.productService.bulkUpdateProductSkus(id, payload)

    return new OKResponse(data).send(req, res)
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const payload = req.bodyValidated as UpdateProductSPUDto
    const data = await this.productService.updateProduct(id, payload)

    return new OKResponse(data).send(req, res)
  }

  async publishProduct(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const data = await this.productService.publishProduct(id)

    return new OKResponse(data).send(req, res)
  }

  async archiveProduct(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const data = await this.productService.archiveProduct(id)

    return new OKResponse(data).send(req, res)
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as ProductIdParamDto
    const data = await this.productService.deleteProduct(id)

    return new OKResponse(data).send(req, res)
  }
}

export default ProductController
