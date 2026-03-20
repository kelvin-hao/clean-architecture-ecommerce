import { DATABASE_DOCUMENT } from './../../utils/const.util'
import mongoose, { Schema, Types } from 'mongoose'
import { ORDER_STATUS, PAYMENT_METHOD } from '~/types/type'

const ORDER_COLLECTION = 'orders'
const ORDER_DOCUMENT = 'order'

interface IOrderItem {
  product_spu: Types.ObjectId
  product_sku: Types.ObjectId
  name: string
  image: string
  price: number
  quantity: number
  total: number
}

export interface IOrder extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId
  items: IOrderItem[]
  total_price: number
  status: ORDER_STATUS
  shipping_address: string
  payment_method: PAYMENT_METHOD
  isPaied: boolean
}

const OrderItemSchema = new Schema<IOrder['items'][number]>({
  product_spu: Schema.Types.ObjectId,

  product_sku: Schema.Types.ObjectId,
  name: String,

  image: String,

  price: {
    Type: Number,
    min: 0
  },

  quantity: {
    type: Number,
    min: 1
  },

  total: {
    type: Number,
    min: 0
  }
})

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.USER
    },

    items: [OrderItemSchema],

    total_price: {
      Type: Number,
      min: 0
    },

    status: {
      Type: String,
      enum: ORDER_STATUS,
      default: ORDER_STATUS.PENDDING
    },

    shipping_address: {
      Type: String
    },

    payment_method: {
      Type: String,
      enum: PAYMENT_METHOD,
      default: PAYMENT_METHOD.COD
    },

    isPaied: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: ORDER_COLLECTION
  }
)

const OrderModel = mongoose.model<IOrder>(ORDER_DOCUMENT, OrderSchema)

export default OrderModel
