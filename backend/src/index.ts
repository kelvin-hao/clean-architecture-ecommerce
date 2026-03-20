import express from 'express'
import 'reflect-metadata'
import env from './config/env/dotenv.config'
import exitAppHook from 'async-exit-hook'
import expressApp from './app'
import { initializeDatabase } from './database'
import databaseManager from './database/dbManager'
import { configureContainer } from './helper/injection/injectionConfig'
import { containerInjection } from './helper/injection/injectionManager'
import logRoutesFromConfig from './utils/logEndpoints'
import routeConfig from './config/route.config'
import configCloudinary from './config/cloudinary.config'
import { initializeScheduler } from './helper/cron'
import { initializeBackgroundJob } from './helper/jobs'

const bootstrapServer = async () => {
  await initializeDatabase()

  configCloudinary()

  initializeScheduler()
  await initializeBackgroundJob()

  const container = configureContainer()
  containerInjection.setContainer(container)

  const app = express()

  await expressApp(app)

  logRoutesFromConfig(routeConfig)
  exitAppHook(async (callback) => {
    console.log('\nGracefully shutting down...')
    await databaseManager.closeAllConnections()
    callback()
  })

  app.listen(8080, () => {
    console.log(`🚀 Server is running on port ${env.PORT}.`)
  })
}

bootstrapServer().catch((error) => {
  console.error('FATAL ERROR: Failed to bootstrap the server:')
  console.error(error)
  process.exit(1)
})
