export interface AuthUser {
  id?: string
  email: string
  name?: string
  phone_number?: string
  avatar?: string
  two_FA?: boolean
  roles?: string[]
  status?: string
  isVerified?: boolean
}

export interface RegisterBody {
  email: string
  name: string
  password: string
  phone_number?: string
}

export interface VerifyOtpBody {
  email: string
  otp: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface ForgotPasswordBody {
  email: string
}

export interface ResetPasswordBody {
  token: string
  newPassword: string
}

export interface UpdateProfileBody {
  name: string
  phone_number?: string
  avatar?: string
}

export interface RefreshTokenBody {
  refresh_token: string
}

export interface LoginSessionResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse extends LoginSessionResponse {
  user: AuthUser
}

export interface LogoutResponse {
  id: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordResponse {
  id: string
  message: string
}

export interface RegisterResponse {
  email: string
}

export interface SendOtpResponse {
  email: string
  expiredIn: number
}

export interface VerifyOtpResponse {
  id: string
}

export interface UpdateProfileResponse {
  id: string
  user: AuthUser
}
