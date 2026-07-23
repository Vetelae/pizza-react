import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { UpdateOrderDto, UpdateOrderStatusDto } from '../../types/order'
import { adminOrderApi } from '@/api/admin/adminOrderApi'
import type { OrderStatus } from '@/types/enums'

export const adminOrderKeys = {
    all: ['admin', 'orders'] as const,
    active: ['admin', 'orders', 'active'] as const,
    detail: (id: number) => ['admin', 'orders', id] as const,
    byStatus: (status: OrderStatus) => ['admin', 'orders', 'status', status] as const,
}

// All orders (admin dashboard / order list)
export const useAdminOrders = () => {
    return useQuery({
        queryKey: adminOrderKeys.all,
        queryFn: adminOrderApi.getAll,
    })
}

export const useActiveAdminOrders = () => {
    return useQuery({
        queryKey: adminOrderKeys.active,
        queryFn: adminOrderApi.getActive,
        staleTime: 15_000,
        refetchOnWindowFocus: true,
    })
}

// Orders filtered by status (e.g. "Pending", "InProgress")
export const useAdminOrdersByStatus = (status: OrderStatus) => {
    return useQuery({
        queryKey: adminOrderKeys.byStatus(status),
        queryFn: () => adminOrderApi.getByStatus(status),
    })
}

// Single order detail (admin view)
export const useAdminOrderById = (id: number) => {
    return useQuery({
        queryKey: adminOrderKeys.detail(id),
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
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.all })
            queryClient.setQueryData(adminOrderKeys.detail(updatedOrder.id), updatedOrder)
        },
    })
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateOrderStatusDto }) =>
            adminOrderApi.updateStatus(id, dto),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(adminOrderKeys.detail(updatedOrder.id), updatedOrder)
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.active })
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                queryClient.invalidateQueries({ queryKey: adminOrderKeys.active })
            }
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
            queryClient.removeQueries({ queryKey: adminOrderKeys.detail(deletedId) })
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.all })
        },
    })
}
