import { replacePlaceholder } from '~/utils'
import EmailStrategy from './emailStrategy'
import NotficationTemplate from './notificationTemplate'

class EmailNotification extends NotficationTemplate {
  constructor() {
    super(new EmailStrategy())
  }
  protected formatMessage(message: string, holder: Record<string, string>): string {
    return replacePlaceholder(message, holder)
  }
}
export default EmailNotification
