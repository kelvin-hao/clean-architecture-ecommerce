import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { runWithRequestContext } from '~/utils/request-context.util'

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id']?.toString() || uuidv4()

  runWithRequestContext(requestId, () => {
    res.setHeader('x-request-id', requestId)
    next()
  })
}
