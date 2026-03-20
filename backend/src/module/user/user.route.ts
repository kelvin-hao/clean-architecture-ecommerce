import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import catchErrorHandler from '~/middleware/catchError.mid'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import UserController from './user.controller'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ChangePasswordDTO, EditProfileDTO, GetUsersQueryDTO } from './user.dto'
import isAuth from '~/middleware/isAuth.mid'
import { requirePermission } from '~/middleware/permission.mid'
import { uploadFileCSV } from '~/middleware/multer.mid'

const createUserRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const userController = await container.getAsync<UserController>(ContainerInjectionRegistry.UserController)
  const userRoute = express.Router()

  userRoute
    .route(routeConfig.users.child.importUsersCSV.path)
    .post(uploadFileCSV.single('file'), catchErrorHandler(userController.importUserFromCSV.bind(userController)))

  userRoute
    .route(routeConfig.users.child.exporttUsersCSV.path)
    .get(catchErrorHandler(userController.exportUserToCSV.bind(userController)))

  userRoute
    .route(routeConfig.users.child.getUsers.path)
    .get(
      validationInput(GetUsersQueryDTO, RequestPartEnum.QUERY),
      catchErrorHandler(userController.getUsers.bind(userController))
    )

  userRoute
    .route(routeConfig.users.child.enable2FA.path)
    .post(isAuth, requirePermission('user:update'), catchErrorHandler(userController.enable2FA.bind(userController)))

  userRoute
    .route(routeConfig.users.child.changePassword.path)
    .post(
      isAuth,
      requirePermission('user:update'),
      validationInput(ChangePasswordDTO, RequestPartEnum.BODY),
      catchErrorHandler(userController.changePassword.bind(userController))
    )

  userRoute
    .route(routeConfig.users.child.changeAvatar.path)
    .patch(
      isAuth,
      requirePermission('user:update'),
      validationInput(EditProfileDTO, RequestPartEnum.BODY),
      catchErrorHandler(userController.editProfile.bind(userController))
    )

  userRoute
    .route(routeConfig.users.child.deleteAccount.path)
    .delete(
      isAuth,
      requirePermission('user:delete'),
      catchErrorHandler(userController.deleteAccount.bind(userController))
    )

  userRoute
    .route(routeConfig.users.child.getProfile.path)
    .get(isAuth, requirePermission('user:view'), catchErrorHandler(userController.getProfile.bind(userController)))

  userRoute
    .route(routeConfig.users.child.editProfile.path)
    .patch(
      isAuth,
      requirePermission('user:update'),
      validationInput(EditProfileDTO, RequestPartEnum.BODY),
      catchErrorHandler(userController.editProfile.bind(userController))
    )

  return userRoute
}

export default createUserRoute
