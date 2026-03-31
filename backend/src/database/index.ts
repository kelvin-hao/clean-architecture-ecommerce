import { Client } from '@elastic/elasticsearch'
import Redis from 'ioredis'
import env from '~/config/env/dotenv.config'
import { ConnectionsEnum, MongooseType } from '~/types/type'
import { MongooseConnection } from './mongo.db'
import { RedisConnection } from './redis.db'
import databaseManager from '~/database/dbManager'
import { InternalServerError } from '~/helper/response/errorResponse'
import { ElasticsearchConnection } from './elasticsearch/elastic.db'

export const initializeDatabase = async () => {
  databaseManager.register(ConnectionsEnum.MONGO, new MongooseConnection())
  databaseManager.register(ConnectionsEnum.REDIS, new RedisConnection())

  if (env.ES_NODE) {
    databaseManager.register(ConnectionsEnum.ELASTICSEARCH, new ElasticsearchConnection())
  }

  try {
    const connections: Array<Promise<unknown>> = [
      databaseManager.getConnection<MongooseType>(ConnectionsEnum.MONGO),
      databaseManager.getConnection<Redis>(ConnectionsEnum.REDIS)
    ]

    if (env.ES_NODE) {
      connections.push(databaseManager.getConnection<Client>(ConnectionsEnum.ELASTICSEARCH))
    }

    await Promise.all(connections)
  } catch (_) {
    throw new InternalServerError('Databases connection failed')
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

export async function elasticSearchProvider(): Promise<Client> {
  const elasticSearch = await databaseManager.getConnection<Client>(ConnectionsEnum.ELASTICSEARCH)
  return elasticSearch
}
