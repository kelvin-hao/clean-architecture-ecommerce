import { create } from 'zustand'
import type { AuthUser, LoginSessionResponse } from '~/types/auth.type'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (data: { user: AuthUser; accessToken: string; refreshToken: string }) => void
  setSession: (data: LoginSessionResponse) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

const getAvatarUrl = (avatar: unknown): string | undefined => {
  if (typeof avatar === 'string') return avatar

  if (avatar && typeof avatar === 'object') {
    const avatarObject = avatar as { url?: unknown }
    return typeof avatarObject.url === 'string' ? avatarObject.url : undefined
  }

  return undefined
}

const normalizeUser = (user: AuthUser | null): AuthUser | null => {
  if (!user) return null

  return {
    ...user,
    avatar: getAvatarUrl((user as AuthUser & { avatar?: unknown }).avatar)
  }
}

const storedUser = localStorage.getItem('auth_user')
const parsedUser = (() => {
  try {
    return normalizeUser(storedUser ? (JSON.parse(storedUser) as AuthUser) : null)
  } catch {
    return null
  }
})()

export const useAuthStore = create<AuthState>((set) => ({
  user: parsedUser,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),

  setAuth: ({ user, accessToken, refreshToken }) => {
    const normalizedUser = normalizeUser(user)

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
    set({ user: normalizedUser, accessToken, refreshToken })
  },

  setSession: ({ accessToken, refreshToken }) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    set((state) => ({ ...state, accessToken, refreshToken }))
  },

  setUser: (user) => {
    const normalizedUser = normalizeUser(user)

    if (normalizedUser) {
      localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
    } else {
      localStorage.removeItem('auth_user')
    }

    set((state) => ({ ...state, user: normalizedUser }))
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    set({ user: null, accessToken: null, refreshToken: null })
  }
}))
