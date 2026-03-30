import mongoose, { Schema } from 'mongoose'
import { IRole } from '~/types/interface'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const ROLE_COLLECTION = 'roles'

const RoleSchema: Schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    description: {
      type: String
    },
    permissions: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true,
    collection: ROLE_COLLECTION
  }
)

const RoleModel = mongoose.model<IRole>(DATABASE_DOCUMENT.ROLE, RoleSchema)
export default RoleModel
