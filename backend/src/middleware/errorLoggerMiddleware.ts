import { NextFunction, Request, Response } from 'express'
import { logger } from '~/config/winton.config'
import { getRequestId } from '~/utils/request-context.util'

export const errorLoggerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('HTTP request failed', err, {
    requestId: getRequestId(),
    method: req.method,
    url: req.originalUrl
  })

  next(err)
}
