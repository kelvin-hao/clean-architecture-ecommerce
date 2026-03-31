import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  IsPhoneNumber,
  MaxLength,
  Length,
  IsEmail,
  IsInt,
  Min,
  Max
} from 'class-validator'
import { BaseExposeDto, BaseDto } from '~/helper'

// --- Response DTO (Output) ---

@Exclude()
export class ResponseUserDTO extends BaseExposeDto {
  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  phone_number?: string

  @Expose()
  @Transform(({ value }) => value?.url ?? value ?? '')
  avatar?: string

  @Expose()
  two_FA: boolean

  @Expose()
  roles: string[]

  @Expose()
  status: string
}

// --- Validation DTOs (Input) ---

export class GetUsersQueryDTO extends BaseDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10

  @IsOptional()
  @IsString()
  sort?: string

  @IsOptional()
  @IsString()
  select?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  phone_number?: string
}

export class ImportUseFromCSVDTO extends BaseDto {
  @IsString({ message: 'Full name must be a string.' })
  @Length(3, 256)
  name: string

  @IsEmail()
  email: string

  @IsPhoneNumber('VN', { message: 'Phone number must be a valid phone number.' })
  phone_number: string

  @IsUrl({}, { message: 'Avatar must be a valid URL.' })
  avatar: string

  @IsString({ message: 'Password name must be a string.' })
  @Length(8, 24)
  password: string
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

export class EditProfileDTO extends BaseDto {
  @IsString({ message: 'Full name must be a string.' })
  @IsOptional()
  name: string

  @IsPhoneNumber('VN', { message: 'Phone number must be a valid phone number.' })
  @IsOptional()
  phone_number: string

  @IsUrl({}, { message: 'Avatar must be a valid URL.' })
  @IsOptional()
  avatar: string
}

export class ChangePasswordDTO extends BaseDto {
  @IsString({ message: 'Old password must be a string.' })
  @IsNotEmpty({ message: 'Old password is required.' })
  oldPassword: string

  @IsString({ message: 'New password must be a string.' })
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  @IsNotEmpty({ message: 'New password is required.' })
  password: string
}

export class VerifyToken2FADTO extends BaseDto {
  @IsString()
  @IsNotEmpty()
  token: string
}
