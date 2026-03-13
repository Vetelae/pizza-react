import axiosClient from '../axiosClient'
import type { 
  RegisterDto, LoginDto, ForgotPasswordDto, 
  ResetPasswordDto, RefreshTokenRequestDto, AuthResponseDto 
} from '../../types/auth'

export const authApi = {
  // REGISTER
  register: (data: RegisterDto) =>
    axiosClient.post('/auth/register', data),

  // CONFIRM EMAIL
  confirmEmail: (userId: string, token: string) =>
    axiosClient.post('/auth/confirm-email', null, { params: { userId, token } }),

  // LOGIN
  login: (data: LoginDto) =>
    axiosClient.post<AuthResponseDto>('/auth/login', data),

  // FORGOT PASSWORD
  forgotPassword: (data: ForgotPasswordDto) =>
    axiosClient.post('/auth/forgot-password', data),

  // RESET PASSWORD
  resetPassword: (data: ResetPasswordDto) =>
    axiosClient.post('/auth/reset-password', data),

  // REFRESH
  refresh: (data: RefreshTokenRequestDto) =>
    axiosClient.post<AuthResponseDto>('/auth/refresh', data),

  // LOGOUT
  logout: (data: RefreshTokenRequestDto) =>
    axiosClient.post('/auth/logout', data),
}