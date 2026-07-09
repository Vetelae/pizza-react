import axiosClient from '../axiosClient'
import type { Order, CreateOrderDto } from '../../types/order'

export const orderApi = {
  // GET: Order by id
  // Guests must provide the lookup token returned when the order is created.
  getById: async (id: number, token?: string | null): Promise<Order> => {
    const { data } = await axiosClient.get<Order>(`public/orders/${id}`, {
      params: token ? { token } : undefined,
    })
    return data
  },

  // POST: Create new order (guests + authenticated users)
  // If the user is logged in, axiosClient should already attach the Bearer token
  // so the backend will associate the order with their account automatically.
  createOrder: async (dto: CreateOrderDto): Promise<Order> => {
    const { data } = await axiosClient.post<Order>('public/orders', dto)
    return data
  },
}
