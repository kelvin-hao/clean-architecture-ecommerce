import { NotifierType } from '~/types/type'
import { BadRequestError } from '../response/errorResponse'
import EmailNotification from './emailNotification'
import NotficationTemplate from './notificationTemplate'
import { SMSNotification } from './smsNotification'

export class NotificationFactory {
  /**
   * Creates an instance of a notification service based on the specified type.
   * @param type The type of notifier to create ('email' or 'sms').
   * @returns An instance of a class that extends NotificationService.
   */
  public static createNotifier(type: NotifierType): NotficationTemplate {
    switch (type) {
      case NotifierType.EMAIL:
        return new EmailNotification()

      case NotifierType.SMS:
        return new SMSNotification()

      default:
        throw new BadRequestError(`Invalid notifier type specified: ${type}`)
    }
  }
}
