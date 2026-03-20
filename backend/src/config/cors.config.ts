// File: ~/config/cors.config.ts

import { CorsOptions } from 'cors'
import env from './env/dotenv.config'
import { ForbiddenError } from '~/helper/response/errorResponse'

/**
 * Loads and parses the whitelisted origins from environment variables.
 * @returns {string[]} An array of allowed origins.
 */
function getWhitelistedOrigins(): string[] {
  const origins = env.CORS_ALLOWED_ORIGINS
  if (!origins) {
    // In development, you might want a lenient default, but in production, it's safer to have an empty list.
    if (env.BUILD_MODE !== 'production') {
      console.warn('CORS_ALLOWED_ORIGINS is not set. Requests may be blocked.')
    }
    return []
  }
  return origins.split(',').map((origin) => origin.trim())
}

const WHITELISTED_ORIGINS = getWhitelistedOrigins()

/**
 * Professional CORS configuration options.
 */
export const corsOptions: CorsOptions = {
  /**
   * The origin function determines which origins are allowed to access the server.
   */
  origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like Postman or server-to-server) in non-production environments.
    if (!requestOrigin && env.BUILD_MODE !== 'production') {
      return callback(null, true)
    }

    // If the origin is in our whitelist, allow it.
    if (requestOrigin && WHITELISTED_ORIGINS.includes(requestOrigin)) {
      return callback(null, true)
    }

    // Otherwise, disallow the request.
    const error = new ForbiddenError('This origin is not allowed by CORS policy.')
    return callback(error)
  },

  // Standard options for most APIs
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    // Standard and essential
    'Content-Type',
    'Authorization',
    'Accept',

    // For logging and tracing
    'User-Agent',
    'X-Request-ID',
    'X-Trace-Id',
    'x-user-id'
  ],
  optionsSuccessStatus: 200 // For legacy browser support
}
