import { Exclude, Expose } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsOptional, IsString, Length } from 'class-validator'
import { BaseDto, BaseExposeDto } from '~/helper'

export class CreateRoleDTO extends BaseDto {
  @IsString()
  @Length(3, 50)
  name: string

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[]
}

export class CreatePermissionDTO extends BaseDto {
  @IsString()
  @Length(3, 50)
  key: string

  @IsOptional()
  @IsString()
  @Length(0, 255)
  resource: string

  @IsString()
  @Length(0, 255)
  action: string
}

@Exclude()
export class RoleResponseDTO extends BaseExposeDto {
  @Expose()
  name: string

  @Expose()
  description?: string

  @Expose()
  permissions: string[]
}
