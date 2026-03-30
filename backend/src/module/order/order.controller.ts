import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { BadRequestError } from '~/helper/response/errorResponse'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import OrderService from './order.service'
import { CreateOrderDto, OrderIdParamsDto, OrderQueryDto } from './order.dto'

@injectable()
class OrderController {
  constructor(@inject(ContainerInjectionRegistry.OrderService) private orderService: OrderService) {}

  async createOrder(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const payload = req.bodyValidated as CreateOrderDto
    const data = await this.orderService.createOrder(userId, payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getMyOrders(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const query = (req.queryValidated ?? req.query) as OrderQueryDto
    const data = await this.orderService.getOrders(userId, query)

    return new OKResponse(data).send(req, res)
  }

  async getOrderById(req: Request, res: Response) {
    const userId = req.user?.id
    const { id } = (req.paramsValidated ?? req.params) as OrderIdParamsDto

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.orderService.getOrderById(userId, id)

    return new OKResponse(data).send(req, res)
  }

  async markDelivery(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as OrderIdParamsDto
    const data = await this.orderService.markDelivery(id)

    return new OKResponse(data).send(req, res)
  }

  async cancelOrder(req: Request, res: Response) {
    const userId = req.user?.id
    const { id } = (req.paramsValidated ?? req.params) as OrderIdParamsDto

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.orderService.cancelOrder(userId, id)

    return new OKResponse(data).send(req, res)
  }
}

export default OrderController
