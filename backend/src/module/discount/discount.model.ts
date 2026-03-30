import mongoose, { Schema } from 'mongoose'
import { IDiscount } from '~/types/interface'
import { DISCOUNT_APPLY_TO, DISCOUNT_TYPE } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const DISCOUNTT_COLLECTION = 'discounts'

const discountSchema = new Schema<IDiscount>(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.VENDOR,
      index: true
    },

    name: { type: String, required: true },
    description: String,

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },

    type: {
      type: String,
      enum: DISCOUNT_TYPE, // FIX | PERCENT
      required: true
    },

    value: {
      type: Number,
      required: true
    },

    max_discount_value: {
      type: Number,
      default: 0
    },

    min_order_value: {
      type: Number,
      default: 0
    },

    // 🔥 usage control
    max_uses: {
      type: Number,
      default: 0 // 0 = unlimited
    },

    used_count: {
      type: Number,
      default: 0
    },

    max_uses_per_user: {
      type: Number,
      default: 1
    },

    user_usage: [
      {
        _id: false,
        user_id: {
          type: Schema.Types.ObjectId,
          ref: DATABASE_DOCUMENT.USER,
          required: true
        },
        used_count: {
          type: Number,
          default: 1
        }
      }
    ],

    apply_to: {
      type: String,
      enum: DISCOUNT_APPLY_TO,
      default: DISCOUNT_APPLY_TO.ALL
    },

    product_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: DATABASE_DOCUMENT.PRODUCT_SPU
      }
    ],

    category_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: DATABASE_DOCUMENT.CATEGORY
      }
    ],

    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: DISCOUNTT_COLLECTION
  }
)

const discountModel = mongoose.model<IDiscount>(DATABASE_DOCUMENT.DISCOUNT, discountSchema)

export default discountModel
