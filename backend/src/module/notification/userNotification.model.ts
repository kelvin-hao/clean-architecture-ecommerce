import mongoose, { Schema } from 'mongoose'
import { IUserNotification } from '~/types/interface'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const USER_NOTFICATION_COLLECTION = 'userNotifications'

const userNotificationSchema = new Schema<IUserNotification>(
  {},
  {
    timestamps: true,
    collection: USER_NOTFICATION_COLLECTION
  }
)

const userNotificationMdel = mongoose.model<IUserNotification>(
  DATABASE_DOCUMENT.USER_NOTIFICATION,
  userNotificationSchema
)

export default userNotificationMdel
