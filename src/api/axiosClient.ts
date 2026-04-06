import type { InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { AuthResponseDto, RefreshTokenRequestDto, User } from '../types/auth'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean
  }
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.skipAuth) {
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.skipAuth
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true
    const { refreshToken, setAuth, clearAuth, setIsRefreshing } = useAuthStore.getState()
    setIsRefreshing(true)

    if (!refreshToken) {
      isRefreshing = false
      setIsRefreshing(false)
      clearAuth()
      return Promise.reject(error)
    }

    try {
      const { data } = await axiosClient.post<AuthResponseDto>(
        '/auth/refresh',
        { refreshToken } satisfies RefreshTokenRequestDto,
        { skipAuth: true }
      )
      const currentUser = useAuthStore.getState().user
      const user: User = {
        id: data.userId,
        email: data.email ?? currentUser?.email ?? '',
        role: (data.role ?? currentUser?.role ?? 'Guest') as 'Admin' | 'Guest',
      }
      setAuth(data.token, data.refreshToken, user)
      processQueue(null, data.token)
      originalRequest.headers.Authorization = `Bearer ${data.token}`
      return axiosClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearAuth()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
      setIsRefreshing(false)
    }
  }
)

export default axiosClient