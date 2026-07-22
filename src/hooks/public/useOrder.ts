import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateOrderDto } from '@/types/order'
import { orderApi } from '@/api/public/orderApi'

export const useOrder = (id: number, token?: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['orders', id, token ?? null],
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
        ['orders', createdOrder.id, createdOrder.lookupToken ?? null],
        createdOrder
      )
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] })
    },
  })
}
