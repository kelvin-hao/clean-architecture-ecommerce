import { NextFunction, Request, Response } from 'express'
import { ErrorResponseBase } from '~/helper/response'
import { StatusReasons } from '~/helper/response/statusReason'

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  const statusCode = err instanceof ErrorResponseBase ? err.status : 500
  const message = err.message || StatusReasons.INTERNAL_SERVER_ERROR

  const responseData: {
    status: number
    message: string
    path?: string
  } = {
    status: statusCode,
    message
  }

  res.status(statusCode).json(responseData)
}
