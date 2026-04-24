import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateOrderDto } from '@/types/order'
import { orderApi } from '@/api/public/orderApi'

// Track a single order by id (public — guests and logged-in users)
export const useOrder = (id: number) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => orderApi.getById(id),
        // Don't run until we have an id (e.g. after checkout redirect)
        enabled: !!id,
    })
}

// Submit a new order from the cart
export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: CreateOrderDto) => orderApi.createOrder(dto),
        onSuccess: (createdOrder) => {
            // Pre-populate the order cache so the confirmation page
            // renders instantly without an extra fetch
            queryClient.setQueryData(['orders', createdOrder.id], createdOrder)
        },
    })
}