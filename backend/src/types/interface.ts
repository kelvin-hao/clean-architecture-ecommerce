import { estypes } from '@elastic/elasticsearch'
import { Document, Types } from 'mongoose'
import { DISCOUNT_APPLY_TO, DISCOUNT_TYPE, NotifierType } from './type'

export interface IConnectionStrategy<T> {
  connect(): Promise<T>
  disconnect(): Promise<void>
}

export interface INotificationStrategy {
  send(recipient: string, message: string, subject?: string): Promise<void>
}

// mongo schema
export interface IPermission extends Document {
  _id: Types.ObjectId
  key: string
  resource: string
  action: string
}

export interface IRole extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  permissions: string[]
}

export interface IndexConfig {
  name: string
  settings?: estypes.IndicesIndexSettings
  mappings: estypes.MappingTypeMapping
}

export interface NotificationData {
  orderId?: string
  productId?: string
  url?: string
  metaData?: Record<string, string>
}

export interface INotification extends Document {
  _id: Types.ObjectId
  type: NotifierType
  title: string
  body: string
  data: NotificationData
}

export interface IUserNotification extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  notificationId: Types.ObjectId
  is_read: boolean
  is_delete: boolean
  snapshot: {
    title: string
    body: string
  }
}

export interface IDiscount extends Document {
  vendor: Types.ObjectId
  name: string
  description: string
  type: DISCOUNT_TYPE
  value: number
  code: string
  max_uses: number
  apply_to: DISCOUNT_APPLY_TO
  max_uses_per_user: number
  used_count: number
  max_discount_value?: number
  product_ids: Types.ObjectId[]
  category_ids: Types.ObjectId[]
  user_usage?: Array<{
    user_id: Types.ObjectId
    used_count: number
  }>
  start_date: Date
  end_date: Date
  min_order_value: number
  uses_count: number
  is_active: boolean
}
