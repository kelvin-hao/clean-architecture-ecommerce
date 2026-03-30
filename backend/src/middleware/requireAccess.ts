import { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError } from '~/helper/response/errorResponse'
import { PolicyFn } from '~/utils/policy.utils'

function matchPermission(userPerms: string[], required: string) {
  return userPerms.some((p) => {
    if (p === required) return true
  })
}

export const requireAccess = (config: { permissions?: string[]; policies?: PolicyFn[] }) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user
    if (!user) return next(new UnauthorizedError())

    // RBAC
    if (config.permissions?.length) {
      const hasPermission = config.permissions.some((p) => matchPermission(user.permissions, p))

      if (!hasPermission) {
        return next(new ForbiddenError())
      }
    }

    // ABAC (policy check)
    if (config.policies?.length) {
      const results = await Promise.all(
        config.policies.map((policy) =>
          policy({
            user,
            resource: req.resource
          })
        )
      )

      // allow if ANY policy passes
      if (!results.some(Boolean)) {
        return next(new ForbiddenError())
      }
    }

    return next(new ForbiddenError())
  }
}
