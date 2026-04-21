import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminCategoryApi } from '@/api/admin/adminCategoryApi'
import type { UpdateCategoryDto } from '@/types/category'

// useCreateCategory
export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: adminCategoryApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

// useUpdateCategory
export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, dto }: { id: number, dto: UpdateCategoryDto }) =>
            adminCategoryApi.updateCategory(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

// useUploadCategoryImage
export const useUploadCategoryImage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, file }: { id: number, file: File }) =>
            adminCategoryApi.uploadCategoryImage(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

// useDeleteCategory
export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: adminCategoryApi.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}