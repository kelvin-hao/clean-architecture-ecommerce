import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { ClientSession, Document, FilterQuery, Model, Query, SaveOptions, UpdateQuery } from 'mongoose'
import { injectable, unmanaged } from 'inversify'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class BaseDto {}

@Exclude()
export class BaseExposeDto {
  @Expose()
  @Transform((params) => params.obj._id)
  id: string

  @Expose()
  createdAt: Date
}

export interface IRepositoryBase<T> {
  create(data: Partial<T>, options?: SaveOptions & { session?: ClientSession }): Promise<T>

  findById(id: string): Promise<T | null>

  findOne(condition: FilterQuery<T>): Promise<T | null>

  findAll(condition?: FilterQuery<T>): Promise<T[]>

  update(filter: FilterQuery<T>, update: UpdateQuery<T>, session?: ClientSession): Promise<T | null>

  delete(filter: FilterQuery<T>, session?: ClientSession): Promise<boolean>
}

@injectable()
export abstract class RepositoryBase<T extends Document> implements IRepositoryBase<T> {
  protected model: Model<T>

  constructor(@unmanaged() model: Model<T>) {
    this.model = model
  }

  async create(data: Partial<T>, options?: SaveOptions & { session?: ClientSession }): Promise<T> {
    const doc = new this.model(data)
    const saved = await doc.save({ session: options?.session })

    return saved.toObject<T>()
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById({ _id: id, is_delete: false }).exec()
  }

  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne({ ...condition, is_delete: false }).exec()
  }

  async findAll(condition?: FilterQuery<T>): Promise<T[]> {
    return this.model.find({ ...condition, is_delete: false }).exec()
  }

  async update(filter: FilterQuery<T>, update: UpdateQuery<T>, session?: ClientSession): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, {
        new: true,
        session
      })
      .lean<T>()
      .exec()
  }

  async delete(filter: FilterQuery<T>, session?: ClientSession): Promise<boolean> {
    const result = await this.model.deleteOne(filter, { session })

    return result.deletedCount === 1
  }
}

export class BaseQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number

  @IsOptional()
  @IsString()
  sort?: string // "price,-createdAt"

  @IsOptional()
  @IsString()
  fields?: string // "name,price"

  @IsOptional()
  @IsString()
  keyword?: string
}

export class APIFeatures<T, Q extends BaseQueryDto> {
  private query: Query<T[], T>
  private queryString: Q

  constructor(query: Query<T[], T>, queryString: Q) {
    this.query = query
    this.queryString = queryString
  }

  // search
  search(fields: (keyof T)[] = ['name' as keyof T]) {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword

      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field as string]: { $regex: keyword, $options: 'i' }
        }))
      })
    }

    return this
  }

  // sort
  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort(defaultSort)
    }

    return this
  }

  // paginate
  paginate() {
    const page = Number(this.queryString?.page) || 1
    const limit = Number(this.queryString?.limit) || 10

    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }

  // select
  select(defaultFields?: string) {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else if (defaultFields) {
      this.query = this.query.select(defaultFields)
    }

    return this
  }

  async exec() {
    return await this.query
  }
}
