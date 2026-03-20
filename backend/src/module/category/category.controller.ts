import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import CategoryService from './category.service'
import { Request, Response } from 'express'
import { CreateCategoryDTO } from './category.dto'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'

@injectable()
class CategoryController {
  constructor(@inject(ContainerInjectionRegistry.CategoryService) private categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response) {
    const payload = req.body as CreateCategoryDTO

    const data = await this.categoryService.createCategory(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async getListCategories(req: Request, res: Response) {
    const data = await this.categoryService.getCategories()

    return new OKResponse(data).send(req, res)
  }
}

export default CategoryController
