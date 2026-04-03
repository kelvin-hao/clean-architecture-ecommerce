import { NextFunction, Request, Response } from 'express'
import { redisProvider } from '~/database'
import { InternalServerError, TooManyRequest } from '~/helper/response/errorResponse'

/**
 * Configuration options for the rate limiter middleware.
 */
export interface RateLimiterOptions {
  windowInSeconds: number
  maxRequests: number
}

/**
 * Factory function to create a rate limiter middleware.
 * @param redisClient - An active Redis client instance (Dependency Injection).
 * @param options - Configuration for the rate limit window and max requests.
 * @returns An Express middleware function.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const { windowInSeconds, maxRequests } = options

  // Return the actual middleware function
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisClient = await redisProvider()
      const clientIp = req.ip

      if (!clientIp) {
        // It's good practice to log this edge case
        console.warn('Rate limiter could not determine client IP.')
        return next(new InternalServerError('Could not identify request source.'))
      }

      // Use a Redis transaction (multi) to ensure INCR and EXPIRE are atomic.
      // This prevents a race condition where the key could be incremented but not have its expiration set.
      const pipeline = redisClient.multi()
      pipeline.incr(clientIp)
      pipeline.expire(clientIp, windowInSeconds)

      const results = await pipeline.exec()

      // The result of INCR is the first item in the results array
      const requestCount = results?.[0] as unknown as number

      if (requestCount > maxRequests) {
        return next(new TooManyRequest())
      }

      next()
    } catch (error) {
      // If Redis fails, we should log the error and let the request through
      // or send an error, depending on the desired behavior.
      console.error('Rate limiter failed:', error)
      // Failsafe: Let the request proceed if Redis is down.
      // For stricter security, you could instead call:
      // next(new InternalServerError('Rate limiter service is unavailable.'));
      next()
    }
  }
}

// A general, lenient rate limiter for most of your API
export const generalApiLimiter = createRateLimiter({
  windowInSeconds: 60, // 1 minute
  maxRequests: 100 // 100 requests per minute
})

// A very strict rate limiter for sensitive endpoints like login or password reset
export const strictAuthLimiter = createRateLimiter({
  windowInSeconds: 15 * 60, // 15 minutes
  maxRequests: 5 // 5 requests per 15 minutes
})
