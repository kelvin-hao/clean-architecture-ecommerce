import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import RBACService from './rbac.service'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import { Request, Response } from 'express'
import { CreatePermissionDTO, CreateRoleDTO } from './rbac.dto'

@injectable()
class RBACController {
  constructor(@inject(ContainerInjectionRegistry.RBACService) private rBACService: RBACService) {}

  async createPermission(req: Request, res: Response) {
    const payload = req.bodyValidated as CreatePermissionDTO
    const data = await this.rBACService.createPermission(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getAllPermissions(req: Request, res: Response) {
    const data = await this.rBACService.getAllPermission()

    return new OKResponse(data).send(req, res)
  }

  async createRole(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateRoleDTO
    const data = await this.rBACService.createRole(payload)

    return new OKResponse(data).send(req, res)
  }
}

export default RBACController
