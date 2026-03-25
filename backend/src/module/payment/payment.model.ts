import mongoose, { Schema, Types } from 'mongoose'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PAYMENT_COLLECTION = 'payments'
export interface IPayment extends Document {
  _id: Types.ObjectId

  orderId: Types.ObjectId

  amount: number

  method: PAYMENT_METHOD

  stauts: PAYMENT_STATUS
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.ORDER
    },

    amount: {
      type: Number,
      default: 0
    },

    stauts: {
      type: String,
      enum: PAYMENT_STATUS,
      default: PAYMENT_STATUS.PENDING
    },

    method: {
      type: String,
      enum: PAYMENT_METHOD,
      default: PAYMENT_METHOD.COD
    }
  },
  {
    timestamps: true,
    collection: PAYMENT_COLLECTION
  }
)

const paymentModel = mongoose.model<IPayment>(DATABASE_DOCUMENT.PAYMENT, paymentSchema)

export default paymentModel
