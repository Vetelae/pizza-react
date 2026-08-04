import axiosClient from '../axiosClient'
import type { Order } from '../../types/order'

export const orderApi = {
  // GET: Order by id
  // Guests must provide the lookup token returned when the order is created.
  getById: async (id: number, token?: string | null): Promise<Order> => {
    const { data } = await axiosClient.get<Order>(`public/orders/${id}`, {
      params: token ? { token } : undefined,
    })
    return data
  },
}
