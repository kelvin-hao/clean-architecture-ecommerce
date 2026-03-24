import { redisProvider } from '~/database'
import { QueueName } from './queueManager'
import { Worker } from 'bullmq'
import { JobManager, JobType } from './jobManager'

export class WorkerManager {
  static async createWorker(queueName: QueueName, concurrency = 1) {
    const redis = await redisProvider()

    const worker = new Worker(
      queueName,
      async (job) => {
        const { payload } = job.data
        await JobManager.get(job.name as JobType).execute(payload)
      },
      {
        connection: redis,
        concurrency
      }
    )

    return worker
  }
}
