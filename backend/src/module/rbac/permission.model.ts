import mongoose, { Schema } from 'mongoose'
import { IPermission } from '~/types/interface'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const PERMISSION_COLLECTION = 'permissions'

const PermissionSchema: Schema = new Schema<IPermission>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    resource: {
      type: String,
      required: true,
      trim: true
    },

    action: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: PERMISSION_COLLECTION
  }
)

const PermissionModel = mongoose.model<IPermission>(DATABASE_DOCUMENT.PERMISSION, PermissionSchema)
export default PermissionModel
