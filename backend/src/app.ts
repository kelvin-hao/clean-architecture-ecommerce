import express, { Express } from 'express'
import helmet from 'helmet'
import { notFound } from './middleware/notFound.mid'
import { errorHandler } from './middleware/errorHandle.mid'
import morgan from 'morgan'
import createRoute from './module'
import { generalApiLimiter } from './middleware/rateLimiter.mid'
import cors from 'cors'
import { corsOptions } from './config/cors.config'
import env from './config/env/dotenv.config'
import compression from 'compression'
import { MORGAN_FORMAT } from './utils/const.util'
import { initializeDatabase } from './database'
import { initializeScheduler } from './helper/cron'
import { initializeBackgroundJob } from './helper/jobs'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import initialInjection from './helper/injection'
import initialIndices from './database/elasticsearch'
import initialConfig from './config'
import { requestContextMiddleware } from './middleware/requestContextMiddleware'
import { httpLoggerMiddleware } from './middleware/httpLoggerMiddleware '
import { errorLoggerMiddleware } from './middleware/errorLoggerMiddleware'

const expressApp = async (app: Express) => {
  const router = await createRoute()

  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'E-Commerce API',
        version: '1.0.0',
        description: 'API documentation'
      },
      servers: [
        {
          url: 'http://localhost:8080/api/v1'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./src/module/**/*.route.ts']
  }

  const swaggerSpec = swaggerJsdoc(options)

  app.use(helmet())

  app.use(
    compression({
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

  app.use(requestContextMiddleware)

  app.use(httpLoggerMiddleware)

  app.use(generalApiLimiter)

  app.use(env.API_PREFIX, router)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use(notFound)

  app.use(errorLoggerMiddleware)

  app.use(errorHandler)
}

export const initialExpressApp = async () => {
  initialConfig()

  initialInjection()

  initializeScheduler()

  // asynchronous
  await Promise.all([initializeDatabase(), initializeBackgroundJob(), initialIndices()])
}

export default expressApp
