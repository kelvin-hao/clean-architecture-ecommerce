import { ICronCommand } from './cronJobManager'
import { v2 as cloudinary } from 'cloudinary'

class CleanupImageCommand implements ICronCommand {
  async execute(): Promise<void> {
    console.log('[Cron] Running orphaned image cleanup job...')
    try {
      // Cloudinary search for images with 'temp-upload' tag AND created more than 1 day ago
      const result: {
        resources: { public_id: string }[]
        // Add other top-level properties if needed, like next_cursor
      } = await cloudinary.search.expression('tags=temp-upload AND created_at < 1d').max_results(500).execute()

      if (!result.resources || result.resources.length === 0) {
        console.log('[Cron] No orphaned images to delete.')
        return
      }

      console.log(`[Cron] Found ${result.resources.length} orphaned images to delete.`)

      // Get the public_ids of the images to be deleted
      const publicIds = result.resources.map((res) => res.public_id)

      // Delete all found images in a single API call
      await cloudinary.api.delete_resources(publicIds)

      console.log('[Cron] Cleanup job completed successfully.')
    } catch (error) {
      console.error('[Cron] Error during orphaned image cleanup:', error)
    }
  }
}
export default CleanupImageCommand
