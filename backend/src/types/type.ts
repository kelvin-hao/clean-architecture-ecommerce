import { Client } from '@elastic/elasticsearch'
import Redis from 'ioredis'
import mongoose from 'mongoose'

export type Constructor<T> = new () => T

export type MongooseType = typeof mongoose

export type ConnectionStrategyType = MongooseType | Redis | Client

export type JwtPayload = {
  id: string
  permissions: string[]
  sessionId: string
}

export type Image = {
  url: string
  alt?: string
  is_primary?: boolean
}

export type ProductAttribute = {
  name: string
  value: string
}

export type VariationOption = {
  name: string // Color
  options: [string] // ["Red", "Blue"]
}

export type VariationValue = {
  name: string
  value: string
}

// enum
export enum UserStatusEnum {
  active = 'active',
  banned = 'banned'
}

export enum ProductStatusEnum {
  DARFF = 'draft', // ban nhap
  ACTIVE = 'active', // publish and sell
  ARCHIVED = 'archived' // da het hang hoac mau cu
}

export enum ConnectionsEnum {
  REDIS = 'redis',
  MONGO = 'mongose',
  ELASTICSEARCH = 'elasticsearch'
}

export enum RequestPartEnum {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params'
}

export enum RoleTypeEnum {
  admin = 'admin',
  seller = 'seller',
  user = 'user'
}

export enum UploadSourceEnum {
  WEB = 'WEB',
  API = 'API'
}

export enum ATTRIBUTES_TYPE {
  SELECT = 'select',
  STRING = 'string',
  NUMBER = 'number'
}

export enum ORDER_STATUS {
  PENDDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMEPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PAYMENT_METHOD {
  COD = 'COD',
  SEPAY = 'SEPAY'
}

export enum VendorApplicationStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
