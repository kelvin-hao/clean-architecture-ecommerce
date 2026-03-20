import { INotificationStrategy } from '~/types/interface'

export interface ISendNotification {
  recipient: string
  message: string
  holder: Record<string, string>
  subject?: string
}

abstract class NotficationTemplate {
  protected strategy: INotificationStrategy

  constructor(strategy: INotificationStrategy) {
    this.strategy = strategy
  }

  public async sendNotification(payload: ISendNotification): Promise<void> {
    const formattedMessage = this.formatMessage(payload.message, payload.holder)
    await this.dispatch(payload.recipient, formattedMessage, payload.subject)
  }

  private async dispatch(recipient: string, formattedMessage: string, subject?: string): Promise<void> {
    await this.strategy.send(recipient, formattedMessage, subject)
  }

  protected abstract formatMessage(message: string, holder: Record<string, string>): string
}

export default NotficationTemplate
