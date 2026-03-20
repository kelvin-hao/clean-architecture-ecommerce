import { Queue } from 'bullmq'
import { redisProvider } from '~/database'

export enum QueueName {
  EMAIL = 'email-queue',
  INVENTORY = 'inventory-queue',
  NOTIFICATION = 'notification-queue'
}

export class QueueManager {
  private static queues: Map<QueueName, Queue> = new Map()

  static async getQueue(name: QueueName): Promise<Queue> {
    if (this.queues.has(name)) {
      return this.queues.get(name)!
    }

    const redis = await redisProvider()

    const queue = new Queue(name, {
      connection: redis
    })

    this.queues.set(name, queue)

    return queue
  }
}
