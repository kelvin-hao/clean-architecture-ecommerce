import Redis from 'ioredis'
import { ConnectionsEnum, MongooseType } from '~/types/type'
import { MongooseConnection } from './mongo.db'
import { RedisConnection } from './redis.db'
import databaseManager from '~/database/dbManager'
import { InternalServerError } from '~/helper/response/errorResponse'

export const initializeDatabase = async () => {
  databaseManager.register(ConnectionsEnum.MONGO, new MongooseConnection())
  databaseManager.register(ConnectionsEnum.REDIS, new RedisConnection())

  try {
    await Promise.all([
      databaseManager.getConnection<MongooseType>(ConnectionsEnum.MONGO),
      databaseManager.getConnection<Redis>(ConnectionsEnum.REDIS)
    ])
  } catch (_) {
    throw new InternalServerError('Database connection failed')
  }
}

/**
 * An async provider function that acts as a bridge to the DatabaseManager.
 * Inversify will call this function to resolve the RedisClient dependency.
 */
export async function redisProvider(): Promise<Redis> {
  const redisClient = await databaseManager.getConnection<Redis>(ConnectionsEnum.REDIS)
  return redisClient
}
