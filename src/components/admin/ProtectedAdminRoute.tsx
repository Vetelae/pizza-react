import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedAdminRoute() {
  const { isAuthenticated, isAdmin } = useAuthStore()
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/home" replace />
  }
  
  return <Outlet />
}