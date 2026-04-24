import { categoriesApi } from '@/api/public/categoriesApi'
import { useQuery } from '@tanstack/react-query'

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
    })
}

export const useCategoryById = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => categoriesApi.getById(id),
    })
}