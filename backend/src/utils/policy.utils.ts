import { JwtPayload } from '~/types/type'

export type PolicyFn = (params: { user: JwtPayload; resource?: { id: string } }) => boolean | Promise<boolean>

const policies: {
  isSelf: PolicyFn
  isAdmin: PolicyFn
} = {
  isSelf: ({ user, resource }) => {
    if (!resource) return false
    return user.id === resource.id
  },

  isAdmin: ({ user }) => {
    return user.roles.includes('admin')
  }
}

export default policies
