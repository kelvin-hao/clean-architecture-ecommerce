import { redisProvider } from '~/database'
import { QueueName } from './queueManager'
import { Worker } from 'bullmq'
import { JobManager } from './jobManager'

export class WorkerManager {
  static async createWorker(queueName: QueueName, concurrency = 1) {
    const redis = await redisProvider()

    const worker = new Worker(
      queueName,
      async (job) => {
        const { type, payload } = job.data
        await JobManager.get(type).execute(payload)
      },
      {
        connection: redis,
        concurrency
      }
    )

    return worker
  }
}
