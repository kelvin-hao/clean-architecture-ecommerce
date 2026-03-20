import mongoose, { Document, Schema, Types } from 'mongoose'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PRODUCT_SKU_COLLECTION = 'productSkus'

export interface IProductSKU extends Document {
  _id: Types.ObjectId
  product?: Types.ObjectId
  sku_code: string
  price: number
  compare_at_price?: number
  stock: number
  reserved_stock: number
  attributes: Record<string, string>
  is_active: boolean
}

const productSKUSchema = new Schema<IProductSKU>(
  {
    product: {
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
    compare_at_price: Number,

    stock: { type: Number, default: 0 },
    reserved_stock: { type: Number, default: 0 },

    attributes: {
      type: Map,
      of: String,
      required: true
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: PRODUCT_SKU_COLLECTION
  }
)

const ProductSKUModel = mongoose.model<IProductSKU>(DATABASE_DOCUMENT.PRODUCT_SKU, productSKUSchema)

export default ProductSKUModel
