import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseDto, BaseQueryDto } from '~/helper'
import { ORDER_STATUS, PAYMENT_METHOD } from '~/types/type'

export class CreateOrderDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  shipping_address: string

  @IsOptional()
  @IsEnum(PAYMENT_METHOD)
  payment_method?: PAYMENT_METHOD
}

export class OrderIdParamsDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string
}

export class OrderQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  status?: ORDER_STATUS
}
