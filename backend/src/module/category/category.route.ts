import { Router } from 'express'
import Express from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { CategoryIdParamDTO, CreateCategoryDTO, UpdateCategoryDTO } from './category.dto'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'
import CategoryController from './category.controller'

const createCategoryRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const categoryController = await container.getAsync<CategoryController>(ContainerInjectionRegistry.CategoryController)

  const categoryRoute = Express.Router()

  categoryRoute
    .route(routeConfig.categories.child.insert.path)
    .post(
      validationInput(CreateCategoryDTO, RequestPartEnum.BODY),
      catchErrorHandler(categoryController.createCategory.bind(categoryController))
    )

  categoryRoute
    .route(routeConfig.categories.child.getList.path)
    .get(catchErrorHandler(categoryController.getListCategories.bind(categoryController)))

  categoryRoute
    .route(routeConfig.categories.child.getById.path)
    .get(
      validationInput(CategoryIdParamDTO, RequestPartEnum.PARAMS),
      catchErrorHandler(categoryController.getCategoryById.bind(categoryController))
    )
    .patch(
      validationInput(CategoryIdParamDTO, RequestPartEnum.PARAMS),
      validationInput(UpdateCategoryDTO, RequestPartEnum.BODY),
      catchErrorHandler(categoryController.updateCategory.bind(categoryController))
    )
    .delete(
      validationInput(CategoryIdParamDTO, RequestPartEnum.PARAMS),
      catchErrorHandler(categoryController.deleteCategory.bind(categoryController))
    )

  return categoryRoute
}

export default createCategoryRoute
