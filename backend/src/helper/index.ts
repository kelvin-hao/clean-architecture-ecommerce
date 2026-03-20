import { Exclude, Expose, Transform, Type } from 'class-transformer'

export class BaseDto {}

@Exclude()
export class BaseExposeDTO {
  @Expose()
  @Transform((params) => params.obj._id)
  id: string

  @Expose()
  createdAt: Date
}

import { Document, FilterQuery, Model } from 'mongoose'
import { injectable, unmanaged } from 'inversify'
import { IsInt, IsMongoId, Min } from 'class-validator'

export interface IRepositoryBase<T> {
  create(data: Partial<T>): Promise<T>

  findById(id: string): Promise<T | null>

  findOne(condition: FilterQuery<T>): Promise<T | null>

  findAll(condition?: FilterQuery<T>): Promise<T[]>

  paginate(options: QueryOptions<T>): Promise<PaginatedResult<T>>

  update(id: string, data: Partial<T>): Promise<T | null>

  delete(id: string): Promise<boolean>
}

export interface QueryOptions<T> {
  filter?: FilterQuery<T>
  select?: Record<string, 1 | 0>
  sort?: Record<string, 1 | -1>
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@injectable()
export abstract class RepositoryBase<T extends Document> implements IRepositoryBase<T> {
  protected model: Model<T>

  constructor(@unmanaged() model: Model<T>) {
    this.model = model
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data)
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(condition).exec()
  }

  async findAll(condition?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(condition || {}).exec()
  }

  async paginate(options: QueryOptions<T>): Promise<PaginatedResult<T>> {
    const { filter = {}, select, sort, page = 1, limit = 20 } = options

    const skip = (page - 1) * limit

    const query = this.model.find({ ...filter, deletedAt: null })

    if (select) query.select(select)

    if (sort) query.sort(sort)

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.model.countDocuments({ ...filter, deletedAt: null })
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec()
    return result.deletedCount === 1
  }
}

export class ParamsIDDTO {
  @IsMongoId()
  id: string
}

export class QueryPaginationDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10
}
