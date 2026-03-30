import { Type } from 'class-transformer'
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { BaseDto } from '~/helper'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '~/types/type'

export class CreateCodPaymentDto extends BaseDto {
  @IsMongoId()
  orderId: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number

  @IsOptional()
  @IsEnum(PAYMENT_METHOD)
  method?: PAYMENT_METHOD
}

export class PaymentIdParamsDto extends BaseDto {
  @IsMongoId()
  id: string
}

export class OrderPaymentParamsDto extends BaseDto {
  @IsMongoId()
  orderId: string
}

export class MarkFailedPaymentDto extends BaseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string
}

export class GetPaymentsQueryDto extends BaseDto {
  @IsOptional()
  @IsMongoId()
  orderId?: string

  @IsOptional()
  @IsEnum(PAYMENT_STATUS)
  status?: PAYMENT_STATUS
}
