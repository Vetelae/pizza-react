import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminNewsApi } from '@/api/admin/adminNewsApi'
import type { NewsUpdate } from '@/types/news'

// useCreateNews
export const useCreateNews = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: adminNewsApi.createNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] })
        },
    })
}

// useUpdateNews
export const useUpdateNews = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, dto }: { id: number, dto: NewsUpdate }) =>
            adminNewsApi.updateNews(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] })
        },
    })
}

// useDeleteNews
export const useDeleteNews = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: adminNewsApi.deleteNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] })
        },
    })
}