import Redis from 'ioredis'
import env from '~/config/env/dotenv.config'
import { logger } from '~/config/winton.config'
import { InternalServerError } from '~/helper/response/errorResponse'
import { IConnectionStrategy } from '~/types/interface'

const STATUS_REDIS = {
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error'
}

export class RedisConnection implements IConnectionStrategy<Redis> {
  private client: Redis

  constructor() {
    this.client = new Redis(env.REDIS_URI, {
      retryStrategy: (retries) => Math.min(retries * 100, 3000),
      maxRetriesPerRequest: null
    })

    this.setupEventHandler()
  }

  async connect(): Promise<Redis> {
    try {
      await this.client.ping()
      return this.client
    } catch (err: unknown) {
      logger.error('Failed to connect to Redis:', err)
      throw new InternalServerError('Failed to connect to the Redis database')
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit()
    }
  }

  private setupEventHandler(): void {
    if (!this.client) return

    this.client.on(STATUS_REDIS.CONNECT, () => {
      logger.info('Redis connection status: connected')
    })

    this.client.on(STATUS_REDIS.END, () => {
      logger.info('Redis connection status: ended')
    })

    this.client.on(STATUS_REDIS.ERROR, (err: Error) => {
      logger.error('Redis connection status: error', err)
    })

    this.client.on(STATUS_REDIS.RECONNECT, () => {
      logger.info('Redis connection status: reconnecting')
    })
  }
}
