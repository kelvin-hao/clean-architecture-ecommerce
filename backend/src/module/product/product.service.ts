import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import ProductSKURepository from './product_sku.repository'
import { inject, injectable } from 'inversify'
import ProductSPURepository from './product._spu.repository'
import Redis from 'ioredis'
import { BadRequestError } from '~/helper/response/errorResponse'
import { VariationOption, VariationValue } from '~/types/type'
import { CreateProductSPUDto, ProductQueryDto, ProductResponseDto } from './product.dto'
import UserRepository from '../user/user.repository'
import CategoryRepository from '../category/caterogy.repository'
import { convertToObjectId, generateSKUCode, slugify } from '~/utils'
import { APIFeatures } from '~/helper'
import { plainToInstance } from 'class-transformer'

@injectable()
class ProductService {
  constructor(
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository,
    @inject(ContainerInjectionRegistry.UserRepository) private userRepository: UserRepository,
    @inject(ContainerInjectionRegistry.CategoryRepository) private categoryRepository: CategoryRepository,
    @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
  ) {}

  async createProduct(payload: CreateProductSPUDto) {
    // const [existingVendor, existingCategory] = await Promise.allSettled([
    //   this.userRepository.findById(payload.vendor),
    //   this.categoryRepository.findById(payload.category)
    // ])
    // if (!existingVendor || !existingCategory) throw new BadRequestError('Can not create product. Please try again')

    return this.spuRepository.withTransaction(async (session) => {
      const spu = await this.spuRepository.create(
        {
          ...payload,
          slug: slugify(payload.name),
          vendor: convertToObjectId(payload.vendor),
          category: convertToObjectId(payload.category)
        },
        { session: session }
      )

      if (!spu) throw new BadRequestError('Can not create product. Please try again')
      const combinations = this.generateCombinations(spu.variationOptions)
      const skusData = combinations.map((combo, _) => ({
        spu: spu._id,
        sku_code: generateSKUCode(spu._id.toString(), combo),
        variationValues: combo,
        price: payload.base_price
      }))
      await this.skuRepository.createMany(skusData, session)
      return {
        spu: spu._id
      }
    })
  }

  async getProducts(query: ProductQueryDto) {
    const productsFeatures = new APIFeatures(this.spuRepository.getQuery(), query).paginate()
    const products = await productsFeatures.exec()

    const responseProducts = products.map((product) =>
      plainToInstance(ProductResponseDto, product, {
        excludeExtraneousValues: true
      })
    )
    return {
      data: responseProducts
    }
  }

  private generateCombinations(options: VariationOption[]): VariationValue[][] {
    return options.reduce<VariationValue[][]>(
      (acc, option) => {
        const result: VariationValue[][] = []

        acc.forEach((prev) => {
          option.options.forEach((value) => {
            result.push([...prev, { name: option.name, value }])
          })
        })

        return result
      },
      [[]]
    )
  }
}

export default ProductService
