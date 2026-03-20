import { replacePlaceholder } from '~/utils'
import NotficationTemplate from './notificationTemplate'
import SMSStrategy from './smsStrategy'

export class SMSNotification extends NotficationTemplate {
  constructor() {
    super(new SMSStrategy())
  }

  protected formatMessage(message: string, holder: Record<string, string>): string {
    return replacePlaceholder(message, holder)
  }
}
