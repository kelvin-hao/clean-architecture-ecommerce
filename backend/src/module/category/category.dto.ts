import { Exclude, Expose, Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseDto, BaseExposeDto } from '~/helper'
import { ATTRIBUTES_TYPE } from '~/types/type'

export class AttributeDTO {
  @IsString()
  name: string

  @IsEnum(ATTRIBUTES_TYPE)
  type: ATTRIBUTES_TYPE

  @IsOptional()
  options?: string[]

  @IsBoolean()
  is_required: boolean

  @IsBoolean()
  is_variant: boolean
}

export class CreateCategoryDTO extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsMongoId()
  parentId?: string
}

export class UpdateCategoryDTO extends BaseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsMongoId()
  parent?: string
}

export class CategoryIdParamDTO extends BaseDto {
  @IsMongoId()
  id: string
}
// output dto
@Exclude()
export class CategoryResponseDTO extends BaseExposeDto {
  @Expose()
  name: string

  @Expose()
  slug: string

  @Expose()
  @Transform((params) => params.obj.parent?.toString?.() ?? null)
  parent: string | null

  @Expose()
  level: number

  @Expose()
  children: CategoryResponseDTO[]
}
