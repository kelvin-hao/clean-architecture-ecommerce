import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import { ForbiddenError, UnauthorizedError } from '~/helper/response/errorResponse'
import VendorService from './vendor.service'
import { GetVendorsQueryDto, RegisterVendorDto, RejectVendorDto } from './vendor.dto'

@injectable()
class VendorController {
  constructor(@inject(ContainerInjectionRegistry.VendorService) private vendorService: VendorService) {}

  async registerVendor(req: Request, res: Response) {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedError()

    const payload = req.bodyValidated as RegisterVendorDto
    const data = await this.vendorService.registryVendor(userId, payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getMyVendor(req: Request, res: Response) {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedError()

    const data = await this.vendorService.getMyVendor(userId)

    return new OKResponse(data).send(req, res)
  }

  async getVendors(req: Request, res: Response) {
    this.ensureAdmin(req)

    const query = (req.queryValidated ?? req.query) as GetVendorsQueryDto
    const data = await this.vendorService.getVendors(query)

    return new OKResponse(data).send(req, res)
  }

  async getVendor(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as { id: string }
    const data = await this.vendorService.getVendor(id)

    return new OKResponse(data).send(req, res)
  }

  async approveVendor(req: Request, res: Response) {
    this.ensureAdmin(req)

    const { id } = (req.paramsValidated ?? req.params) as { id: string }
    const data = await this.vendorService.approveVendor(id)

    return new OKResponse(data).send(req, res)
  }

  async rejectVendor(req: Request, res: Response) {
    this.ensureAdmin(req)

    const { id } = (req.paramsValidated ?? req.params) as { id: string }
    const payload = req.bodyValidated as RejectVendorDto
    const data = await this.vendorService.rejectVendor(id, payload)

    return new OKResponse(data).send(req, res)
  }

  private ensureAdmin(req: Request) {
    const user = req.user

    if (!user) throw new UnauthorizedError()
    if (!user.roles.includes('admin')) throw new ForbiddenError('Admin access required')
  }
}

export default VendorController
