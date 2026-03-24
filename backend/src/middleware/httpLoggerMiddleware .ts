import { Request, Response, NextFunction } from 'express'
import { logger } from '~/config/winton.config'
import { getRequestId } from '~/utils/request-context.util'

export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const requestId = getRequestId()

  // Request log
  logger.info('HTTP request started', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  })

  res.on('finish', () => {
    const duration = Date.now() - start

    logger.info('HTTP request completed', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`
    })
  })

  next()
}
