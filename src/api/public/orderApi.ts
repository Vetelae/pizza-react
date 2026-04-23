import axiosClient from '../axiosClient'
import type { Order, CreateOrderDto } from '../../types/order'

export const orderApi = {
    // GET: Order by id
    // NOTE: Currently public — anyone with an id can track any order.
    // TODO (backend): Add a short-lived lookup token (returned on creation)
    //   and require it here: GET public/orders/{id}?token={token}
    getById: async (id: number): Promise<Order> => {
        const { data } = await axiosClient.get<Order>(`public/orders/${id}`)
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