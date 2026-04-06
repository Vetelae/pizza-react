import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

interface AuthState {
  token: string | null
  refreshToken: string | null
  userId: string | null
  isAuthenticated: boolean
  user: User | null
  isRefreshing: boolean
  setTokens: (token: string, refreshToken: string, userId: string) => void
  setAuth: (token: string, refreshToken: string, user: User) => void
  clearAuth: () => void
  isAdmin: () => boolean
  setIsRefreshing: (value: boolean) => void
  // UI
  isLoginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      user: null,
      isRefreshing: false,
      setTokens: (token, refreshToken, userId) =>
        set({ token, refreshToken, userId, isAuthenticated: true }),
      setAuth: (token, refreshToken, user) => {
        set({ token, refreshToken, userId: user.id, isAuthenticated: true, user })
      },
      clearAuth: () => {
        set({ token: null, refreshToken: null, userId: null, isAuthenticated: false, user: null })
      },
      isAdmin: () => get().user?.role === 'Admin',
      setIsRefreshing: (value) => set({ isRefreshing: value }),
      // UI
      isLoginOpen: false,
      openLogin: () => set({ isLoginOpen: true }),
      closeLogin: () => set({ isLoginOpen: false }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
)