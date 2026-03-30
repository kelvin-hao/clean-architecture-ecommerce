import { generateRoles } from './role.generator'
import RoleModel from './role.model'

export async function syncRoles() {
  const roles = generateRoles()

  const bulkOps = roles.map((role) => ({
    updateOne: {
      filter: { name: role.name },
      update: {
        $set: {
          description: role.description,
          permissions: role.permissions
        }
      },
      upsert: true
    }
  }))

  await RoleModel.bulkWrite(bulkOps)

  console.log(`✅ Synced ${roles.length} roles`)
}

export async function cleanOldRoles() {
  const roles = generateRoles()
  const roleNames = roles.map((r) => r.name)

  await RoleModel.deleteMany({
    name: { $nin: roleNames }
  })

  console.log('🧹 Removed old roles')
}
