import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  userId: string | null
  isAuthenticated: boolean
  setTokens: (token: string, refreshToken: string, userId: string) => void
  clearAuth: () => void

  // UI
  isLoginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
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

      // UI
      isLoginOpen: false,
      openLogin: () => set({ isLoginOpen: true }),
      closeLogin: () => set({ isLoginOpen: false }),
    }),
    { 
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      // only persist auth fields, not ui state
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }), 
    }
  )
)