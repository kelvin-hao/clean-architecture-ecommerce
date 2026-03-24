import { NextFunction, Request, Response } from 'express'
import { env } from 'process'
import logger from '~/config/winton.config'
import { CONTEXT } from '~/utils/const.util'
import { formatStackTrace, FormattedError } from '~/utils/formatStack.util'
import { ErrorResponseBase } from '~/helper/response'
import { StatusReasons } from '~/helper/response/statusReason'

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  const statusCode = err instanceof ErrorResponseBase ? err.status : 500
  const message = err.message || StatusReasons.INTERNAL_SERVER_ERROR
  const stack = !err.stack ? null : err.stack

  const responseData: {
    status: number
    message: string
    path?: string
    stack?: FormattedError | null
  } = {
    status: statusCode,
    message,
    path: req.originalUrl,
    stack: formatStackTrace(stack)
  }

  logger.error(message, err, {
    context: CONTEXT.ERROR,
    statusCode,
    requestID: req.locals.requestID,
    pathURL: req.originalUrl,
    userId: req.user?.id,
    ipAddress: req.locals.ipAddress,
    body: req.body
  })

  if (env.BUILD_MODE !== 'dev') {
    responseData.path = undefined
    responseData.stack = undefined
  }

  res.status(statusCode).json(responseData)
}
