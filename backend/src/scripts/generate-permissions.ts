import mongoose from 'mongoose'
import { syncPermissions, cleanOldPermissions } from '../module/rbac/permission.sync'
import env from '~/config/env/dotenv.config'

async function run() {
  await mongoose.connect(env.MONGO_URI)
  await cleanOldPermissions()

  console.log('🚀 Generating permissions...')

  await syncPermissions()

  console.log('🎉 Done')

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
