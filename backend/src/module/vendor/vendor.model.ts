import mongoose, { Document, Schema } from 'mongoose'
import { Types } from 'mongoose'
import { VendorApplicationStatusEnum } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const VENDOR_COLLECTION = 'vendors'

export interface IVendor extends Document {
  _id: Types.ObjectId
  user_id: Types.ObjectId
  shop_name: string
  shop_slug: string
  shop_logo?: string
  shop_banner?: string
  description?: string
  verified?: boolean
  status_application: VendorApplicationStatusEnum
  reject_reason?: string
}

const VendorSchema = new Schema<IVendor>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.USER,
      required: true
    },

    shop_name: { type: String, required: true },

    shop_slug: { type: String, index: true },

    shop_logo: { type: String },

    shop_banner: { type: String },

    description: { type: String },

    verified: { type: Boolean, default: false },

    status_application: {
      type: String,
      enum: VendorApplicationStatusEnum,
      default: VendorApplicationStatusEnum.PENDING
    },

    reject_reason: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: VENDOR_COLLECTION
  }
)

const VendorModel = mongoose.model<IVendor>(DATABASE_DOCUMENT.VENDOR, VendorSchema)

export default VendorModel
