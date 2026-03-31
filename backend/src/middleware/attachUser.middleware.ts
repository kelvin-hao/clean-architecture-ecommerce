import { NextFunction, Request, Response } from 'express'
import { NotFoundError, UnauthorizedError } from '~/helper/response/errorResponse'
import UserModel from '~/module/user/user.model'

async function attachUser(req: Request, _: Response, next: NextFunction) {
  try {
    const targetUserId = req.params.id || req.user?.id

    if (!targetUserId) {
      return next(new UnauthorizedError('Not authenticated'))
    }

    const target = await UserModel.findOne({ _id: targetUserId, is_delete: false }).select('_id').lean().exec()

    if (!target) {
      return next(new NotFoundError('User not found'))
    }

    req.resource = { id: target._id.toString() }
    return next()
  } catch (error) {
    return next(error)
  }
}

export default attachUser
