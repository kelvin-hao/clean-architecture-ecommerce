import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import createUserRoute from './user/user.route'
import { OKResponse } from '~/helper/response/successResponse'
import createUploadRoute from './upload/upload.route'
import createRBACRoute from './rbac/rbac.routes'
import createAuthRoute from './auth/auth.route'
import createCategoryRoute from './category/category.route'

const createRoute = async (): Promise<Router> => {
  const router = express.Router()
  const uploadRoute = createUploadRoute()

  const [rbacRoute, authRoute, userRoute, categoryRoute] = await Promise.all([
    createRBACRoute(),
    createAuthRoute(),
    createUserRoute(),
    createCategoryRoute()
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
  router.use(routeConfig.rbac.path, rbacRoute)
  router.use(routeConfig.upload.path, uploadRoute)
  router.use(routeConfig.auth.path, authRoute)
  router.use(routeConfig.users.path, userRoute)
  router.use(routeConfig.categories.path, categoryRoute)

  return router
}

export default createRoute
