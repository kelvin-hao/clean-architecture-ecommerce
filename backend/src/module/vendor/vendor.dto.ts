import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BaseDto } from '~/helper'

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
  description?: string
}

export class RejectVendorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @Transform(({ value }) => value.trim())
  reason: string
}
