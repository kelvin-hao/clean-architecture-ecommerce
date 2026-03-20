import express from 'express'
import 'reflect-metadata'
import env from './config/env/dotenv.config'
import exitAppHook from 'async-exit-hook'
import expressApp, { initialExpressApp } from './app'
import databaseManager from './database/dbManager'
import logRoutesFromConfig from './utils/logEndpoints'
import routeConfig from './config/route.config'

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
