import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import CategoryRepository from './caterogy.repository'
import { inject, injectable } from 'inversify'
import { CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO } from './category.dto'
import { BadRequest } from '~/helper/response/errorResponse'
import { convertToObjectId, slugify } from '~/utils'
import { Types } from 'mongoose'
import { plainToInstance } from 'class-transformer'
import Redis from 'ioredis'
import { MAX_LEVEL_CATEGORY, ONE_MINUTES_IN_SECONDS } from '~/utils/const.util'

@injectable()
class CategoryService {
  constructor(
    @inject(ContainerInjectionRegistry.CategoryRepository) private categoryRepository: CategoryRepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async createCategory(payload: CreateCategoryDTO) {
    const { name, slug, parentId } = payload

    const finalSlug = slug || slugify(name)

    const existedSlug = await this.categoryRepository.findBySlug(finalSlug)

    if (existedSlug) throw new BadRequest('Name or slug already exist')

    let paths: Types.ObjectId[] = []
    let level = 0

    if (parentId) {
      const parent = await this.categoryRepository.findById(parentId)
      if (!parent) throw new BadRequest('Parent category not found')

      paths = [...parent.path, parent._id]
      level = parent.level + 1
    }

    if (level > MAX_LEVEL_CATEGORY) throw new BadRequest('Too deep')

    const data = await this.categoryRepository.create({
      name,
      slug: finalSlug,
      parent: parentId ? convertToObjectId(parentId) : undefined,
      path: paths.length !== 0 ? paths : [],
      level
    })

    return {
      _id: data._id
    }
  }

  async getCategories() {
    const cacheKey = 'category:tree'

    const cached = await this.redisClient.get(cacheKey)
    if (cached) {
      console.log('hit cache')
      return JSON.parse(cached)
    }

    const tree = await this.getTree()
    console.log('miss cache')
    await this.redisClient.set(cacheKey, JSON.stringify(tree), 'EX', ONE_MINUTES_IN_SECONDS)

    return tree
  }

  async updateCategory(categoryID: string, payload: UpdateCategoryDTO) {
    const category = await this.categoryRepository.findById(categoryID)
    if (!category) throw new BadRequest('Category not found')

    let newPath = category.path
    let newLevel = category.level

    if (payload.parent && payload.parent !== category.parent?.toString()) {
      const newParent = await this.categoryRepository.findById(payload.parent)
      if (!newParent) throw new BadRequest('Parent category not found')

      newPath = [...newParent.path, newParent._id]
      newLevel = newParent.level + 1
      const data = {
        name: payload.name,
        parent: convertToObjectId(payload.parent),
        path: newPath,
        level: newLevel
      }

      const [_, res] = await Promise.all([
        await this.updateChildrenPath(category._id, newPath),
        await this.categoryRepository.update(categoryID, data)
      ])

      if (!res?._id) throw new BadRequest('Something went wrong')
    }

    const res = await this.categoryRepository.update(categoryID, {
      name: payload.name
    })
    if (!res?._id) throw new BadRequest('Something went wrong')

    return {
      id: res._id
    }
  }

  async deleteCategory(categoryID: string) {
    const childrens = await this.categoryRepository.findChildren(categoryID)

    if (childrens && childrens.length > 0) {
      throw new BadRequest('Cannot delete category with children')
    }

    // soft delete here
  }

  private async getTree() {
    const categories = await this.categoryRepository.findAll()

    const categoriesResponse = categories.map((category) =>
      plainToInstance(CategoryResponseDTO, category, {
        excludeExtraneousValues: true
      })
    )

    const categoryTree = new Map<string, CategoryResponseDTO>()
    const roots: CategoryResponseDTO[] = []

    for (const cat of categoriesResponse) {
      categoryTree.set(cat.id.toString(), { ...cat, children: [] })
    }

    for (const cat of categoriesResponse) {
      const node = categoryTree.get(cat.id.toString())

      if (node) {
        if (cat.parent) {
          const parent = categoryTree.get(cat.parent.toString())

          if (parent) parent.children.push(node)
          else roots.push(node)
        } else roots.push(node)
      }
    }

    return roots
  }

  private async updateChildrenPath(parentId: Types.ObjectId, parentPath: Types.ObjectId[]) {
    const children = await this.categoryRepository.findChildren(parentId.toString())

    for (const child of children) {
      const newPath = [...parentPath, parentId]

      await this.categoryRepository.update(child._id.toString(), {
        path: newPath,
        level: newPath.length
      })

      await this.updateChildrenPath(child._id, newPath)
    }
  }
}

export default CategoryService
