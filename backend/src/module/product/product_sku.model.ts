import mongoose, { Document, Schema, Types } from 'mongoose'
import { VariationValue } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PRODUCT_SKU_COLLECTION = 'productSkus'

export interface IProductSKU extends Document {
  _id: Types.ObjectId
  spu: Types.ObjectId
  sku_code: string
  price?: number
  compare_at_price?: number
  variation_values: VariationValue[]
  is_active?: boolean
  is_delete?: boolean
}

const productSKUSchema = new Schema<IProductSKU>(
  {
    spu: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.PRODUCT_SPU,
      index: true,
      required: true
    },

    sku_code: {
      type: String,
      unique: true,
      index: true
    },

    price: { type: Number, required: true },
    compare_at_price: { type: Number, default: null },

    variation_values: [
      {
        name: String,
        value: String
      }
    ],

    is_active: {
      type: Boolean,
      default: true
    },

    is_delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: PRODUCT_SKU_COLLECTION
  }
)

const ProductSKUModel = mongoose.model<IProductSKU>(DATABASE_DOCUMENT.PRODUCT_SKU, productSKUSchema)

export default ProductSKUModel
