import axiosClient from '~/lib/axios'
import type { ApiResponse } from '~/types'
import type {
  LoginBody,
  RegisterResponse,
  RegisterBody,
  SendOtpResponse,
  VerifyOtpResponse,
  VerifyOtpBody
} from '~/types/auth.type'

export const authApi = {
  login: async (data: LoginBody) => axiosClient.post('/auth/login', data),

  register: async (data: RegisterBody): Promise<RegisterResponse> => {
    const res = await axiosClient.post<ApiResponse<RegisterResponse>>('/auth/sign-up', data)
    return res.data.data
  },

  sendOtp: async (email: string) => axiosClient.post<ApiResponse<SendOtpResponse>>('/auth/send-otp', { email }),

  verifyOtp: async (data: VerifyOtpBody): Promise<VerifyOtpResponse> => {
    const res = await axiosClient.post<ApiResponse<VerifyOtpResponse>>('/auth/verify-otp', data)
    return res.data.data
  }
}
