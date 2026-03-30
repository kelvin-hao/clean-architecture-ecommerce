import axios, { AxiosError } from 'axios'
import { useAuthStore } from '~/store/auth.store'
import type { ApiError } from '~/types'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },

  (err: AxiosError<ApiError>) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
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
