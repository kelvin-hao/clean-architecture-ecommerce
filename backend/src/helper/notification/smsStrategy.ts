import { env } from 'process'
import { Twilio } from 'twilio'
import { INotificationStrategy } from '~/types/interface'
import { BadRequest } from '../response/errorResponse'

class SMSStrategy implements INotificationStrategy {
  private twilioClient: Twilio

  constructor() {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
      throw new BadRequest('Twilio environment variables are not fully configured.')
    }

    this.twilioClient = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
  }

  async send(recipient: string, formattedMessage: string) {
    try {
      const message = await this.twilioClient.messages.create({
        to: recipient,
        from: env.TWILIO_PHONE_NUMBER,
        body: formattedMessage
      })

      console.log(`SMS sent successfully! SID: ${message.sid}`)
    } catch (error) {
      console.error(`Failed to send SMS to ${recipient}:`, error)
      throw new BadRequest('Failed to send SMS.')
    }
  }
}

export default SMSStrategy
