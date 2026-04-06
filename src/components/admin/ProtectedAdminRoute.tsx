import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedAdminRoute() {
  const { user, isRefreshing } = useAuthStore()
  const isAdmin = user?.role === 'Admin'

  if (isAdmin || isRefreshing) {
    return <Outlet />
  }

  return <Navigate to="/home" replace />
}