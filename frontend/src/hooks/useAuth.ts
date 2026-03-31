import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '~/apis/auth.api'
import { queryClient } from '~/lib/react-query'
import { useAuthStore } from '~/store/auth.store'
import type { ApiError } from '~/types'
import type {
  AuthUser,
  ForgotPasswordBody,
  ForgotPasswordResponse,
  LoginBody,
  LoginResponse,
  LogoutResponse,
  ResetPasswordBody,
  ResetPasswordResponse,
  RegisterResponse,
  RegisterBody,
  SendOtpResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
  VerifyOtpResponse,
  VerifyOtpBody
} from '~/types/auth.type'

export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterBody>({
    mutationFn: authApi.register
  })
}

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<LoginResponse, ApiError, LoginBody>({
    mutationFn: authApi.login,
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      setAuth({ user, accessToken, refreshToken })
      queryClient.setQueryData<AuthUser>(['profile'], user)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  })
}

export const useProfile = () => {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshToken = useAuthStore((s) => s.refreshToken)

  return useQuery<AuthUser, ApiError>({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: Boolean(accessToken || refreshToken)
  })
}

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation<UpdateProfileResponse, ApiError, UpdateProfileBody>({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ user }) => {
      setUser(user)
      queryClient.setQueryData<AuthUser>(['profile'], user)
    }
  })
}

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout)

  return useMutation<LogoutResponse, ApiError, void>({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      queryClient.removeQueries({ queryKey: ['profile'] })
    }
  })
}

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordBody>({
    mutationFn: authApi.forgotPassword
  })
}

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordBody>({
    mutationFn: authApi.resetPassword
  })
}

/**
 * SEND OTP
 */
export const useSendOtp = () => {
  return useMutation<SendOtpResponse, ApiError, string>({
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
