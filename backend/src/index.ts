import express from 'express'
import 'reflect-metadata'
import env from './config/env/dotenv.config'
import exitAppHook from 'async-exit-hook'
import expressApp, { initialExpressApp } from './app'
import databaseManager from './database/dbManager'
import logRoutesFromConfig from './utils/logEndpoints.util'
import routeConfig from './config/route.config'
import { logger } from './config/winton.config'

const bootstrapServer = async () => {
  // something need to run befor server
  await initialExpressApp()
  // run  server
  const app = express()
  await expressApp(app)

  // Show route config in terminal
  logRoutesFromConfig(routeConfig)
  // Gracefully shutting down
  exitAppHook(async (callback) => {
    await databaseManager.closeAllConnections()
    callback()
  })

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server is running on port ${env.PORT}.`)
  })
}

bootstrapServer().catch((error) => {
  logger.error('FATAL ERROR: Failed to bootstrap the server:')
  logger.error(error)
  process.exit(1)
})
