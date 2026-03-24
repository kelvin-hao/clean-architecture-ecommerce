import { IJob } from '.'
import { NotificationFactory, NotifierType } from '../notification/notificationFactory'
import { ISendNotification } from '../notification/notificationTemplate'

export class SendEmailJob implements IJob {
  async execute(payload: ISendNotification): Promise<void> {
    const emailNotification = NotificationFactory.createNotifier(NotifierType.email)
    await emailNotification.sendNotification(payload)
  }
}

// export class IndexProduct implements IJob {
//   async execute(payload: {id:string}): Promise<void> {

//   }
// }
