import { INotificationStrategy } from '~/types/interface'
import { createTransport, Transporter } from 'nodemailer'
import env from '~/config/env/dotenv.config'
import { BadRequest } from '../response/errorResponse'

class EmailStrategy implements INotificationStrategy {
  private transporter: Transporter
  constructor() {
    this.transporter = createTransport({
      host: env.MAIL_HOST,
      port: Number(env.MAIL_PORT),
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
      }
    })

    // Verify the connection configuration on startup
    this.transporter.verify((error, _) => {
      if (error) {
        throw new BadRequest('Email transporter verification failed')
      }
    })
  }

  async send(recipient: string, formattedMessage: string, subject: string) {
    const mailOptions = {
      from: env.MAIL_FROM,
      to: recipient,
      subject,
      html: formattedMessage
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`)
    } catch (_) {
      throw new BadRequest('Failed to send email.')
    }
  }
}

export default EmailStrategy
