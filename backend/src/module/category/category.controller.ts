import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import CategoryService from './category.service'
import { Request, Response } from 'express'
import { CategoryIdParamDTO, CreateCategoryDTO, UpdateCategoryDTO } from './category.dto'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'

@injectable()
class CategoryController {
  constructor(@inject(ContainerInjectionRegistry.CategoryService) private categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response) {
    const payload = req.bodyValidated as CreateCategoryDTO
    const data = await this.categoryService.createCategory(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getListCategories(req: Request, res: Response) {
    const data = await this.categoryService.getCategories()

    return new OKResponse(data).send(req, res)
  }

  async getCategoryById(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as CategoryIdParamDTO
    const data = await this.categoryService.getCategoryById(id)

    return new OKResponse(data).send(req, res)
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as CategoryIdParamDTO
    const payload = req.bodyValidated as UpdateCategoryDTO
    const data = await this.categoryService.updateCategory(id, payload)

    return new OKResponse(data).send(req, res)
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = (req.paramsValidated ?? req.params) as CategoryIdParamDTO
    const data = await this.categoryService.deleteCategory(id)

    return new OKResponse(data).send(req, res)
  }
}

export default CategoryController
