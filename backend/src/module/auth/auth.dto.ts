import { IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber, IsJWT, MaxLength } from 'class-validator'
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
  @IsString({ message: 'Full name must be a string.' })
  @IsNotEmpty({ message: 'Full name is required.' })
  @MinLength(3, { message: 'Password must be at least 3 characters long' })
  @MaxLength(50, { message: 'Password must be at most 50 characters long' })
  full_name: string

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string

  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string

  @IsPhoneNumber('VN', { message: 'Please provide a valid phone number.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phone_number: string
}

export class ParamsCodeDTO extends BaseDto {
  @IsString({ message: 'Code must be a string.' })
  @IsNotEmpty({ message: 'Code is required.' })
  code: string
}

export class IDParamsDTO extends BaseDto {
  @IsString({ message: 'ID must be a string.' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string
}
