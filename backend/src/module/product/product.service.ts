// import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
// import ProductSKURepository from './product_sku.repository'
// import { inject, injectable } from 'inversify'
// import ProductSPURepository from './product._spu.repository'
// import Redis from 'ioredis'
// import { BadRequest } from '~/helper/response/errorResponse'
// import { ProductAttribute } from '~/types/type'

// @injectable()
// class ProductService {
//   constructor(
//     @inject(ContainerInjectionRegistry.ProductSKURepository) private skuRepository: ProductSKURepository,
//     @inject(ContainerInjectionRegistry.ProductSPURepository) private spuRepository: ProductSPURepository,
//     @inject(ContainerInjectionRegistry.RedisDB) private redisClient: Redis
//   ) {}

//   private generateSKUCode(productName: string, attrs: Record<string, string>) {
//     const base = productName.replace(/\s+/g, '-').toUpperCase()
//     const varirants = Object.values(attrs).join('-').toUpperCase()

//     return `${base}-${varirants}`
//   }

//   async createProduct(dto: CreateProductDTO) {
//     const skus = await this.skuRepository.findAll({
//       _id: { $in: dto.sku_ids }
//     })

//     if (skus.length !== dto.sku_ids.length) {
//       throw new Error('Some SKUs not found')
//     }

//     const product = await this.spuRepository.create({
//       name: dto.name,
//       slug: dto.slug,
//       category: dto.categoryId,
//       attributes: dto.attributes,
//       sku_ids: dto.sku_ids,
//       images: dto.images
//     })

//     // 🔥 update SKU → link back to product
//     await this.skuRepository.updateMany({ _id: { $in: dto.sku_ids } }, { productId: product._id })

//     return product
//   }

//   async createSKUs(dto: CreateSkuDto) {
//     const variants = this.generateVariants(dto.variants)

//     const skus = variants.map((attrs) => ({
//       attributes: attrs,
//       price: dto.basePrice,
//       stock: 0,
//       reservedStock: 0,
//       skuCode: this.generateSKUCode(dto.name, attrs)
//     }))

//     const codes = new Set()
//     for (const sku of skus) {
//       if (codes.has(sku.skuCode)) {
//         throw new BadRequest('Duplicate SKU generated')
//       }
//       codes.add(sku.skuCode)
//     }
//     const created = await this.skuRepository.insertMany(skus)

//     return created
//   }

//   private generateVariants(attrs: ProductAttribute[]): Record<string, string>[] {
//     return attrs.reduce(
//       (acc, att) => {
//         const result: Record<string, string>[] = []

//         acc.forEach((pre) => {
//           att.options.forEach((opt) => {
//             result.push({
//               ...pre,
//               [att.name]: opt
//             })
//           })
//         })

//         return result
//       },
//       [{}]
//     )
//   }
// }

// export default ProductService
