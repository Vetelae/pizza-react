import { useQuery } from '@tanstack/react-query'
import { userOrderApi } from '@/api/user/userOrderApi'
import { useAuthStore } from '@/store/authStore'

export const useUserOrders = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)

  return useQuery({
    queryKey: ['user', 'orders', userId],
    queryFn: userOrderApi.getMyOrders,
    enabled: isAuthenticated && !!userId,
    staleTime: 1000 * 60,
  })
}

export const useUserOrder = (id: number, enabled = true) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)

  return useQuery({
    queryKey: ['user', 'orders', userId, id],
    queryFn: () => userOrderApi.getMyOrderById(id),
    enabled: enabled && isAuthenticated && !!userId && !!id,
  })
}
