import { Exclude, Expose, Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseDto, BaseExposeDTO } from '~/helper'
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
  name: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsString()
  parentId?: string
}

export class UpdateCategoryDTO extends BaseDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  parent?: string
}
// output dto
@Exclude()
export class CategoryResponseDTO extends BaseExposeDTO {
  @Expose()
  name: string

  @Expose()
  slug: string

  @Expose()
  @Transform((params) => params.obj.parent)
  parent: string

  @Expose()
  children: CategoryResponseDTO[]
}
