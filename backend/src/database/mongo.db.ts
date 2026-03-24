import mongoose from 'mongoose'
import env from '~/config/env/dotenv.config'
import { InternalServerError } from '~/helper/response/errorResponse'
import { IConnectionStrategy } from '~/types/interface'
import { MongooseType } from '~/types/type'

export class MongooseConnection implements IConnectionStrategy<MongooseType> {
  private readonly uri: string

  constructor() {
    this.uri = env.MONGO_URI
  }

  async connect(): Promise<MongooseType> {
    try {
      if (env.BUILD_MODE !== 'production') {
        mongoose.set('debug', true)
        mongoose.set('debug', { color: true })
      }
      await mongoose.connect(this.uri, {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
        minPoolSize: 2,
        maxPoolSize: 10
      })
      console.log(`Connected to the database: ${mongoose.connection.name}`)
      return mongoose
    } catch (error) {
      console.error('Failed to connect to the database mongo:', error)
      throw new InternalServerError('Database connection failed')
    }
  }

  async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log('Disconnected from the mongo database')
    }
  }
}
