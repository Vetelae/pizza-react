import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type {
    OrderHistoryQuery,
    UpdateOrderDto,
    UpdateOrderStatusDto,
} from '../../types/order'
import { adminOrderApi } from '@/api/admin/adminOrderApi'
import { adminDashboardKeys } from './useAdminDashboard'

export const adminOrderKeys = {
    active: ['admin', 'orders', 'active'] as const,
    historyRoot: ['admin', 'orders', 'history'] as const,
    history: (query: OrderHistoryQuery) =>
        ['admin', 'orders', 'history', query] as const,
    detail: (id: number) => ['admin', 'orders', id] as const,
}

export const useActiveAdminOrders = () => {
    return useQuery({
        queryKey: adminOrderKeys.active,
        queryFn: adminOrderApi.getActive,
        staleTime: 15_000,
        refetchOnWindowFocus: true,
    })
}

export const useAdminOrderHistory = (query: OrderHistoryQuery) => {
    return useQuery({
        queryKey: adminOrderKeys.history(query),
        queryFn: () => adminOrderApi.getHistory(query),
        enabled:
            query.period !== 'Custom' ||
            Boolean(
                query.fromDate &&
                query.toDate &&
                query.fromDate <= query.toDate
            ),
        placeholderData: (previousData) => previousData,
        staleTime: 30_000,
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
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.active })
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.historyRoot })
            queryClient.invalidateQueries({ queryKey: adminDashboardKeys.todayKpis })
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
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.historyRoot })
            queryClient.invalidateQueries({ queryKey: adminDashboardKeys.todayKpis })
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                queryClient.invalidateQueries({ queryKey: adminOrderKeys.active })
                queryClient.invalidateQueries({ queryKey: adminDashboardKeys.todayKpis })
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
            queryClient.removeQueries({ queryKey: adminOrderKeys.detail(deletedId) })
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.active })
            queryClient.invalidateQueries({ queryKey: adminOrderKeys.historyRoot })
            queryClient.invalidateQueries({ queryKey: adminDashboardKeys.todayKpis })
        },
    })
}
