import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import catchErrorHandler from '~/middleware/catchError.mid'
import validationInput from '~/middleware/validationInput.mid'
import { RequestPartEnum } from '~/types/type'
import AuthController from './auth.controller'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import {
  RegisterDTO,
  ForgotPasswordDTO,
  LoginDTO,
  ParamsCodeDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  VerifyToken2FADTO,
  GoogleLoginDTO
} from './auth.dto'
import isAuth from '~/middleware/isAuth.mid'

const createAuthRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const AuthController = await container.getAsync<AuthController>(ContainerInjectionRegistry.AuthController)
  const authRoute = express.Router()

  authRoute
    .route(routeConfig.auth.child.signUp.path)
    .post(
      validationInput(RegisterDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.signup.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.signIn.path)
    .post(
      validationInput(LoginDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.signin.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.LoginWithGoogle.path)
    .get(catchErrorHandler(AuthController.loginWithGoogle.bind(AuthController)))

  authRoute
    .route(routeConfig.auth.child.LoginWithGoogleCallback.path)
    .get(
      validationInput(GoogleLoginDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.loginWithGoogleCallback.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.verify2Fa.path)
    .post(
      isAuth,
      validationInput(VerifyToken2FADTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.verifyToken2FA.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.refreshToken.path)
    .post(
      validationInput(RefreshTokenDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.refreshToken.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.logout.path)
    .delete(isAuth, catchErrorHandler(AuthController.logout.bind(AuthController)))

  authRoute
    .route(routeConfig.auth.child.forgotPassword.path)
    .post(
      validationInput(ForgotPasswordDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.forgotPassword.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.resetPassword.path)
    .post(
      validationInput(ResetPasswordDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.resetPassword.bind(AuthController))
    )

  authRoute
    .route(routeConfig.auth.child.verifyRegister.path)
    .get(
      validationInput(ParamsCodeDTO, RequestPartEnum.PARAMS),
      catchErrorHandler(AuthController.verificationToken.bind(AuthController))
    )

  return authRoute
}

export default createAuthRoute
