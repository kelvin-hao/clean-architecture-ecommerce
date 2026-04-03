import { createLogger, format, Logger as WinstonLogger } from 'winston'
import LokiTransport from 'winston-loki'
import { getRequestId } from '~/utils/request-context.util'
import env from './env/dotenv.config'

interface LoggerConfig {
  logLevel?: 'info' | 'warn' | 'error' | 'debug'
  logDirectory?: string
  serviceName?: string
}

export interface LogData {
  context?: string
  userId?: string
  orderId?: string
  [key: string]: unknown
}

class Logger {
  private readonly winstonLogger: WinstonLogger
  private readonly isProduction = env.BUILD_MODE === 'production'

  constructor(config: LoggerConfig = {}) {
    const { logLevel = this.isProduction ? 'info' : 'debug', serviceName = 'ecommerce-server' } = config

    const transportsList = [
      new LokiTransport({
        host: 'http://localhost:3100',
        labels: {
          service: serviceName,
          env: process.env.NODE_ENV || 'development'
        },
        format: format.combine(format.timestamp(), format.json()),
        onConnectionError: (err) => {
          console.error('Loki connection error:', err)
        }
      })
    ]

    this.winstonLogger = createLogger({
      level: logLevel,
      format: this.buildFormat(serviceName),
      transports: transportsList,
      defaultMeta: {
        service: serviceName
      },
      exitOnError: false
    })
  }

  private buildFormat(_: string) {
    if (this.isProduction) {
      return format.combine(
        format.timestamp(),
        format.colorize(),
        format.errors({ stack: true }),
        format((info) => {
          return info
        })(),
        format.json()
      )
    }

    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.printf(({ level, message, timestamp, stack, ...meta }) => {
        const requestId = getRequestId()

        return `
${timestamp} [${level}]
requestId=${requestId}
message=${message}
meta=${JSON.stringify(meta, null, 2)}
${stack ? `stack=${stack}` : ''}
`
      })
    )
  }

  public info(message: string, meta?: LogData): void {
    this.winstonLogger.info(message, meta)
  }

  public warn(message: string, meta?: LogData): void {
    this.winstonLogger.warn(message, meta)
  }

  public error(message: string, error?: unknown, meta: LogData = {}): void {
    const errorMeta =
      error instanceof Error
        ? {
            errorMessage: error.message,
            errorName: error.name,
            stack: error.stack
          }
        : { error }

    this.winstonLogger.error(message, {
      ...meta,
      ...errorMeta
    })
  }
}

export const logger = new Logger()
