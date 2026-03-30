import { useMutation } from '@tanstack/react-query'
import { authApi } from '~/apis/auth.api'
import { useAuthStore } from '~/store/auth.store'
import type { ApiError } from '~/types'
import type { RegisterResponse, RegisterBody, VerifyOtpResponse, VerifyOtpBody } from '~/types/auth.type'

export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterBody>({
    mutationFn: authApi.register
  })
}
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (res) => {
      const { user, accessToken } = res.data
      setAuth({ user, accessToken })
    }
  })
}

/**
 * SEND OTP
 */
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.sendOtp(email)
  })
}

/**
 * VERIFY OTP
 */
export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpBody>({
    mutationFn: authApi.verifyOtp
  })
}
