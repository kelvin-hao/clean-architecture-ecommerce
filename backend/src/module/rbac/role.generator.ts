import { roleConfig } from './role.config'
import { generatePermissions } from './permission.generator'

export function generateRoles() {
  const allPermissions = generatePermissions()

  const roles = []

  for (const [name, config] of Object.entries(roleConfig)) {
    let permissions: string[] = []

    if (config.permissions === 'ALL') {
      permissions = allPermissions
    } else {
      permissions = Array.isArray(config.permissions) ? config.permissions : []
    }

    roles.push({
      name,
      description: config.description,
      permissions
    })
  }

  return roles
}
