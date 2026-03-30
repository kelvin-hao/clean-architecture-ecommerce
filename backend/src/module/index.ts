import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import createUserRoute from './user/user.route'
import { OKResponse } from '~/helper/response/successResponse'
import createUploadRoute from './upload/upload.route'
import createAuthRoute from './auth/auth.route'
import createCategoryRoute from './category/category.route'
import createProductRoute from './product/product.route'

const createRoute = async (): Promise<Router> => {
  const router = express.Router()
  const uploadRoute = createUploadRoute()

  const [authRoute, userRoute, categoryRoute, productRoute] = await Promise.all([
    createAuthRoute(),
    createUserRoute(),
    createCategoryRoute(),
    createProductRoute()
  ])

  router.get(routeConfig.checkHealthy.path, (req, res) => {
    return new OKResponse({
      message: 'API is working',
      url: {
        user: routeConfig.users.path,
        upload: routeConfig.upload.path
      }
    }).send(req, res)
  })
  // API
  router.use(routeConfig.upload.path, uploadRoute)
  router.use(routeConfig.auth.path, authRoute)
  router.use(routeConfig.users.path, userRoute)
  router.use(routeConfig.categories.path, categoryRoute)
  router.use(routeConfig.products.path, productRoute)

  return router
}

export default createRoute
