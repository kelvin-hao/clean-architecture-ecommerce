import { ACTIONS, PERM, RESOURCES, SCOPES } from '~/utils/permission.utils'

export const roleConfig = {
  admin: {
    description: 'Full access to system',
    permissions: 'ALL'
  },

  vendor: {
    description: 'Manage own products and orders',
    permissions: [
      PERM(RESOURCES.PRODUCT, ACTIONS.CREATE, SCOPES.OWN),
      PERM(RESOURCES.PRODUCT, ACTIONS.UPDATE, SCOPES.OWN),
      PERM(RESOURCES.ORDER, ACTIONS.READ, SCOPES.OWN)
    ]
  },

  user: {
    description: 'Normal user',
    permissions: [
      PERM(RESOURCES.USER, ACTIONS.READ, SCOPES.OWN),
      PERM(RESOURCES.USER, ACTIONS.UPDATE, SCOPES.OWN),
      PERM(RESOURCES.USER, ACTIONS.DELETE, SCOPES.OWN)
    ]
  }
}
