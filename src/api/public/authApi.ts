import axiosClient from '../axiosClient'
import type { 
  RegisterDto, LoginDto, ForgotPasswordDto, 
  ResetPasswordDto, RefreshTokenRequestDto, AuthResponseDto, UserProfileDto 
} from '../../types/auth'

export const authApi = {
  // REGISTER
  register: (data: RegisterDto) =>
    axiosClient.post('/auth/register', data, { skipAuth: true }),

  // CONFIRM EMAIL
  confirmEmail: (userId: string, token: string) =>
    axiosClient.post('/auth/confirm-email', null, { 
      params: { userId, token },
      skipAuth: true 
    }),

  // LOGIN
  login: (data: LoginDto) =>
    axiosClient.post<AuthResponseDto>('/auth/login', data, { skipAuth: true }),

  // ME
  me: async (): Promise<UserProfileDto> => {
    const { data } = await axiosClient.get<UserProfileDto>('/auth/me')
    return data
  },

  // FORGOT PASSWORD
  forgotPassword: (data: ForgotPasswordDto) =>
    axiosClient.post('/auth/forgot-password', data, { skipAuth: true }),

  // RESET PASSWORD
  resetPassword: (data: ResetPasswordDto) =>
    axiosClient.post('/auth/reset-password', data, { skipAuth: true }),

  // REFRESH
  refresh: (data: RefreshTokenRequestDto) =>
    axiosClient.post<AuthResponseDto>('/auth/refresh', data),

  // LOGOUT
  logout: (data: RefreshTokenRequestDto) =>
    axiosClient.post('/auth/logout', data),
}
