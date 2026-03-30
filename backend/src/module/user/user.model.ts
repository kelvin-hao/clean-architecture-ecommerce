import mongoose, { Document, Schema, Types } from 'mongoose'
import { Image, UserStatusEnum } from '~/types/type'
import { DATABASE_DOCUMENT, DEFAULT_AVATAR } from '~/utils/const.util'

const USER_COLLECTION = 'users'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  roles: string[]
  permissions: string[]
  password: string
  name: string
  is_delete: boolean
  status: UserStatusEnum
  avatar: Image
  two_FA: boolean
  two_FA_secret: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    roles: [
      {
        type: String
      }
    ],

    permissions: [
      {
        type: String,
        trim: true
      }
    ],

    status: {
      type: String,
      default: UserStatusEnum.active
    },

    two_FA: {
      type: Boolean,
      default: false
    },

    two_FA_secret: {
      type: String,
      select: false,
      default: null
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      select: false
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    avatar: {
      url: {
        type: String,
        trim: true,
        default: DEFAULT_AVATAR
      },
      alt: String
    },

    is_delete: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true,
    collection: USER_COLLECTION
  }
)

const UserModel = mongoose.model<IUser>(DATABASE_DOCUMENT.USER, UserSchema)
export default UserModel
