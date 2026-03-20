import mongoose, { Schema } from 'mongoose'
import { IPermission, IRole } from '~/types/interface'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const ROLE_COLLECTION = 'roles'

export interface IRoleWithPermissions extends Omit<IRole, 'permissions'> {
  permissions: IPermission[]
}

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
        type: Schema.Types.ObjectId,
        ref: DATABASE_DOCUMENT.PERMISSION
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
