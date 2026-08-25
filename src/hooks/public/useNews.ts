import { newsApi } from '@/api/public/newsApi'
import { useQuery } from '@tanstack/react-query'

const STALE_TIME = 1000 * 60 * 5

export const useNews = () => {
    return useQuery({
        queryKey: ['news'],
        queryFn: newsApi.getAll,
        staleTime: STALE_TIME,
    })
}

export const useNewsById = (id: number) => {
    return useQuery({
        queryKey: ['news', id],
        queryFn: () => newsApi.getById(id),
        staleTime: STALE_TIME,
    })
}
