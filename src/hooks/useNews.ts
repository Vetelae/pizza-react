import { useQuery } from '@tanstack/react-query'
import { newsApi } from '../api/public/newsApi'

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