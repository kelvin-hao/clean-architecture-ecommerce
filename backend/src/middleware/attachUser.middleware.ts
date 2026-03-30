import { NextFunction, Request, Response } from 'express'
import UserModel from '~/module/user/user.model'

async function attachUser(req: Request, res: Response, next: NextFunction) {
  const target = await UserModel.findById(req.params.id)

  if (!target) {
    return res.status(404).json({ message: 'User not found' })
  }

  req.resource = { id: target._id.toString() }
  next()
}
export default attachUser
