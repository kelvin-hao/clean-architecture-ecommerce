export interface AuthUser {
  id: string
  email: string
  name: string
  isVerified: boolean
}

export interface RegisterBody {
  email: string
  name: string
  password: string
}

export interface VerifyOtpBody {
  email: string
  otp: string
}

export interface LoginBody {
  email: string
  password: string
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
