import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { getRequestId } from '~/utils/request-context.util'

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
  private readonly isProduction = process.env.NODE_ENV === 'production'

  constructor(config: LoggerConfig = {}) {
    const {
      logLevel = this.isProduction ? 'info' : 'debug',
      logDirectory = 'logs',
      serviceName = 'ecommerce-service'
    } = config

    this.winstonLogger = createLogger({
      level: logLevel,
      format: this.buildFormat(serviceName),
      transports: this.buildTransports(logDirectory),
      defaultMeta: {
        service: serviceName,
        env: process.env.NODE_ENV || 'development'
      },
      exitOnError: false
    })
  }

  private buildFormat(_: string) {
    if (this.isProduction) {
      return format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format((info) => {
          return info
        })(),
        format.json()
      )
    }

    // DEV FORMAT (readable)
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

  private buildTransports(logDirectory: string) {
    const transportList = []

    if (!this.isProduction) {
      transportList.push(new transports.Console())
    }

    // File rotation
    const createDailyRotateFile = (level: 'info' | 'error') =>
      new DailyRotateFile({
        level,
        dirname: logDirectory,
        filename: `%DATE%.${level}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })

    transportList.push(createDailyRotateFile('info'))
    transportList.push(createDailyRotateFile('error'))

    return transportList
  }

  public info(message: string, meta?: LogData): void {
    this.winstonLogger.info(message, meta)
  }

  public warn(message: string, meta?: LogData): void {
    this.winstonLogger.warn(message, meta)
  }

  public error(message: string, error?: unknown, meta?: LogData): void {
    let errorMeta = {}

    if (error instanceof Error) {
      errorMeta = {
        errorMessage: error.message,
        errorName: error.name,
        stack: error.stack
      }
    } else {
      errorMeta = { error }
    }

    this.winstonLogger.error(message, {
      ...meta,
      ...errorMeta
    })
  }
}

export const logger = new Logger()

export default Logger
