import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  userId: string | null
  isAuthenticated: boolean
  setTokens: (token: string, refreshToken: string, userId: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      setTokens: (token, refreshToken, userId) =>
        set({ token, refreshToken, userId, isAuthenticated: true }),
      clearAuth: () =>
        set({ token: null, refreshToken: null, userId: null, isAuthenticated: false }),
    }),
    { name: 'auth' } // persists to localStorage automatically
  )
)