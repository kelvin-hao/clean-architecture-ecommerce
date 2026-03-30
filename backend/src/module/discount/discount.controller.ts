import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { BadRequestError } from '~/helper/response/errorResponse'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import DiscountService from './discount.service'
import {
  ApplyDiscountDto,
  CreateDiscountDto,
  GetAvailableDiscountDto,
  GetDiscountByCodeDto,
  UpdateDiscountDto
} from './discount.dto'

@injectable()
class DiscountController {
  constructor(@inject(ContainerInjectionRegistry.DiscountService) private discountService: DiscountService) {}

  async createDiscount(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateDiscountDto
    const data = await this.discountService.createDiscount(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async updateDiscount(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as { id: string }

    if (!id) {
      throw new BadRequestError('Discount id is required')
    }

    const payload = (req.bodyValidated ?? req.body) as UpdateDiscountDto
    const data = await this.discountService.updateDiscount(id, payload)

    return new OKResponse(data).send(req, res)
  }

  async disableDiscount(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as { id: string }

    if (!id) {
      throw new BadRequestError('Discount id is required')
    }

    const data = await this.discountService.disableDiscount(id)

    return new OKResponse(data).send(req, res)
  }

  async getDiscountByCode(req: Request, res: Response) {
    const { code } = (req.queryValidated ?? req.query) as GetDiscountByCodeDto

    if (!code) {
      throw new BadRequestError('Discount code is required')
    }

    const data = await this.discountService.getDiscountByCode(code)

    return new OKResponse(data).send(req, res)
  }

  async applyDiscount(req: Request, res: Response) {
    const payload = req.bodyValidated as ApplyDiscountDto
    const userId = req.user?.id ?? payload.userId

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.discountService.applyDiscount({
      ...payload,
      userId
    })

    return new OKResponse(data).send(req, res)
  }

  async getAvailableDiscounts(req: Request, res: Response) {
    const { vendorId, orderValue } = (req.queryValidated ?? req.query) as GetAvailableDiscountDto

    if (!vendorId) {
      throw new BadRequestError('Vendor id is required')
    }

    const data = await this.discountService.getAvailableDiscounts({
      vendorId,
      orderValue: Number(orderValue ?? 0)
    })

    return new OKResponse(data).send(req, res)
  }

  async getVendorDiscounts(req: Request, res: Response) {
    const params = (req.paramsValidated ?? req.params) as { vendorId?: string }
    const vendorId = params.vendorId || (req.query.vendorId as string) || req.user?.id

    if (!vendorId) {
      throw new BadRequestError('Vendor id is required')
    }

    const data = await this.discountService.getVendorDiscounts(vendorId)

    return new OKResponse(data).send(req, res)
  }
}

export default DiscountController
