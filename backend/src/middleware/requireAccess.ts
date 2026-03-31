import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '~/helper/response/errorResponse'
import { PolicyFn } from '~/utils/policy.utils'

function matchPermission(userPerms: string[] = [], required: string) {
  return userPerms.includes(required)
}

export const requireAccess = (config: { permissions?: string[]; policies?: PolicyFn[] }) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) return next(new UnauthorizedError('Not authenticated'))

      if (config.permissions?.length) {
        const hasPermission = config.permissions.some((permission) =>
          matchPermission(user.permissions ?? [], permission)
        )

        if (!hasPermission) {
          return next(new ForbiddenError('You do not have permission to access this resource'))
        }
      }

      if (config.policies?.length) {
        const results = await Promise.all(
          config.policies.map((policy) =>
            policy({
              user,
              resource: req.resource
            })
          )
        )

        if (!results.some(Boolean)) {
          return next(new ForbiddenError('Access denied by policy'))
        }
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }
}
