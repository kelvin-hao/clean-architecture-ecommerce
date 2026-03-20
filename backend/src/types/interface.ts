import { Document, Types } from 'mongoose'

export interface IConnectionStrategy<T> {
  connect(): Promise<T>
  disconnect(): Promise<void>
}

export interface INotificationStrategy {
  send(recipient: string, message: string, subject?: string): Promise<void>
}

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
  permissions: Types.ObjectId[]
}
