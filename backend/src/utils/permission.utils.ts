export const RESOURCES = {
  USER: 'user',
  PRODUCT: 'product',
  ORDER: 'order'
} as const

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete'
} as const

export const SCOPES = {
  ANY: 'any',
  OWN: 'own'
} as const

export const PERM = (resource: string, action: string, scope: string) => `${resource}:${action}:${scope}`
