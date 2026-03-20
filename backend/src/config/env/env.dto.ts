import { IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '~/helper'

export class DTOEnv extends BaseDto {
  @IsString()
  @IsNotEmpty()
  PORT!: number

  @IsString()
  @IsNotEmpty()
  BUILD_MODE!: string

  @IsString()
  @IsNotEmpty()
  MONGO_URI!: string

  @IsString()
  @IsNotEmpty()
  REDIS_URI!: string

  @IsString()
  CORS_ALLOWED_ORIGINS: string

  @IsString()
  MAIL_HOST: string

  @IsString()
  MAIL_PORT: string

  @IsString()
  MAIL_USER: string

  @IsString()
  MAIL_PASS: string

  @IsString()
  MAIL_FROM: string

  @IsString()
  TWILIO_ACCOUNT_SID: string

  @IsString()
  TWILIO_AUTH_TOKEN: string

  @IsString()
  TWILIO_PHONE_NUMBER: string

  @IsString()
  JWT_SECRET: string

  @IsString()
  JWT_REFRESH_SECRET: string

  @IsString()
  API_PREFIX: string

  @IsString()
  DOMAIN: string

  @IsString()
  CLOUDINARY_CLOUD_NAME: string

  @IsString()
  CLOUDINARY_API_KEY: string

  @IsString()
  CLOUDINARY_API_SECRET: string

  @IsString()
  CLIENT_DOMAIN: string

  @IsString()
  GOOGLE_CLIENT_ID: string

  @IsString()
  GOOGLE_CLIENT_SECRET: string

  @IsString()
  GOOGLE_REDIRECT_URI: string
}
