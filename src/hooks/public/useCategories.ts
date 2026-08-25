import { categoriesApi } from '@/api/public/categoriesApi'
import { useQuery } from '@tanstack/react-query'

const STALE_TIME = 1000 * 60 * 5

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
        staleTime: STALE_TIME,
    })
}

export const useCategoryById = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => categoriesApi.getById(id),
        staleTime: STALE_TIME,
    })
}
