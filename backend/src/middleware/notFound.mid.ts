import { NextFunction, Request, Response } from 'express'
import { NotFoundError } from '~/helper/response/errorResponse'

export const notFound = (_: Request, __: Response, next: NextFunction) => {
  const error = new NotFoundError()
  next(error)
}
