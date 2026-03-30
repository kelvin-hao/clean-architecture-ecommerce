import { NotifierType } from '~/types/type'
import { IJob } from '.'
import { NotificationFactory } from '../notification/notificationFactory'
import { ISendNotification } from '../notification/notificationTemplate'

export class SendEmailJob implements IJob {
  async execute(payload: ISendNotification): Promise<void> {
    const emailNotification = NotificationFactory.createNotifier(NotifierType.EMAIL)
    await emailNotification.sendNotification(payload)
  }
}

// export class IndexProduct implements IJob {
//   async execute(payload: {id:string}): Promise<void> {

//   }
// }
