import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedGuestRoute() {
  const { user, isRefreshing } = useAuthStore()
  const isGuest = user?.role === 'Guest'

  if (isGuest || isRefreshing) {
    return <Outlet />
  }

  return <Navigate to="/home" replace />
}
