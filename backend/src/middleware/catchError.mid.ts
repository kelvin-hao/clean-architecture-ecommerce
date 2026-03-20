import { NextFunction, Request, Response } from 'express'

const catchErrorHandler =
  (fn: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next)
  }

export default catchErrorHandler
