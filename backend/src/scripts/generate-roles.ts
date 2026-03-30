import mongoose from 'mongoose'
import env from '~/config/env/dotenv.config'
import { cleanOldRoles, syncRoles } from '~/module/rbac/role.sync'

async function run() {
  await mongoose.connect(env.MONGO_URI)
  await cleanOldRoles()

  console.log('🚀 Generating roles...')

  await syncRoles()

  console.log('🎉 Done roles')

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
