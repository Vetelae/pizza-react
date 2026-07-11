import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/public/authApi'
import { useAuthStore } from '@/store/authStore'
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '@/types/auth'

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
    mutationFn: () => {
      return authApi.logout({ refreshToken: refreshToken! })
    },
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

// useProfile
export const useProfile = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: authApi.me,
    enabled: isAuthenticated && !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

// useConfirmEmail
export const useConfirmEmail = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      authApi.confirmEmail(userId, token),
    onSuccess: (response) => {
      const data = response.data
      if (data.token && data.email && data.userId) {
        setAuth(data.token, data.refreshToken ?? '', {
          id: data.userId,
          email: data.email,
          role: (data.role as 'Admin' | 'Guest') ?? 'Guest',
        })
      }
      setTimeout(() => navigate('/'), 3000)
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
