import { Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { OKResponse } from '~/helper/response/successResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ChangePasswordDTO, EditProfileDTO, GetUsersQueryDTO } from './user.dto'
import UserService from './user.service'
import { BadRequest } from '~/helper/response/errorResponse'
import { CsvDownloadResponse } from '~/helper/response'

@injectable()
class UserController {
  constructor(@inject(ContainerInjectionRegistry.UserService) private userService: UserService) {}

  async importUserFromCSV(req: Request, res: Response) {
    const file = req.file
    if (!file) throw new BadRequest('CSV file is required')
    const data = await this.userService.importUsersFromCSV(file.path)

    return new OKResponse(data).send(req, res)
  }

  async exportUserToCSV(req: Request, res: Response) {
    const users = await this.userService.exportUsersToCSV()

    new CsvDownloadResponse('user', users).send(res)
  }

  async getUsers(req: Request, res: Response) {
    const query = req.queryValidated as GetUsersQueryDTO
    const data = await this.userService.getUsers(query)

    return new OKResponse(data).send(req, res)
  }

  async changePassword(req: Request, res: Response) {
    const payload = req.bodyValidated as ChangePasswordDTO
    const data = await this.userService.changePassword(req.user!.id, payload)

    return new OKResponse(data, 'Change password was successful. Please login again').send(req, res)
  }

  async deleteAccount(req: Request, res: Response) {
    const data = await this.userService.deleteAccount(req.user!.id)

    return new OKResponse(data).send(req, res)
  }

  async getProfile(req: Request, res: Response) {
    const data = await this.userService.getProfile(req.user!.id)
    return new OKResponse(data).send(req, res)
  }

  async editProfile(req: Request, res: Response) {
    const payload = req.bodyValidated as EditProfileDTO

    const data = await this.userService.editProfile(req.user!.id, payload)

    return new OKResponse(data).send(req, res)
  }

  async enable2FA(req: Request, res: Response) {
    const userId = req.user?.id
    const data = await this.userService.enable2FA(userId!)

    return new OKResponse(data).send(req, res)
  }
}

export default UserController
