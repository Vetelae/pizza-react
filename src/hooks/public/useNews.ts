import { newsApi } from '@/api/public/newsApi'
import { useQuery } from '@tanstack/react-query'

export const useNews = () => {
    return useQuery({
        queryKey: ['news'],
        queryFn: newsApi.getAll,
    })
}

export const useNewsById = (id: number) => {
    return useQuery({
        queryKey: ['news', id],
        queryFn: () => newsApi.getById(id),
    })
}