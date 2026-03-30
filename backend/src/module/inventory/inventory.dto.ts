import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { BaseDto, BaseQueryDto } from '~/helper'

export class InventorySkuParamsDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  skuId: string
}

export class CreateInventoryDto extends BaseDto {
  @IsOptional()
  @IsString()
  location?: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number
}

export class UpdateInventoryDto extends BaseDto {
  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number
}

export class InventoryQuantityDto extends BaseDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number
}

export class InventoryQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsMongoId()
  skuId?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  lowStockOnly?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  threshold?: number
}
