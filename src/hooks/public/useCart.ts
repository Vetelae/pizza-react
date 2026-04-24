import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AddCartItemDto, UpdateCartItemDto, CheckoutDto } from '@/types/cart'
import { cartApi } from '@/api/public/cartApi'

export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: cartApi.getCart,
        staleTime: 1000 * 60 * 5,
    })
}

export const useAddCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: AddCartItemDto) => cartApi.addItem(dto),
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart)
        },
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ cartItemId, dto }: { cartItemId: number; dto: UpdateCartItemDto }) =>
            cartApi.updateItem(cartItemId, dto),
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart)
        },
    })
}

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart)
        },
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.setQueryData(['cart'], { items: [], totalPrice: 0 })
        },
    })
}

export const useCheckout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: CheckoutDto) => cartApi.checkout(dto),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['cart'] })
        },
    })
}