import cron from 'node-cron'

export interface ICronCommand {
  execute(): Promise<void>
}

interface ScheduledJob {
  schedule: string
  command: ICronCommand
}

class CronJobManager {
  private static instance: CronJobManager
  private jobs: ScheduledJob[] = []

  private constructor() {}

  public static getInstance(): CronJobManager {
    if (!this.instance) {
      this.instance = new CronJobManager()
    }
    return this.instance
  }

  /**
   * Adds a new job to the manager's list.
   * @param schedule The cron schedule string (e.g., '0 3 * * *').
   * @param command The command object to execute.
   */
  public addJob(schedule: string, command: ICronCommand): void {
    this.jobs.push({ schedule, command })
  }

  public startAllJobs(): void {
    if (this.jobs.length === 0) {
      console.log('No cron jobs to start.')
      return
    }

    console.log(`⚙️  Starting ${this.jobs.length} scheduled jobs...`)

    this.jobs.forEach(({ schedule, command }) => {
      cron.schedule(schedule, () => {
        command.execute().catch((error) => {
          console.error(`[CronJobManager] Error executing job:`, error)
        })
      })
    })
  }
}

const cronJobManager = CronJobManager.getInstance()

export default cronJobManager
