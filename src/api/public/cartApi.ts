import axiosClient from '@/api/axiosClient'
import type { OrderDto } from '@/types/order'
import type { AddCartItemDto, CartDto, CheckoutDto, UpdateCartItemDto } from '@/types/cart'

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

const cartHeaders = () => ({
  'X-Session-Id': getSessionId(),
})

export const cartApi = {
  getCart: async (): Promise<CartDto> => {
    const { data } = await axiosClient.get<CartDto>('cart', { headers: cartHeaders() })
    return data
  },

  addItem: async (dto: AddCartItemDto): Promise<CartDto> => {
    const { data } = await axiosClient.post<CartDto>('cart/items', dto, { headers: cartHeaders() })
    return data
  },

  updateItem: async (cartItemId: number, dto: UpdateCartItemDto): Promise<CartDto> => {
    const { data } = await axiosClient.put<CartDto>(`cart/items/${cartItemId}`, dto, { headers: cartHeaders() })
    return data
  },

  removeItem: async (cartItemId: number): Promise<CartDto> => {
    const { data } = await axiosClient.delete<CartDto>(`cart/items/${cartItemId}`, { headers: cartHeaders() })
    return data
  },

  clearCart: async (): Promise<void> => {
    await axiosClient.delete('cart', { headers: cartHeaders() })
  },

  checkout: async (dto: CheckoutDto): Promise<OrderDto> => {
    const { data } = await axiosClient.post<OrderDto>('cart/checkout', dto, { headers: cartHeaders() })
    return data
  },
}