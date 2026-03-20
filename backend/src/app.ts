import express, { Express } from 'express'
import helmet from 'helmet'
import { notFound } from './middleware/notFound.mid'
import { errorHandler } from './middleware/errorHandle.mid'
import { loggerRequest } from './middleware/logger.mid'
import morgan from 'morgan'
import createRoute from './module'
import { generalApiLimiter } from './middleware/rateLimiter.mid'
import cors from 'cors'
import { corsOptions } from './config/cors.config'
import env from './config/env/dotenv.config'
import compression from 'compression'

const MORGAN_FORMAT = 'dev'

const expressApp = async (app: Express) => {
  const router = await createRoute()

  app.use(helmet())

  app.use(
    compression({
      // just compress when response is big
      threshold: 1024 // 1kb
    })
  )

  app.use(express.json())

  app.use(
    express.urlencoded({
      extended: true
    })
  )
  app.use(cors(corsOptions))

  app.use(morgan(MORGAN_FORMAT))

  app.use(loggerRequest)

  app.use(generalApiLimiter)

  app.use(env.API_PREFIX, router)

  app.use(notFound)

  app.use(errorHandler)
}

export default expressApp
