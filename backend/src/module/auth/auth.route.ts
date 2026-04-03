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
  RefreshTokenDTO,
  ResetPasswordDTO,
  VerifyToken2FADTO,
  GoogleLoginDTO,
  SendOtpDTO,
  VerifyOtpDto
} from './auth.dto'
import isAuth from '~/middleware/isAuth.mid'

const createAuthRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const AuthController = await container.getAsync<AuthController>(ContainerInjectionRegistry.AuthController)
  const authRoute = express.Router()

  /**
   * @openapi
   * /auth/signup:
   *   post:
   *     summary: User registration
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                example: John Doe
   *              email:
   *                type: string
   *                example: johndoe@example.com
   *     responses:
   *       200:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User registered successfully. Please check your email for verification.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: email
   *                       message:
   *                         type: string
   *                         example: Please provide a valid email address.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.signUp.path)
    .post(
      validationInput(RegisterDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.signup.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/sign-in:
   *   post:
   *     summary: User login
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 refresh_token:
   *                   type: string
   *                   example: dGhpc2lzYXJlZnJlc2h0b2tlbg==
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: email
   *                       message:
   *                         type: string
   *                         example: Please provide a valid email address.
   *       401:
   *         description: Unauthorized (invalid credentials)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid email or password.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.signIn.path)
    .post(
      validationInput(LoginDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.signin.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/google:
   *   get:
   *     summary: Login with Google
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: query
   *         name: redirect
   *         schema:
   *           type: string
   *         description: Optional redirect path after successful login (e.g., /dashboard)
   *     responses:
   *       302:
   *         description: Redirects to Google's OAuth 2.0 consent screen
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.LoginWithGoogle.path)
    .get(catchErrorHandler(AuthController.loginWithGoogle.bind(AuthController)))

  /**
   * @openapi
   * /auth/google/callback:
   *   get:
   *     summary: Google login callback
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         description: Authorization code returned by Google after user consent
   *       - in: query
   *         name: state
   *         schema:
   *           type: string
   *         description: Optional state parameter for CSRF protection
   *     responses:
   *       200:
   *         description: User logged in successfully with Google
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 refresh_token:
   *                   type: string
   *                   example: dGhpc2lzYXJlZnJlc2h0b2tlbg==
   *       400:
   *         description: Bad request (missing or invalid parameters)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Missing authorization code.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   *
   */
  authRoute
    .route(routeConfig.auth.child.LoginWithGoogleCallback.path)
    .get(
      validationInput(GoogleLoginDTO, RequestPartEnum.QUERY),
      catchErrorHandler(AuthController.loginWithGoogleCallback.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/verify-2fa:
   *   post:
   *     summary: Verify 2FA token
   *     tags:
   *       - Authentication
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 example: 123456
   *     responses:
   *       200:
   *         description: 2FA token verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 2FA token verified successfully.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: token
   *                       message:
   *                         type: string
   *                         example: Otp code must be a string.
   *       401:
   *         description: Unauthorized (invalid or expired token)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid or expired 2FA token.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.verify2Fa.path)
    .post(
      isAuth,
      validationInput(VerifyToken2FADTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.verifyToken2FA.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh access token
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 example: dGhpc2lzYXJlZnJlc2h0b2tlbg==
   *     responses:
   *       200:
   *         description: Access token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: refresh_token
   *                       message:
   *                         type: string
   *                         example: Refresh token is required.
   *       401:
   *         description: Unauthorized (invalid or expired refresh token)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid or expired refresh token.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */
  authRoute
    .route(routeConfig.auth.child.refreshToken.path)
    .post(
      validationInput(RefreshTokenDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.refreshToken.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/log-out:
   *   delete:
   *     summary: User logout
   *     tags:
   *       - Authentication
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User logged out successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User logged out successfully.
   *       401:
   *         description: Unauthorized (missing or invalid access token)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Missing or invalid access token.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.logout.path)
    .delete(isAuth, catchErrorHandler(AuthController.logout.bind(AuthController)))

  /**
   * @openapi
   * /auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPasswordDTO'
   *     responses:
   *       200:
   *         description: Password reset email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password reset email sent successfully.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: email
   *                       message:
   *                         type: string
   *                         example: Email is required.
   */
  authRoute
    .route(routeConfig.auth.child.forgotPassword.path)
    .post(
      validationInput(ForgotPasswordDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.forgotPassword.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/reset-password:
   *   post:
   *     summary: Reset user password
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *           properties:
   *             token:
   *              type: string
   *            newPassword:
   *             type: string
   *
   *     responses:
   *       200:
   *         description: Password reset successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password reset successfully.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: password
   *                       message:
   */

  authRoute
    .route(routeConfig.auth.child.resetPassword.path)
    .post(
      validationInput(ResetPasswordDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.resetPassword.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/send-otp:
   *   post:
   *     summary: Send OTP for registration verification
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *    responses:
   *       200:
   *         description: OTP sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: OTP sent successfully. Please check your email.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: email
   *                       message:
   *                         type: string
   *                         example: Please provide a valid email address.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.sendOtp.path)
    .post(
      validationInput(SendOtpDTO, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.resendOtp.bind(AuthController))
    )

  /**
   * @openapi
   * /auth/verify-register:
   *   post:
   *     summary: Verify registration OTP
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               otp:
   *                 type: string
   *                 example: 123456
   *    responses:
   *       200:
   *         description: Registration verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Registration verified successfully.
   *       400:
   *         description: Bad request (validation errors)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Validation error message.
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                         example: email
   *                       message:
   *                         type: string
   *                         example: Please provide a valid email address.
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred. Please try again later.
   */

  authRoute
    .route(routeConfig.auth.child.verifyRegister.path)
    .post(
      validationInput(VerifyOtpDto, RequestPartEnum.BODY),
      catchErrorHandler(AuthController.verificationToken.bind(AuthController))
    )

  return authRoute
}

export default createAuthRoute
