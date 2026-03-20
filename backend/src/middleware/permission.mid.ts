import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '~/helper/response/errorResponse'

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) return next(new UnauthorizedError())

    const permissionSet = new Set(user.permissions)

    if (!user || !permissionSet.has(permission)) {
      return next(new ForbiddenError())
    }

    next()
  }
}
