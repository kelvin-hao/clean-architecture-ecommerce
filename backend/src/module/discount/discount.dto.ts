import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { BaseDto } from '~/helper'
import { DISCOUNT_APPLY_TO, DISCOUNT_TYPE } from '~/types/type'

export class CreateDiscountValidator extends BaseDto {
  @IsMongoId()
  vendor: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  @IsNotEmpty()
  code: string

  @IsEnum(DISCOUNT_TYPE)
  type: DISCOUNT_TYPE

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_discount_value?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_order_value?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_uses?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  max_uses_per_user?: number

  @IsOptional()
  @IsEnum(DISCOUNT_APPLY_TO)
  apply_to?: DISCOUNT_APPLY_TO

  @ValidateIf((o) => o.apply_to === DISCOUNT_APPLY_TO.PRODUCT)
  @IsArray()
  @IsMongoId({ each: true })
  product_ids?: string[]

  @ValidateIf((o) => o.apply_to === DISCOUNT_APPLY_TO.CATEGORY)
  @IsArray()
  @IsMongoId({ each: true })
  category_ids?: string[]

  @IsDateString()
  start_date: Date

  @IsDateString()
  end_date: Date
}

export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  name?: string

  // repeat only needed fields
}

class ProductItemDto {
  @IsMongoId()
  product_id: string

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number
}

export class ApplyDiscountDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsMongoId()
  userId: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderValue: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[]
}

export class GetDiscountByCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string
}

export class GetAvailableDiscountDto {
  @IsMongoId()
  vendorId: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderValue: number
}
