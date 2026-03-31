import { IndexProductJob, SendEmailJob } from './backgroundJobManager'
import { JobManager, JobType } from './jobManager'
import { QueueName } from './queueManager'
import { WorkerManager } from './workerManager'

export interface IJob {
  execute(data: unknown): Promise<void>
}

export const initializeBackgroundJob = async () => {
  // registry jobs
  JobManager.register(JobType.SEND_EMAIL, new SendEmailJob())
  JobManager.register(JobType.INDEX_PRODUCT, new IndexProductJob())

  // initial worker
  await Promise.all([WorkerManager.createWorker(QueueName.EMAIL), WorkerManager.createWorker(QueueName.PRODUCT_INDEX)])
}
