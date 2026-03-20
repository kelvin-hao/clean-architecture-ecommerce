import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import express, { Router } from 'express'
import catchErrorHandler from '~/middleware/catchError.mid'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { CreatePermissionDTO, CreateRoleDTO } from './rbac.dto'
import RBACController from './rbac.controller'
import { RequestPartEnum } from '~/types/type'

const createRBACRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const rbacController = await container.getAsync<RBACController>(ContainerInjectionRegistry.RBACController)
  const roleRoute = express.Router()

  roleRoute
    .route(routeConfig.rbac.child.createPermission.path)
    .post(
      validationInput(CreatePermissionDTO, RequestPartEnum.BODY),
      catchErrorHandler(rbacController.createPermission.bind(rbacController))
    )

  roleRoute
    .route(routeConfig.rbac.child.getPermissions.path)
    .get(catchErrorHandler(rbacController.getAllPermissions.bind(rbacController)))

  roleRoute
    .route(routeConfig.rbac.child.createRole.path)
    .post(
      validationInput(CreateRoleDTO, RequestPartEnum.BODY),
      catchErrorHandler(rbacController.createRole.bind(rbacController))
    )
  return roleRoute
}

export default createRBACRoute
