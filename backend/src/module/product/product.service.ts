import { inject, injectable } from 'inversify'
import { plainToInstance } from 'class-transformer'
import env from '~/config/env/dotenv.config'
import { elasticSearchProvider } from '~/database'
import { productIndex } from '~/database/elasticsearch/product.index'
import type { ProductIndexPayload } from '~/helper/jobs/backgroundJobManager'
import { JobType } from '~/helper/jobs/jobManager'
import { QueueManager, QueueName } from '~/helper/jobs/queueManager'
import { APIFeatures } from '~/helper'
import { BadRequestError, NotFoundError } from '~/helper/response/errorResponse'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { ProductStatusEnum, VariationOption, VariationValue } from '~/types/type'
import { convertToObjectId, slugify } from '~/utils'
import { generateSKUCode } from '~/utils/product.util'
import CategoryRepository from '../category/caterogy.repository'
import { ProductSearchBuilder, type SortProduct } from '../search/products/product.search'
import VendorRepository from '../vendor/vendor.repository'
import ProductSPURepository from './product._spu.repository'
import ProductSKURepository from './product_sku.repository'
import {
  BulkUpdateProductSKUDto,
  CreateProductSPUDto,
  ProductDetailResponseDto,
  ProductQueryDto,
  ProductResponseDto,
  ProductSKUResponseDto,
  UpdateProductSKUDto,
  UpdateProductSPUDto
} from './product.dto'

@injectable()
class ProductService {
  constructor(
    @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
    @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository,
    @inject(ContainerInjectionRegistry.VendorRepository) private vendorRepository: VendorRepository,
    @inject(ContainerInjectionRegistry.CategoryRepository) private categoryRepository: CategoryRepository
  ) {}

  async createProduct(payload: CreateProductSPUDto) {
    const slug = slugify(payload.name)
    const basePrice = payload.base_price ?? 0

    const [existingVendor, existingCategory, existingSlug] = await Promise.all([
      this.vendorRepository.findById(payload.vendor),
      this.categoryRepository.findById(payload.category),
      this.spuRepository.findBySlug(slug)
    ])

    if (!existingVendor) throw new BadRequestError('Vendor not found')
    if (!existingCategory) throw new BadRequestError('Category not found')
    if (existingSlug) throw new BadRequestError('Product name already exists')

    const createdProduct = await this.spuRepository.withTransaction(async (session) => {
      const spu = await this.spuRepository.create(
        {
          ...payload,
          slug,
          vendor: convertToObjectId(payload.vendor),
          category: convertToObjectId(payload.category),
          base_price: basePrice,
          variationOptions: payload.variationOptions ?? [],
          status: ProductStatusEnum.DARFF,
          is_delete: false
        },
        { session }
      )

      if (!spu) throw new BadRequestError('Can not create product. Please try again')

      const combinations = this.generateCombinations(payload.variationOptions)
      const skusData = combinations.map((combo) => ({
        spu: spu._id,
        sku_code: generateSKUCode(spu._id.toString(), combo),
        variation_values: combo,
        price: basePrice,
        is_active: true,
        is_delete: false
      }))

      const createdSkus = await this.skuRepository.createMany(skusData, session)

      return {
        spu,
        createdSkus
      }
    })

    await this.enqueueProductIndex(createdProduct.spu).catch((error: unknown) => {
      console.error(
        `[ProductService] Failed to queue Elasticsearch indexing for product ${createdProduct.spu._id.toString()}`,
        error
      )
    })

    return {
      id: createdProduct.spu._id,
      skuCount: createdProduct.createdSkus.length,
      skus: this.toProductSkuResponses(createdProduct.createdSkus)
    }
  }

  async getProductSkus(productId: string) {
    const product = await this.spuRepository.findById(productId)

    if (!product) throw new NotFoundError('Product not found')

    const skus = await this.skuRepository.findBySpu(productId)

    return this.toProductSkuResponses(skus)
  }

  async getSkuById(skuId: string) {
    const sku = await this.skuRepository.findById(skuId)

    if (!sku || sku.is_delete) throw new NotFoundError('SKU not found')

    return this.toProductSkuResponse(sku)
  }

  async updateSku(skuId: string, payload: UpdateProductSKUDto) {
    const sku = await this.skuRepository.findById(skuId)

    if (!sku || sku.is_delete) throw new NotFoundError('SKU not found')

    this.validateSkuPayload(payload, sku.price)

    const updatedSku = await this.skuRepository.update(
      { _id: skuId, is_delete: false },
      this.buildSkuUpdatePayload(payload)
    )

    if (!updatedSku) throw new BadRequestError('Can not update SKU. Please try again')

    return this.toProductSkuResponse(updatedSku)
  }

  async bulkUpdateProductSkus(productId: string, payload: BulkUpdateProductSKUDto) {
    const product = await this.spuRepository.findById(productId)

    if (!product) throw new NotFoundError('Product not found')

    const existingSkus = await this.skuRepository.findBySpu(productId)
    const skuMap = new Map(existingSkus.map((sku) => [sku._id.toString(), sku]))

    if (existingSkus.length === 0) {
      throw new BadRequestError('Product has no SKUs to update')
    }

    payload.skus.forEach((item) => {
      const existingSku = skuMap.get(item.sku_id)

      if (!existingSku) {
        throw new BadRequestError(`SKU ${item.sku_id} does not belong to this product`)
      }

      this.validateSkuPayload(item, existingSku.price)
    })

    return this.spuRepository.withTransaction(async (session) => {
      const updatedSkus = await Promise.all(
        payload.skus.map(async (item) => {
          const updatedSku = await this.skuRepository.update(
            { _id: item.sku_id, spu: product._id, is_delete: false },
            this.buildSkuUpdatePayload(item),
            session
          )

          if (!updatedSku) {
            throw new BadRequestError(`Can not update SKU ${item.sku_id}. Please try again`)
          }

          return updatedSku
        })
      )

      return {
        productId: product._id,
        updatedCount: updatedSkus.length,
        skus: this.toProductSkuResponses(updatedSkus)
      }
    })
  }

  async getProducts(query: ProductQueryDto) {
    if (this.shouldUseElasticSearch(query)) {
      const elasticResult = await this.getProductsFromElastic(query)

      if (elasticResult) {
        return elasticResult
      }
    }

    return this.getProductsFromMongo(query)
  }

  async getProductById(productId: string) {
    const [product, skus] = await Promise.all([
      this.spuRepository.findById(productId),
      this.skuRepository.findBySpu(productId)
    ])

    if (!product) throw new NotFoundError('Product not found')

    const productObject = typeof product.toObject === 'function' ? product.toObject() : product

    return plainToInstance(
      ProductDetailResponseDto,
      {
        ...productObject,
        skus
      },
      {
        excludeExtraneousValues: true
      }
    )
  }

  async updateProduct(productId: string, payload: UpdateProductSPUDto) {
    const existingProduct = await this.spuRepository.findById(productId)

    if (!existingProduct) throw new NotFoundError('Product not found')

    if (payload.vendor) {
      const vendor = await this.vendorRepository.findById(payload.vendor)
      if (!vendor) throw new BadRequestError('Vendor not found')
    }

    if (payload.category) {
      const category = await this.categoryRepository.findById(payload.category)
      if (!category) throw new BadRequestError('Category not found')
    }

    const slugSource = payload.slug || payload.name || existingProduct.name
    const nextSlug = slugify(slugSource)

    if (nextSlug !== existingProduct.slug) {
      const existedSlug = await this.spuRepository.findBySlug(nextSlug)
      if (existedSlug && existedSlug._id.toString() !== productId) {
        throw new BadRequestError('Product slug already exists')
      }
    }

    const updateData: Record<string, unknown> = {
      ...payload,
      slug: nextSlug
    }

    if (payload.vendor) {
      updateData.vendor = convertToObjectId(payload.vendor)
    }

    if (payload.category) {
      updateData.category = convertToObjectId(payload.category)
    }

    return this.spuRepository.withTransaction(async (session) => {
      const updatedProduct = await this.spuRepository.update({ _id: productId }, updateData, session)

      if (!updatedProduct) {
        throw new BadRequestError('Can not update product. Please try again')
      }

      if (payload.variationOptions) {
        await this.skuRepository.updateMany(
          { spu: existingProduct._id, is_delete: false },
          { is_active: false, is_delete: true },
          session
        )

        const combinations = this.generateCombinations(payload.variationOptions)
        const skuPrice = payload.base_price ?? updatedProduct.base_price ?? existingProduct.base_price ?? 0

        const skusData = combinations.map((combo) => ({
          spu: existingProduct._id,
          sku_code: generateSKUCode(existingProduct._id.toString(), combo),
          variation_values: combo,
          price: skuPrice,
          is_active: true,
          is_delete: false
        }))

        await this.skuRepository.createMany(skusData, session)
      } else if (payload.base_price !== undefined) {
        await this.skuRepository.updateMany(
          { spu: existingProduct._id, is_delete: false },
          { price: payload.base_price },
          session
        )
      }

      return {
        id: updatedProduct._id
      }
    })
  }

  async publishProduct(productId: string) {
    const product = await this.spuRepository.findById(productId)

    if (!product) throw new NotFoundError('Product not found')

    const skus = await this.skuRepository.findBySpu(productId)
    if (skus.length === 0) throw new BadRequestError('Product must have at least one SKU before publishing')

    const updatedProduct = await this.spuRepository.update({ _id: productId }, { status: ProductStatusEnum.ACTIVE })

    if (!updatedProduct) throw new BadRequestError('Can not publish product. Please try again')

    return {
      id: updatedProduct._id,
      status: updatedProduct.status
    }
  }

  async archiveProduct(productId: string) {
    const product = await this.spuRepository.findById(productId)

    if (!product) throw new NotFoundError('Product not found')

    const updatedProduct = await this.spuRepository.update({ _id: productId }, { status: ProductStatusEnum.ARCHIVED })

    if (!updatedProduct) throw new BadRequestError('Can not archive product. Please try again')

    return {
      id: updatedProduct._id,
      status: updatedProduct.status
    }
  }

  async deleteProduct(productId: string) {
    const product = await this.spuRepository.findById(productId)

    if (!product) throw new NotFoundError('Product not found')

    return this.spuRepository.withTransaction(async (session) => {
      const deletedProduct = await this.spuRepository.update(
        { _id: productId },
        {
          is_delete: true,
          status: ProductStatusEnum.ARCHIVED
        },
        session
      )

      await this.skuRepository.updateMany(
        { spu: product._id, is_delete: false },
        {
          is_active: false,
          is_delete: true
        },
        session
      )

      if (!deletedProduct) throw new BadRequestError('Can not delete product. Please try again')

      return {
        id: deletedProduct._id
      }
    })
  }

  private async enqueueProductIndex(product: {
    _id: { toString(): string }
    name: string
    description?: string
    brand?: string
    category: unknown
    base_price?: number
    rating_average?: number
  }) {
    const productQueue = await QueueManager.getQueue(QueueName.PRODUCT_INDEX)

    await productQueue.add(
      JobType.INDEX_PRODUCT,
      {
        payload: this.buildProductIndexPayload(product)
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: 50
      }
    )
  }

  private buildProductIndexPayload(product: {
    _id: { toString(): string }
    name: string
    description?: string
    brand?: string
    category: unknown
    base_price?: number
    rating_average?: number
  }): ProductIndexPayload {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description ?? '',
      brand: product.brand ?? '',
      category: String(product.category),
      price: product.base_price ?? 0,
      rating: product.rating_average ?? 0,
      createdAt: new Date().toISOString()
    }
  }

  private async getProductsFromMongo(query: ProductQueryDto) {
    const filters = this.buildProductFilters(query)
    const productsFeatures = new APIFeatures(this.spuRepository.getQuery(filters), query).search().sort().paginate()
    const products = await productsFeatures.exec()

    return this.buildProductListResponse(products, query)
  }

  private async getProductsFromElastic(query: ProductQueryDto) {
    try {
      const elastic = await elasticSearchProvider()
      const searchRequest = new ProductSearchBuilder({
        keyword: query.keyword,
        filters: {
          brand: query.brand,
          category: query.category,
          priceFrom: query.min_price,
          priceTo: query.max_price
        },
        sort: this.normalizeElasticSort(query.sort),
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10
      }).build()

      const response = await elastic.search({
        index: productIndex.name,
        ...searchRequest,
        track_total_hits: true
      })

      const ids = response.hits.hits.map((hit) => hit._id).filter((id): id is string => Boolean(id))

      if (ids.length === 0) {
        return this.buildProductListResponse([], query)
      }

      const products = await this.spuRepository.findAll({
        ...this.buildProductFilters(query),
        _id: { $in: ids.map((id) => convertToObjectId(id)) }
      })

      const productMap = new Map(products.map((product) => [product._id.toString(), product]))
      const orderedProducts = ids
        .map((id) => productMap.get(id))
        .filter((product): product is (typeof products)[number] => Boolean(product))

      return this.buildProductListResponse(orderedProducts, query)
    } catch (error: unknown) {
      console.error('[ProductService] Elasticsearch product search failed. Falling back to MongoDB.', error)
      return null
    }
  }

  private buildProductListResponse(products: unknown[], query: ProductQueryDto) {
    const responseProducts = products.map((product) =>
      plainToInstance(ProductResponseDto, product, {
        excludeExtraneousValues: true
      })
    )

    return {
      data: responseProducts,
      meta: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        count: responseProducts.length
      }
    }
  }

  private shouldUseElasticSearch(query: ProductQueryDto) {
    if (!env.ES_NODE) {
      return false
    }

    return Boolean(
      query.keyword ||
      query.brand ||
      query.category ||
      query.min_price !== undefined ||
      query.max_price !== undefined ||
      this.normalizeElasticSort(query.sort)
    )
  }

  private normalizeElasticSort(sort?: string): SortProduct | undefined {
    const normalizedSort = sort?.split(',')[0]?.trim()

    switch (normalizedSort) {
      case 'price_asc':
      case 'price':
      case 'base_price':
        return 'price_asc'

      case 'price_desc':
      case '-price':
      case '-base_price':
        return 'price_desc'

      case 'newest':
      case 'createdAt':
      case '-createdAt':
        return 'newest'

      case 'rating':
      case '-rating_average':
        return 'rating'

      case 'sold':
        return 'sold'

      default:
        return undefined
    }
  }

  private buildProductFilters(query: ProductQueryDto) {
    const filters: Record<string, unknown> = {
      is_delete: false
    }

    if (query.category) {
      filters.category = convertToObjectId(query.category)
    }

    if (query.brand) {
      filters.brand = { $regex: query.brand, $options: 'i' }
    }

    if (query.status) {
      filters.status = query.status
    }

    if (query.min_price !== undefined || query.max_price !== undefined) {
      filters.base_price = {}

      if (query.min_price !== undefined) {
        ;(filters.base_price as Record<string, number>).$gte = query.min_price
      }

      if (query.max_price !== undefined) {
        ;(filters.base_price as Record<string, number>).$lte = query.max_price
      }
    }

    return filters
  }

  private buildSkuUpdatePayload(payload: UpdateProductSKUDto) {
    const updateData: Record<string, unknown> = {}

    if (payload.price !== undefined) {
      updateData.price = payload.price
    }

    if (payload.compare_at_price !== undefined) {
      updateData.compare_at_price = payload.compare_at_price
    }

    if (payload.is_active !== undefined) {
      updateData.is_active = payload.is_active
    }

    return updateData
  }

  private validateSkuPayload(payload: UpdateProductSKUDto, currentPrice = 0) {
    const nextPrice = payload.price ?? currentPrice

    if (payload.compare_at_price !== undefined && payload.compare_at_price < nextPrice) {
      throw new BadRequestError('Compare price must be greater than or equal to the selling price')
    }
  }

  private toProductSkuResponse(sku: unknown) {
    return plainToInstance(ProductSKUResponseDto, sku, {
      excludeExtraneousValues: true
    })
  }

  private toProductSkuResponses(skus: unknown[]) {
    return skus.map((sku) => this.toProductSkuResponse(sku))
  }

  private generateCombinations(options: VariationOption[] = []): VariationValue[][] {
    if (options.length === 0) {
      return [[]]
    }

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
