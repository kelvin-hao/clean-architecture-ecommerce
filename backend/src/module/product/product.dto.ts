import { Exclude, Expose, Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator'
import { BaseDto, BaseExposeDto, BaseQueryDto } from '~/helper'
import { Image, ProductAttribute, ProductStatusEnum, VariationOption, VariationValue } from '~/types/type'

export class CreateProductSPUDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  short_description?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsArray()
  images: Image[]

  @IsMongoId()
  vendor: string

  @IsMongoId()
  category: string

  @IsOptional()
  @IsArray()
  attributes?: ProductAttribute[]

  @IsOptional()
  @IsArray()
  variationOptions?: VariationOption[]

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price?: number
}

export class UpdateProductSPUDto extends BaseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string

  @IsOptional()
  @IsString()
  short_description?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsArray()
  images?: Image[]

  @IsOptional()
  @IsMongoId()
  vendor?: string

  @IsOptional()
  @IsMongoId()
  category?: string

  @IsOptional()
  @IsArray()
  attributes?: ProductAttribute[]

  @IsOptional()
  @IsArray()
  variationOptions?: VariationOption[]

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price?: number

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum
}

export class ProductIdParamDto extends BaseDto {
  @IsMongoId()
  id: string
}

export class ProductSkuIdParamDto extends BaseDto {
  @IsMongoId()
  skuId: string
}

export class UpdateProductSKUDto extends BaseDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  compare_at_price?: number

  @IsOptional()
  @IsBoolean()
  is_active?: boolean
}

export class BulkUpdateProductSKUItemDto extends UpdateProductSKUDto {
  @IsMongoId()
  sku_id: string
}

export class BulkUpdateProductSKUDto extends BaseDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateProductSKUItemDto)
  skus: BulkUpdateProductSKUItemDto[]
}

export class ProductQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsMongoId()
  category?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_price?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_price?: number

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum
}

export class ImageResponseDto {
  @Expose()
  url: string

  @Expose()
  alt?: string
}

export class VariationOptionResponseDto {
  @Expose()
  name: string

  @Expose()
  options: string[]
}

export class AttributeResponseDto {
  @Expose()
  name: string

  @Expose()
  value: string
}

export class ProductSKUResponseDto extends BaseExposeDto {
  @Expose()
  sku_code: string

  @Expose()
  price?: number

  @Expose()
  compare_at_price?: number

  @Expose()
  variation_values: VariationValue[]

  @Expose()
  is_active?: boolean
}

@Exclude()
export class ProductResponseDto extends BaseExposeDto {
  @Expose()
  name: string

  @Expose()
  slug: string

  @Expose()
  description?: string

  @Expose()
  short_description?: string

  @Expose()
  @Transform((params) => params.obj.category?.toString?.() ?? params.obj.category ?? null)
  category: string

  @Expose()
  brand?: string

  @Expose()
  @Transform((params) => params.obj.vendor?.toString?.() ?? params.obj.vendor ?? null)
  vendor: string

  @Expose()
  @Type(() => ImageResponseDto)
  images: ImageResponseDto[]

  @Expose()
  @Type(() => VariationOptionResponseDto)
  variationOptions: VariationOptionResponseDto[]

  @Expose()
  @Type(() => AttributeResponseDto)
  attributes: AttributeResponseDto[]

  @Expose()
  base_price?: number

  @Expose()
  rating_average?: number

  @Expose()
  rating_count?: number

  @Expose()
  status: string
}

@Exclude()
export class ProductDetailResponseDto extends ProductResponseDto {
  @Expose()
  @Type(() => ProductSKUResponseDto)
  skus: ProductSKUResponseDto[]
}
