import axiosClient from '../axiosClient'
import type {
    Order,
    OrderCard,
    UpdateOrderDto,
    UpdateOrderStatusDto,
} from '../../types/order'
import type { OrderStatus } from '@/types/enums'

export const adminOrderApi = {
    // GET: All orders
    getAll: async (): Promise<Order[]> => {
        const { data } = await axiosClient.get<Order[]>('admin/orders')
        return data
    },

    // GET: Lightweight active orders for the monitoring board
    getActive: async (): Promise<OrderCard[]> => {
        const { data } = await axiosClient.get<OrderCard[]>('admin/orders/active')
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

    // PATCH: Move an order through the monitored status workflow
    updateStatus: async (id: number, dto: UpdateOrderStatusDto): Promise<Order> => {
        const { data } = await axiosClient.patch<Order>(`admin/orders/${id}/status`, dto)
        return data
    },

    // DELETE: Remove order permanently
    deleteOrder: async (id: number): Promise<void> => {
        await axiosClient.delete(`admin/orders/${id}`)
    },
}
