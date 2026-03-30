import mongoose, { Document, Schema, Types } from 'mongoose'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PAYMENT_COLLECTION = 'payments'

export interface IPayment extends Document {
  _id: Types.ObjectId
  orderId: Types.ObjectId
  amount: number
  method: PAYMENT_METHOD
  status: PAYMENT_STATUS
  failure_reason?: string
  paid_at?: Date
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.ORDER,
      index: true,
      required: true
    },

    amount: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: PAYMENT_STATUS.PENDING
    },

    method: {
      type: String,
      enum: PAYMENT_METHOD,
      default: PAYMENT_METHOD.COD
    },

    failure_reason: {
      type: String,
      default: null
    },

    paid_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: PAYMENT_COLLECTION
  }
)

const paymentModel = mongoose.model<IPayment>(DATABASE_DOCUMENT.PAYMENT, paymentSchema)

export default paymentModel
