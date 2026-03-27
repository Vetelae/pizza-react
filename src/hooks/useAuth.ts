import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/public/authApi'
import { useAuthStore } from '../store/authStore'
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '../types/auth'

// useLogin
export const useLogin = () => {
  const { setAuth, closeLogin } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: ({ data }) => {
      setAuth(data.token, data.refreshToken, {
        id: data.userId,
        email: data.email,
        role: data.role as 'Admin' | 'Guest',
      })
      closeLogin()
      navigate('/')
    },
  })
}

// useLogout
export const useLogout = () => {
  const { refreshToken, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout({ refreshToken: refreshToken! }),
    onSettled: () => {
      clearAuth()
      navigate('/home')
    },
  })
}

// useRegister
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
  })
}

// useConfirmEmail
export const useConfirmEmail = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const setEmailConfirmStatus = useAuthStore(state => state.setEmailConfirmStatus)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) => {
      setEmailConfirmStatus('pending')
      return authApi.confirmEmail(userId, token)
    },
    onSuccess: (response) => {
      const data = response.data
      if (data.token && data.email && data.userId) {
        setAuth(data.token, data.refreshToken ?? '', {
          id: data.userId,
          email: data.email,
          role: (data.role as 'Admin' | 'Guest') ?? 'Guest',
        })
      }
      setEmailConfirmStatus('success')
      setTimeout(() => navigate('/'), 3000)
    },
    onError: () => {
      setEmailConfirmStatus('error')
    },
  })
}

// useForgotPassword
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => authApi.forgotPassword(data),
  })
}

// useResetPassword
export const useResetPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authApi.resetPassword(data),
    onSuccess: () => {
      setTimeout(() => navigate('/'), 3000)
    },
  })
}