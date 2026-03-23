import { Exclude, Expose, Type } from 'class-transformer'
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { BaseDto, BaseExposeDto, BaseQueryDto } from '~/helper'
import { Image, ProductAttribute, ProductStatusEnum, VariationOption } from '~/types/type'

export class CreateProductSPUDto extends BaseDto {
  @IsString()
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

  @IsString()
  vendor: string

  @IsString()
  category: string

  @IsOptional()
  @IsArray()
  attributes: ProductAttribute[]

  @IsOptional()
  variationOptions?: VariationOption[]

  @IsOptional()
  @IsNumber()
  base_price?: number
}

export class ProductQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
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

// Product response

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
  category: string

  @Expose()
  brand?: string

  @Expose()
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
