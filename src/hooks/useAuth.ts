import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/public/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginDto, RegisterDto } from '../types/auth'

// useLogin
export const useLogin = () => {
  const { setTokens, closeLogin } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: ({ data }) => {
      setTokens(data.token, data.refreshToken, data.userId)
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
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      authApi.confirmEmail(userId, token),
    onSuccess: () => {
      setTimeout(() => navigate('/'), 5173)
    },
  })
}