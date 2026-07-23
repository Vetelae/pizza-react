import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateOrderDto } from '@/types/order'
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

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => orderApi.createOrder(dto),
    onSuccess: (createdOrder) => {
      queryClient.setQueryData(
        publicOrderKeys.detail(createdOrder.id, createdOrder.lookupToken),
        createdOrder
      )
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] })
    },
  })
}
