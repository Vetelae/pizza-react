import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/public/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginDto, RegisterDto } from '../types/auth'

export const useLogin = () => {
  const { setTokens } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: ({ data }) => {
      setTokens(data.token, data.refreshToken, data.userId)
      navigate('/') 
    },
  })
}

export const useLogout = () => {
  const { refreshToken, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout({ refreshToken: refreshToken! }),
    onSettled: () => {
      clearAuth()
      navigate('/login')
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
  })
}