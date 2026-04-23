import axiosClient from '../axiosClient'
import type { Order, UpdateOrderDto } from '../../types/order'
import type { OrderStatus } from '@/types/enums'

export const adminOrderApi = {
    // GET: All orders
    getAll: async (): Promise<Order[]> => {
        const { data } = await axiosClient.get<Order[]>('admin/orders')
        return data
    },

    // GET: Orders filtered by status
    getByStatus: async (status: OrderStatus): Promise<Order[]> => {
        const { data } = await axiosClient.get<Order[]>(`admin/orders/status/${status}`)
        return data
    },

    // GET: Single order by id
    getById: async (id: number): Promise<Order> => {
        const { data } = await axiosClient.get<Order>(`admin/orders/${id}`)
        return data
    },

    // PUT: Update order (e.g. change status, adjust items)
    updateOrder: async (id: number, dto: UpdateOrderDto): Promise<Order> => {
        const { data } = await axiosClient.put<Order>(`admin/orders/${id}`, dto)
        return data
    },

    // DELETE: Remove order permanently
    deleteOrder: async (id: number): Promise<void> => {
        await axiosClient.delete(`admin/orders/${id}`)
    },
}