import { permissionConfig, scopes } from './permission.config'

export function generatePermissions() {
  const permissions: string[] = []

  for (const [resource, actions] of Object.entries(permissionConfig)) {
    for (const action of actions) {
      for (const scope of scopes) {
        permissions.push(`${resource}:${action}:${scope}`)
      }
    }
  }

  return permissions
}
