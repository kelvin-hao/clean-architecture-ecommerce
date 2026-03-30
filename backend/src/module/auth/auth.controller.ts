import { Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { CreatedResponse, OKResponse } from '~/helper/response/successResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import AuthService from './auth.service'
import {
  RegisterDTO,
  ForgotPasswordDTO,
  GoogleLoginDTO,
  LoginDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  SendOtpDTO,
  VerifyToken2FADTO,
  VerifyOtpDto
} from './auth.dto'
import { JwtPayload } from '~/types/type'

@injectable()
class AuthController {
  constructor(@inject(ContainerInjectionRegistry.AuthService) private authService: AuthService) {}

  // auth service

  async signup(req: Request, res: Response) {
    const payload = req.bodyValidated as RegisterDTO
    const data = await this.authService.signUp(payload)

    return new OKResponse(data).send(req, res)
  }

  async verificationToken(req: Request, res: Response) {
    const payload = req.bodyValidated as VerifyOtpDto
    const data = await this.authService.verificationToken(payload)

    return new CreatedResponse(data).send(req, res)
  }

  async resendOtp(req: Request, res: Response) {
    const { email } = req.bodyValidated as SendOtpDTO
    const data = await this.authService.resendOtp(email)

    return new OKResponse(data).send(req, res)
  }

  async signin(req: Request, res: Response) {
    const payload = req.bodyValidated as LoginDTO
    const data = await this.authService.signin(payload)

    return new OKResponse(data).send(req, res)
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.bodyValidated as RefreshTokenDTO
    const data = await this.authService.refreshToken(refreshToken)

    return new OKResponse(data).send(req, res)
  }

  async logout(req: Request, res: Response) {
    const payload = req.user as JwtPayload
    const accessToken = req.get('Authorization')?.split(' ')[1]

    const data = await this.authService.logout(payload, accessToken!)

    return new OKResponse(data).send(req, res)
  }

  async loginWithGoogle(req: Request, res: Response) {
    const url = await this.authService.loginWithGoogle()
    return res.redirect(url)
  }

  async loginWithGoogleCallback(req: Request, res: Response) {
    const payload = req.bodyValidated as GoogleLoginDTO
    console.log(payload)
    const data = await this.authService.loginWithGoogleCallback(payload)

    return new OKResponse(data).send(req, res)
  }

  async forgotPassword(req: Request, res: Response) {
    const payload = req.bodyValidated as ForgotPasswordDTO
    const data = await this.authService.forgotPassowrd(payload)
    return new OKResponse(data).send(req, res)
  }

  async resetPassword(req: Request, res: Response) {
    const payload = req.bodyValidated as ResetPasswordDTO
    const data = await this.authService.resetPassword(payload)

    return new OKResponse(data).send(req, res)
  }

  async verifyToken2FA(req: Request, res: Response) {
    const payload = req.bodyValidated as VerifyToken2FADTO
    const userId = req.user?.id

    const data = await this.authService.verifyToken2FA(payload, userId!)

    return new OKResponse(data).send(req, res)
  }
}

export default AuthController
