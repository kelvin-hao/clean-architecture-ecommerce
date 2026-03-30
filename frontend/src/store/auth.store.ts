import { create } from 'zustand'

type User = {
  id: string
  email: string
}

type AuthState = {
  user: User | null
  accessToken: string | null

  setAuth: (data: { user: User; accessToken: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),

  setAuth: ({ user, accessToken }) => {
    localStorage.setItem('access_token', accessToken)
    set({ user, accessToken })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, accessToken: null })
  }
}))
