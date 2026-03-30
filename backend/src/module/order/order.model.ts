import mongoose, { Document, Schema, Types } from 'mongoose'
import { ORDER_STATUS, PAYMENT_METHOD } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const ORDER_COLLECTION = 'orders'
const ORDER_DOCUMENT = DATABASE_DOCUMENT.ORDER

export interface IOrderItem {
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
  is_delete: boolean
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product_spu: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.PRODUCT_SPU,
      required: true
    },

    product_sku: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.PRODUCT_SKU,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ''
    },

    price: {
      type: Number,
      min: 0,
      required: true
    },

    quantity: {
      type: Number,
      min: 1,
      required: true
    },

    total: {
      type: Number,
      min: 0,
      required: true
    }
  },
  {
    _id: false
  }
)

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_DOCUMENT.USER,
      required: true,
      index: true
    },

    items: {
      type: [OrderItemSchema],
      default: []
    },

    total_price: {
      type: Number,
      min: 0,
      required: true,
      default: 0
    },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDDING
    },

    shipping_address: {
      type: String,
      required: true,
      trim: true
    },

    payment_method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.COD
    },

    isPaied: {
      type: Boolean,
      default: false
    },

    is_delete: {
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
