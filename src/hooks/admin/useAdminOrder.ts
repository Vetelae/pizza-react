import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateOrderDto } from '../../types/order'
import { adminOrderApi } from '@/api/admin/adminOrderApi'
import type { OrderStatus } from '@/types/enums'

// All orders (admin dashboard / order list)
export const useAdminOrders = () => {
    return useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: adminOrderApi.getAll,
    })
}

// Orders filtered by status (e.g. "Pending", "InProgress")
export const useAdminOrdersByStatus = (status: OrderStatus) => {
    return useQuery({
        queryKey: ['admin', 'orders', 'status', status],
        queryFn: () => adminOrderApi.getByStatus(status),
    })
}

// Single order detail (admin view)
export const useAdminOrderById = (id: number) => {
    return useQuery({
        queryKey: ['admin', 'orders', id],
        queryFn: () => adminOrderApi.getById(id),
        enabled: !!id,
    })
}

// Update order (status change, edits)
export const useUpdateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateOrderDto }) =>
            adminOrderApi.updateOrder(id, dto),
        onSuccess: (updatedOrder) => {
            // Refresh the specific order and the full list
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
            queryClient.setQueryData(['admin', 'orders', updatedOrder.id], updatedOrder)
        },
    })
}

// Delete order
export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => adminOrderApi.deleteOrder(id),
        onSuccess: (_, deletedId) => {
            // Remove from cache and refresh list
            queryClient.removeQueries({ queryKey: ['admin', 'orders', deletedId] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
        },
    })
}