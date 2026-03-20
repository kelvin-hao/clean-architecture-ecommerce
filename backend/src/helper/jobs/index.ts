import { ISendNotification } from '../notification/notificationTemplate'
import { SendEmailJob } from './backgroundJobManager'
import { JobManager, JobType } from './jobManager'
import { QueueName } from './queueManager'
import { WorkerManager } from './workerManager'

export interface IJob {
  execute(data: ISendNotification): Promise<void>
}

export const initializeBackgroundJob = async () => {
  // registry jobs
  JobManager.register(JobType.SEND_EMAIL, new SendEmailJob())

  // initial worker
  await WorkerManager.createWorker(QueueName.EMAIL)
}
