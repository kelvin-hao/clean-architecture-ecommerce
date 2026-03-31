import axios from 'axios'
import axiosClient from '~/lib/axios'
import type { ApiResponse } from '~/types'
import type {
  AuthUser,
  ForgotPasswordBody,
  ForgotPasswordResponse,
  LoginBody,
  LoginResponse,
  LoginSessionResponse,
  LogoutResponse,
  RefreshTokenBody,
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

type ProfileApiUser = Omit<AuthUser, 'avatar'> & {
  avatar?: string | { url?: string } | null
}

const normalizeAuthUser = (user: ProfileApiUser): AuthUser => ({
  ...user,
  avatar: typeof user.avatar === 'string' ? user.avatar : user.avatar?.url
})

export const authApi = {
  googleLoginUrl: (redirectPath = '/') => {
    return `${import.meta.env.VITE_API_URL}/auth/google?redirect=${encodeURIComponent(redirectPath)}`
  },

  getProfile: async (accessToken?: string): Promise<AuthUser> => {
    const res = await axiosClient.get<ApiResponse<{ user: ProfileApiUser }>>(
      '/users/profile',
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        : undefined
    )

    return normalizeAuthUser(res.data.data.user)
  },

  login: async (data: LoginBody): Promise<LoginResponse> => {
    const normalizedEmail = data.email.trim().toLowerCase()
    const loginRes = await axiosClient.post<ApiResponse<LoginSessionResponse>>('/auth/sign-in', {
      ...data,
      email: normalizedEmail
    })
    const session = loginRes.data.data

    let user: AuthUser = {
      email: normalizedEmail
    }

    try {
      user = await authApi.getProfile(session.accessToken)
    } catch {
      user = {
        ...user,
        name: normalizedEmail.split('@')[0]
      }
    }

    return {
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken
    }
  },

  refreshToken: async ({ refresh_token }: RefreshTokenBody): Promise<LoginSessionResponse> => {
    const res = await axios.post<ApiResponse<LoginSessionResponse>>(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      { refresh_token },
      {
        withCredentials: true
      }
    )

    return res.data.data
  },

  logout: async (): Promise<LogoutResponse> => {
    const res = await axiosClient.delete<ApiResponse<LogoutResponse>>('/auth/log-out')
    return res.data.data
  },

  forgotPassword: async (data: ForgotPasswordBody): Promise<ForgotPasswordResponse> => {
    const res = await axiosClient.post<ApiResponse<ForgotPasswordResponse>>('/auth/forgot-password', data)
    return res.data.data
  },

  resetPassword: async (data: ResetPasswordBody): Promise<ResetPasswordResponse> => {
    const res = await axiosClient.post<ApiResponse<ResetPasswordResponse>>('/auth/reset-password', data)
    return res.data.data
  },

  updateProfile: async (data: UpdateProfileBody): Promise<UpdateProfileResponse> => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    ) as UpdateProfileBody

    const res = await axiosClient.patch<ApiResponse<{ id: string; user?: ProfileApiUser }>>('/users/profile', payload)

    return {
      id: res.data.data.id,
      user: res.data.data.user ? normalizeAuthUser(res.data.data.user) : await authApi.getProfile()
    }
  },

  register: async (data: RegisterBody): Promise<RegisterResponse> => {
    const res = await axiosClient.post<ApiResponse<RegisterResponse>>('/auth/sign-up', data)
    return res.data.data
  },

  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    const res = await axiosClient.post<ApiResponse<SendOtpResponse>>('/auth/send-otp', { email })
    return res.data.data
  },

  verifyOtp: async (data: VerifyOtpBody): Promise<VerifyOtpResponse> => {
    const res = await axiosClient.post<ApiResponse<VerifyOtpResponse>>('/auth/verify-otp', data)
    return res.data.data
  }
}
