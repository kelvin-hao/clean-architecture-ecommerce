import mongoose, { Document, Schema, Types } from 'mongoose'
import { ProductAttribute, Image, ProductStatusEnum } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PRODUCT_SPU_COLLECTION = 'productSpus'

export interface IProductSPU extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  description?: string
  short_description?: string
  brand?: string
  images: Image[]
  vendor: Types.ObjectId
  category: Types.ObjectId
  sku_ids: Types.ObjectId[]
  attributes: ProductAttribute[]
  base_price?: number
  rating_average: number
  rating_count: number
  status: ProductStatusEnum
}

const productSPUSchema = new Schema<IProductSPU>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },

    description: String,
    short_description: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.CATEGORY
    },

    brand: String,

    vendor: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.VENDOR
    },

    images: [
      {
        url: String,
        alt: String,
        is_primary: Boolean
      }
    ],

    sku_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: DATABASE_DOCUMENT.PRODUCT_SKU
      }
    ],

    attributes: [
      {
        name: String,
        options: [String]
      }
    ],

    base_price: Number,

    rating_average: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ProductStatusEnum,
      default: ProductStatusEnum.DARFF
    }
  },
  {
    timestamps: true,
    collection: PRODUCT_SPU_COLLECTION
  }
)

const ProductSPUModel = mongoose.model<IProductSPU>(DATABASE_DOCUMENT.PRODUCT_SPU, productSPUSchema)

export default ProductSPUModel
