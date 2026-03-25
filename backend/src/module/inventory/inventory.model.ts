import mongoose, { Document, Schema, Types } from 'mongoose'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const INVENTORY_COLLECTION = 'inventories'

export interface IInventory extends Document {
  _id: Types.ObjectId
  skuId: Types.ObjectId

  location: string

  stock: number
  reserved: number
  available: number

  sold: number
}

const inventorySchema = new Schema<IInventory>(
  {
    skuId: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.PRODUCT_SKU
    },

    location: String,

    stock: {
      type: Number,
      default: 0
    },

    reserved: {
      type: Number,
      default: 0
    },

    available: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: INVENTORY_COLLECTION
  }
)

const inventoryModel = mongoose.model<IInventory>(DATABASE_DOCUMENT.INVENTORY, inventorySchema)

export default inventoryModel
