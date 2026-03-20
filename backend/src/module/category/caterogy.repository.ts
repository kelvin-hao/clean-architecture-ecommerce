import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ICategory } from './category.model'
import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { Model } from 'mongoose'

interface ICategoryRepository extends IRepositoryBase<ICategory> {
  findBySlug(slug: string): Promise<ICategory | null>
  findChildren(parentID: string): Promise<ICategory[] | []>
}

@injectable()
class CategoryRepository extends RepositoryBase<ICategory> implements ICategoryRepository {
  constructor(@inject(ContainerInjectionRegistry.CategoryModel) categoryModel: Model<ICategory>) {
    super(categoryModel)
  }

  async findBySlug(slug: string) {
    return await this.model.findOne({ slug })
  }

  async findChildren(parentID: string): Promise<ICategory[] | []> {
    return await this.findAll({
      parent: parentID
    })
  }
}

export default CategoryRepository
