import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../api/public/categoriesApi'

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