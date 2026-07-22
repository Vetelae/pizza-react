import axiosClient from '../axiosClient'
import type { Order } from '@/types/order'

export const userOrderApi = {
  // GET: Orders for the currently authenticated user
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await axiosClient.get<Order[]>('user/orders')
    return data
  },

  // GET: Specific order for the currently authenticated user
  getMyOrderById: async (id: number): Promise<Order> => {
    const { data } = await axiosClient.get<Order>(`user/orders/${id}`)
    return data
  },
}
