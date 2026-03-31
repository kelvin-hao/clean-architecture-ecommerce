import { NextFunction, Request, Response } from 'express'
import { redisProvider } from '~/database'
import jsonWebToken from '~/helper/jwt'
import { GoneError, UnauthorizedError } from '~/helper/response/errorResponse'

async function isAuth(req: Request, _: Response, next: NextFunction) {
  try {
    const authHeader = req.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedError('Not authenticated')

    const accessToken = authHeader.split(' ')[1]

    const redisClient = await redisProvider()
    const blacklisted = await redisClient.get(`blacklist:${accessToken}`)

    if (blacklisted) throw new UnauthorizedError('Token revoked')

    const decodedToken = jsonWebToken.verifyAccessToken(accessToken)
    if (!decodedToken || !decodedToken.id || !decodedToken.sessionId) {
      throw new UnauthorizedError('Invalid token payload.')
    }

    const sessionKey = `session:${decodedToken.id}:${decodedToken.sessionId}`
    const sessionExists = await redisClient.exists(sessionKey)

    if (!sessionExists) {
      throw new UnauthorizedError('Session has expired or been logged out.')
    }

    req.user = decodedToken
    return next()
  } catch (error) {
    const err = error as Error

    if (err?.message?.includes('jwt expired')) {
      return next(new GoneError('Token expired'))
    }

    if (error instanceof UnauthorizedError) {
      return next(error)
    }

    return next(new UnauthorizedError(err.message || 'Not authenticated'))
  }
}

export default isAuth
