import { IJob } from '.'
import { BadRequestError } from '../response/errorResponse'

export enum JobType {
  SEND_EMAIL = 'SEND_EMAIL',
  INDEX_PRODUCT = 'INDEX_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT'
}

export class JobManager {
  private static jobs: Map<JobType, IJob> = new Map()

  private constructor() {}

  static register(type: JobType, job: IJob) {
    this.jobs.set(type, job)
  }

  static get(type: JobType): IJob {
    const job = this.jobs.get(type)

    if (!job) {
      throw new BadRequestError(`Job ${type} not registered`)
    }

    return job
  }
}
