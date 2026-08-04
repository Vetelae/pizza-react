import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/api/public/orderApi'

export const publicOrderKeys = {
  root: ['orders'] as const,
  detail: (id: number, token?: string | null) =>
    ['orders', id, token ?? null] as const,
}

export const useOrder = (id: number, token?: string | null, enabled = true) => {
  return useQuery({
    queryKey: publicOrderKeys.detail(id, token),
    queryFn: () => orderApi.getById(id, token),
    enabled: enabled && !!id,
  })
}
