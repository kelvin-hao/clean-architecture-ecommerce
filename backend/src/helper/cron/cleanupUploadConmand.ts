import { ICronCommand } from './cronJobManager'
import fs from 'fs/promises'
import path from 'path'

export class CleanupUploadCommand implements ICronCommand {
  async execute(): Promise<void> {
    console.log('[Cron] Running orphaned image cleanup job...')
    const UPLOAD_DIR = path.join(process.cwd(), 'assets')

    console.log(UPLOAD_DIR)
    const files = await fs.readdir(UPLOAD_DIR)

    const now = Date.now()

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file)
      const stats = await fs.stat(filePath) // return fullfil object with path
      const fileAge = now - stats.mtime.getTime()

      const MAX_AGE = 60 * 1000 // 60s

      //
      if (fileAge > MAX_AGE) {
        await fs.unlink(filePath)

        console.log('Deleted old upload:', file)
      }
    }
  }
}
