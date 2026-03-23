// File: ~/services/logger.service.ts

import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import 'winston-daily-rotate-file'
import { formatStackTrace } from '~/utils/formatStack'
// import { hideSensitiveFields } from '~/utils/hideSensitiveFields'

/**
 * Optional configuration for the Logger instance.
 */
interface LoggerConfig {
  logLevel?: 'info' | 'warn' | 'error' | 'debug'
  logDirectory?: string
}

/**
 * Metadata object for enriching log entries.
 */
export interface LogData {
  context?: string // The service or module where the log originates
  requestID?: string // A unique ID to trace a request through the system
  [key: string]: unknown // Allow any other arbitrary metadata
}

class Logger {
  private readonly winstonLogger: WinstonLogger
  private readonly isProduction = process.env.NODE_ENV === 'production'

  constructor(config: LoggerConfig = {}) {
    const { logLevel = this.isProduction ? 'info' : 'debug', logDirectory = 'src/logs' } = config

    this.winstonLogger = createLogger({
      level: logLevel,
      format: this.buildLogFormat(),
      transports: this.buildTransports(logDirectory),
      exitOnError: false // Do not exit on handled exceptions
    })
  }

  /**
   * Creates the log format, using JSON for production and a readable console format for development.
   */
  private buildLogFormat() {
    // In development, use a colorful, more readable format.

    const textFormat = format.printf(({ level, timestamp, context, requestID, stack, ...meta }) => {
      const contextStr = context ? `[${context}]` : ''
      const requestIDStr = requestID ? `[${requestID}]` : ''
      const metaStr = Object.keys(meta).length ? `\n${JSON.stringify}` : ''
      const stackStr = stack ? `\n${JSON.stringify(formatStackTrace(stack as string), null, 2)}` : '' // Format stack trace for readability

      return `${timestamp} - ${level} - ${contextStr} - ${requestIDStr} \n${metaStr}
      \n${stackStr}`
    })

    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      textFormat
    )
  }

  /**
   * Creates the transports (destinations) for the logs.
   */
  private buildTransports(logDirectory: string) {
    // A helper to create daily rotate files to avoid duplication
    const createDailyRotateFile = (level: 'info' | 'error') =>
      new transports.DailyRotateFile({
        level,
        dirname: logDirectory,
        filename: `%DATE%.${level}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true, // Compress old log files
        maxSize: '20m',
        maxFiles: '14d' // Keep logs for 14 days
      })

    // new transports.Console()
    const transportList = [createDailyRotateFile('info'), createDailyRotateFile('error')]

    return transportList
  }

  /**
   * Logs an informational message.
   */
  public info(message: string, meta?: LogData): void {
    this.winstonLogger.info(message, meta)
  }

  /**
   * Logs an error message. It's best practice to pass an Error object.
   */
  public error(message: string, error?: Error, meta?: LogData): void {
    const logMeta = { ...meta, stack: error?.stack }
    this.winstonLogger.error(message, logMeta)
  }
}

// Export a default singleton instance for easy use across the application
const logger = new Logger()
export default logger
