import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '~/store/auth.store'
import type { ApiError, ApiResponse } from '~/types'
import type { LoginSessionResponse } from '~/types/auth.type'

const API_URL = import.meta.env.VITE_API_URL

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const isPublicAuthRequest = (requestUrl = '') => {
  return (
    requestUrl.includes('/auth/sign-in') ||
    requestUrl.includes('/auth/sign-up') ||
    requestUrl.includes('/auth/send-otp') ||
    requestUrl.includes('/auth/verify-otp') ||
    requestUrl.includes('/auth/forgot-password') ||
    requestUrl.includes('/auth/reset-password') ||
    requestUrl.includes('/auth/refresh-token')
  )
}

const isTokenExpiringSoon = (token: string, bufferInSeconds = 15) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return false

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=')
    const decoded = JSON.parse(atob(paddedPayload)) as { exp?: number }

    if (typeof decoded.exp !== 'number') return false

    return decoded.exp * 1000 <= Date.now() + bufferInSeconds * 1000
  } catch {
    return false
  }
}

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

let refreshPromise: Promise<LoginSessionResponse | null> | null = null

const refreshSession = async (): Promise<LoginSessionResponse | null> => {
  const { refreshToken, setSession, logout } = useAuthStore.getState()

  if (!refreshToken) return null

  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<LoginSessionResponse>>(
        `${API_URL}/auth/refresh-token`,
        { refresh_token: refreshToken },
        { withCredentials: true }
      )
      .then((res) => {
        const session = res.data.data
        setSession(session)
        return session
      })
      .catch(() => {
        logout()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

axiosClient.interceptors.request.use(async (config) => {
  const requestUrl = config.url ?? ''

  if (isPublicAuthRequest(requestUrl)) {
    return config
  }

  const { accessToken, refreshToken } = useAuthStore.getState()
  let token = accessToken

  if ((!token && refreshToken) || (token && isTokenExpiringSoon(token))) {
    const session = await refreshSession()
    token = session?.accessToken ?? useAuthStore.getState().accessToken
  }

  if (token) {
    const headers = new AxiosHeaders(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (err: AxiosError<ApiError>) => {
    const originalRequest = err.config as RetryableRequestConfig | undefined
    const status = err.response?.status
    const requestUrl = originalRequest?.url ?? ''
    const publicRequest = isPublicAuthRequest(requestUrl)

    if (status === 410 && originalRequest && !originalRequest._retry && !publicRequest) {
      originalRequest._retry = true

      const session = await refreshSession()

      if (session?.accessToken) {
        const headers = new AxiosHeaders(originalRequest.headers)
        headers.set('Authorization', `Bearer ${session.accessToken}`)
        originalRequest.headers = headers

        return axiosClient(originalRequest)
      }
    }

    if ((status === 401 || status === 410) && !publicRequest) {
      useAuthStore.getState().logout()

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const redirectTo = `${window.location.pathname}${window.location.search}`
        window.location.href = `/login?redirect=${encodeURIComponent(redirectTo)}`
      }
    }

    return Promise.reject(handleApiError(err))
  }
)

export const handleApiError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Server error',
      status: error.response.status,
      errors: error.response.data?.errors
    } satisfies ApiError
  }

  if (error.request) {
    return {
      message: 'Network error',
      status: 0
    } satisfies ApiError
  }

  return {
    message: error.message,
    status: 0
  } satisfies ApiError
}

export default axiosClient
