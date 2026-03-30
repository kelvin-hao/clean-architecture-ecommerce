import { IsEmail, IsNotEmpty, IsString, MinLength, IsJWT, MaxLength } from 'class-validator'
import { BaseDto } from '~/helper'

export class VerifyToken2FADTO extends BaseDto {
  @IsString()
  @IsNotEmpty()
  token: string
}

export class GoogleLoginDTO extends BaseDto {
  @IsString()
  @IsNotEmpty()
  iss: string

  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  scope: string

  @IsString()
  @IsNotEmpty()
  authuser: string

  @IsString()
  @IsNotEmpty()
  prompt: string
}

export class ResetPasswordDTO extends BaseDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string
}

export class ForgotPasswordDTO extends BaseDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string
}

export class LoginDTO extends BaseDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string
}

export class RefreshTokenDTO extends BaseDto {
  @IsJWT({ message: 'Invalid refresh token format.' })
  @IsNotEmpty({ message: 'Refresh token is required.' })
  refresh_token: string
}

export class RegisterDTO extends BaseDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(3, { message: 'Password must be at least 3 characters long' })
  @MaxLength(50, { message: 'Password must be at most 50 characters long' })
  name: string

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string

  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string
}

export class VerifyOtpDto extends BaseDto {
  @IsString({ message: 'Otp code must be a string.' })
  @IsNotEmpty({ message: 'Otp code is required.' })
  otp: string

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Otp code is required.' })
  email: number
}

export class IDParamsDTO extends BaseDto {
  @IsString({ message: 'ID must be a string.' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string
}
