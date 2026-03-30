import { Transform } from 'class-transformer'
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BaseDto } from '~/helper'
import { VendorApplicationStatusEnum } from '~/types/type'

export class RegisterVendorDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  shop_name: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string
}

export class RejectVendorDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @Transform(({ value }) => value.trim())
  reason: string
}

export class VendorIdParamsDto extends BaseDto {
  @IsMongoId()
  id: string
}

export class GetVendorsQueryDto extends BaseDto {
  @IsOptional()
  @IsEnum(VendorApplicationStatusEnum)
  status_application?: VendorApplicationStatusEnum
}
