import mongoose, { Schema } from 'mongoose'
import { INotification } from '~/types/interface'
import { NotifierType } from '~/types/type'
import { DATABASE_DOCUMENT } from '~/utils/const.util'

const NOTIFICATION_COLLECTION = 'notifications'

const notificationSchema = new Schema<INotification>(
  {
    type: {
      Type: String,
      enum: NotifierType,
      default: NotifierType.IN_APP
    },

    title: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    },

    data: {
      Type: Object,
      default: {}
    }
  },
  { timestamps: true, collection: NOTIFICATION_COLLECTION }
)

const notificationModel = mongoose.model<INotification>(DATABASE_DOCUMENT.NOTIFICATION, notificationSchema)

export default notificationModel
