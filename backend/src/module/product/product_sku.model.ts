import mongoose, { Document, HydratedDocument, Schema, Types } from 'mongoose'
import { VariationValue } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PRODUCT_SKU_COLLECTION = 'productSkus'

export interface IProductSKU extends Document {
  _id: Types.ObjectId
  spu: Types.ObjectId
  sku_code: string
  price?: number
  compare_at_price?: number
  variationValues: VariationValue[]
  is_active?: boolean
}

export type ProductSKUDocument = HydratedDocument<IProductSKU>
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

    variationValues: [
      {
        name: String,
        value: String
      }
    ],

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
