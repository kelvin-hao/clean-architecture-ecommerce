import { BadRequestError } from '../response/errorResponse'
import EmailNotification from './emailNotification'
import NotficationTemplate from './notificationTemplate'
import { SMSNotification } from './smsNotification'

export enum NotifierType {
  email,
  sms
}

export class NotificationFactory {
  /**
   * Creates an instance of a notification service based on the specified type.
   * @param type The type of notifier to create ('email' or 'sms').
   * @returns An instance of a class that extends NotificationService.
   */
  public static createNotifier(type: NotifierType): NotficationTemplate {
    switch (type) {
      case NotifierType.email:
        return new EmailNotification()

      case NotifierType.sms:
        return new SMSNotification()

      default:
        throw new BadRequestError(`Invalid notifier type specified: ${type}`)
    }
  }
}
