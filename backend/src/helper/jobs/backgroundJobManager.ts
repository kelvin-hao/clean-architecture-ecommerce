import env from '~/config/env/dotenv.config'
import { elasticSearchProvider } from '~/database'
import { productIndex } from '~/database/elasticsearch/product.index'
import { NotifierType } from '~/types/type'
import { IJob } from '.'
import { NotificationFactory } from '../notification/notificationFactory'
import { ISendNotification } from '../notification/notificationTemplate'

export type ProductIndexPayload = {
  id: string
  name: string
  description?: string
  brand?: string
  category: string
  price: number
  rating: number
  createdAt: string
}

export class SendEmailJob implements IJob {
  async execute(payload: ISendNotification): Promise<void> {
    const emailNotification = NotificationFactory.createNotifier(NotifierType.EMAIL)
    await emailNotification.sendNotification(payload)
  }
}

export class IndexProductJob implements IJob {
  async execute(payload: ProductIndexPayload): Promise<void> {
    if (!env.ES_NODE) return

    const elastic = await elasticSearchProvider()

    await elastic.index({
      index: productIndex.name,
      id: payload.id,
      document: payload
    })
  }
}
