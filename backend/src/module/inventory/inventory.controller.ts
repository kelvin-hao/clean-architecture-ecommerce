import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import InventoryService from './inventory.service'
import { CreateInventoryDto, InventoryQueryDto, InventoryQuantityDto, UpdateInventoryDto } from './inventory.dto'

@injectable()
class InventoryController {
  constructor(@inject(ContainerInjectionRegistry.InventoryService) private inventoryService: InventoryService) {}

  async createInventory(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const payload = req.bodyValidated as CreateInventoryDto
    const data = await this.inventoryService.createInventory(skuId, payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getInventories(req: Request, res: Response) {
    const query = (req.queryValidated ?? req.query) as InventoryQueryDto
    const data = await this.inventoryService.getInventories(query)

    return new OKResponse(data).send(req, res)
  }

  async getInventoryBySku(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const data = await this.inventoryService.getInventoryBySku(skuId)

    return new OKResponse(data).send(req, res)
  }

  async updateInventory(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const payload = req.bodyValidated as UpdateInventoryDto
    const data = await this.inventoryService.updateInventory(skuId, payload)

    return new OKResponse(data).send(req, res)
  }

  async reserveStock(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const payload = req.bodyValidated as InventoryQuantityDto
    const data = await this.inventoryService.reserveStock(skuId, payload)

    return new OKResponse(data).send(req, res)
  }

  async releaseReservedStock(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const payload = req.bodyValidated as InventoryQuantityDto
    const data = await this.inventoryService.releaseReservedStock(skuId, payload)

    return new OKResponse(data).send(req, res)
  }

  async commitReservedStock(req: Request, res: Response) {
    const { skuId } = (req.paramsValidated ?? req.params) as { skuId: string }
    const payload = req.bodyValidated as InventoryQuantityDto
    const data = await this.inventoryService.commitReservedStock(skuId, payload)

    return new OKResponse(data).send(req, res)
  }
}

export default InventoryController
