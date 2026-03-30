import { generatePermissions } from './permission.generator'
import PermissionModel from './permission.model'

export async function syncPermissions() {
  const permissions = generatePermissions()

  const bulkOps = permissions.map((key) => ({
    updateOne: {
      filter: { key },
      update: {
        $set: {
          key,
          resource: key.split(':')[0],
          action: key.split(':')[1]
        }
      },
      upsert: true
    }
  }))

  await PermissionModel.bulkWrite(bulkOps)

  console.log(`✅ Synced ${permissions.length} permissions`)
}

export async function cleanOldPermissions() {
  const permissions = generatePermissions()

  await PermissionModel.deleteMany({
    name: { $nin: permissions }
  })

  console.log('🧹 Removed old permissions')
}
