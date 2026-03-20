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
import { MORGAN_FORMAT } from './utils/const.util'
import { initializeDatabase } from './database'
import configCloudinary from './config/cloudinary.config'
import { initializeScheduler } from './helper/cron'
import { initializeBackgroundJob } from './helper/jobs'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { configureContainer } from './helper/injection/injectionConfig'
import { containerInjection } from './helper/injection/injectionManager'

const expressApp = async (app: Express) => {
  const a = 10
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
    apis: ['./docs/*.yaml']
  }
  const swaggerSpec = swaggerJsdoc(options)

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

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use(notFound)

  app.use(errorHandler)
}

export const initialExpressApp = async () => {
  await initializeDatabase()

  const container = configureContainer()
  containerInjection.setContainer(container)

  configCloudinary()
  initializeScheduler()

  await initializeBackgroundJob()
}

export default expressApp
