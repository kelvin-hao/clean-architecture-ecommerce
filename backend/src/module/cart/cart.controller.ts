import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { BadRequestError } from '~/helper/response/errorResponse'
import { NoContentResponse, OKResponse } from '~/helper/response/successResponse'
import CartService from './cart.service'
import { AddCartItemDto, CartItemParamsDto, UpdateCartItemDto } from './cart.dto'

@injectable()
class CartController {
  constructor(@inject(ContainerInjectionRegistry.CartService) private cartService: CartService) {}

  async addItem(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const payload = req.bodyValidated as AddCartItemDto
    const data = await this.cartService.addItem(userId, payload)

    return new OKResponse(data).send(req, res)
  }

  async getMyCart(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.cartService.getCart(userId)

    return new OKResponse(data).send(req, res)
  }

  async updateItem(req: Request, res: Response) {
    const userId = req.user?.id
    const { sku_id } = (req.paramsValidated ?? req.params) as CartItemParamsDto
    const { quantity } = req.bodyValidated as UpdateCartItemDto

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.cartService.updateItem(userId, sku_id, quantity)

    return new OKResponse(data).send(req, res)
  }

  async removeItem(req: Request, res: Response) {
    const userId = req.user?.id
    const { sku_id } = (req.paramsValidated ?? req.params) as CartItemParamsDto

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    const data = await this.cartService.removeItem(userId, sku_id)

    return new OKResponse(data).send(req, res)
  }

  async clearCart(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new BadRequestError('User id is required')
    }

    await this.cartService.clearCart(userId)

    return new NoContentResponse().send(req, res)
  }
}

export default CartController
