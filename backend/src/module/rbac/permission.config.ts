export const permissionConfig = {
  user: ['create', 'read', 'update', 'delete'],
  product: ['create', 'read', 'update', 'delete'],
  order: ['create', 'read', 'cancel']
} as const

export const scopes = ['any', 'own'] as const
