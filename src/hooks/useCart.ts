import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../api/public/cartApi'
import type { AddCartItemDto, UpdateCartItemDto, CheckoutDto } from '@/types/cart'

export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: cartApi.getCart,
    })
}

export const useAddCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: AddCartItemDto) => cartApi.addItem(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ cartItemId, dto }: { cartItemId: number; dto: UpdateCartItemDto }) =>
            cartApi.updateItem(cartItemId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
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