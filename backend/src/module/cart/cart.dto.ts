import { Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator'
import { BaseDto } from '~/helper'

export class AddCartItemDto extends BaseDto {
  @IsMongoId()
  sku_id: string

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number
}

export class UpdateCartItemDto extends BaseDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number
}

export class CartItemParamsDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  sku_id: string
}
