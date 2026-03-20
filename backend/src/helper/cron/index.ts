import CleanupImageCommand from './cleanupImagesCommand'
import { CleanupUploadCommand } from './cleanupUploadConmand'
import cronJobManager from './cronJobManager'

export function initializeScheduler() {
  const manager = cronJobManager
  const cleanUpImageCommand = new CleanupImageCommand()
  const cleanupUploadCommand = new CleanupUploadCommand()

  manager.addJob('0 3 * * *', cleanUpImageCommand)
  manager.addJob('0 3 * * *', cleanupUploadCommand)
  manager.startAllJobs()
}
