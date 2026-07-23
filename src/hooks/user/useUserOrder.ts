import { useQuery } from '@tanstack/react-query'
import { userOrderApi } from '@/api/user/userOrderApi'
import { useAuthStore } from '@/store/authStore'

export const userOrderKeys = {
  root: ['user', 'orders'] as const,
  list: (userId: string | null) => ['user', 'orders', userId] as const,
  detail: (userId: string | null, id: number) =>
    ['user', 'orders', userId, id] as const,
}

export const useUserOrders = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)

  return useQuery({
    queryKey: userOrderKeys.list(userId),
    queryFn: userOrderApi.getMyOrders,
    enabled: isAuthenticated && !!userId,
    staleTime: 1000 * 60,
  })
}

export const useUserOrder = (id: number, enabled = true) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)

  return useQuery({
    queryKey: userOrderKeys.detail(userId, id),
    queryFn: () => userOrderApi.getMyOrderById(id),
    enabled: enabled && isAuthenticated && !!userId && !!id,
  })
}
