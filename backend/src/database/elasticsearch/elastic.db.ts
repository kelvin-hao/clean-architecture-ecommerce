import { Client } from '@elastic/elasticsearch'
import env from '~/config/env/dotenv.config'
import { logger } from '~/config/winton.config'
import { InternalServerError } from '~/helper/response/errorResponse'
import { IConnectionStrategy } from '~/types/interface'

export class ElasticsearchConnection implements IConnectionStrategy<Client> {
  private client: Client

  private createClient(): Client {
    return new Client({
      node: env.ES_NODE,
      auth: {
        username: env.ES_USERNAME,
        password: env.ES_PWD
      },
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: false
    })
  }

  async connect(): Promise<Client> {
    if (this.client) return this.client

    this.client = this.createClient()

    try {
      await this.client.ping()
      logger.info('Elasticsearch connection status: connected')

      return this.client
    } catch (err: unknown) {
      logger.error('Failed to connect to Elasticsearch:', err)
      throw new InternalServerError('Failed to connect to the Elasticsearch engine')
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      logger.info('Elasticsearch disconnected')
    }
  }
}
