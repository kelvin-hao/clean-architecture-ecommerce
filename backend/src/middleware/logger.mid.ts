import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import logger from '~/config/winton.config'
import { CONTEXT } from '~/utils/const.util'

const messageLog = 'INCOMING REQUEST'

export const loggerRequest = (req: Request, _: Response, next: NextFunction) => {
  const requestId = uuidv4()
  const userId = req.header('x-user-id') || 'unknown'
  const ipAddress = req.ip || 'unkown'

  // Attach request ID to request and log initial request data
  req.locals = { requestId, userId, ipAddress }
  logger.info(messageLog, {
    context: CONTEXT.REQUEST,
    requestId,
    userId,
    ipAddress,
    pathURL: req.originalUrl,
    body: req.body || 'No body'
  })
  next()
}
