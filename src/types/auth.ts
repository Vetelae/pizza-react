// Request DTOs

export interface User {
  id: string
  email: string
  role: 'Admin' | 'Guest'
}

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

export interface RefreshTokenRequestDto {
  refreshToken: string
}

// Response DTOs
export interface AuthResponseDto {
  success: boolean
  message: string
  userId: string
  email: string
  token: string
  refreshToken: string
  role: string
}