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

const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as { exp?: number }
  } catch {
    return null
  }
}

const shouldRefreshToken = (token: string) => {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return false

  const nowInSeconds = Date.now() / 1000
  const refreshBufferInSeconds = 30
  return payload.exp <= nowInSeconds + refreshBufferInSeconds
}

const refreshAuthToken = async () => {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true
  const { refreshToken, setAuth, clearAuth, setIsRefreshing } = useAuthStore.getState()
  setIsRefreshing(true)

  if (!refreshToken) {
    isRefreshing = false
    setIsRefreshing(false)
    clearAuth()
    throw new Error('Missing refresh token')
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
    return data.token
  } catch (refreshError) {
    processQueue(refreshError, null)
    clearAuth()
    throw refreshError
  } finally {
    isRefreshing = false
    setIsRefreshing(false)
  }
}

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.skipAuth) {
      const { token, refreshToken } = useAuthStore.getState()

      if (token) {
        const authToken =
          refreshToken && shouldRefreshToken(token)
            ? await refreshAuthToken()
            : token

        config.headers.Authorization = `Bearer ${authToken}`
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
    try {
      const token = await refreshAuthToken()
      originalRequest.headers.Authorization = `Bearer ${token}`
      return axiosClient(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
)

export default axiosClient
