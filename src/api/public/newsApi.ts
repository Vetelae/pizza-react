import axiosClient from '../axiosClient'
import type { News } from '../../types/news'

export const newsApi = {
    // GET all news
    getAll: async (): Promise<News[]> => {
        const { data } = await axiosClient.get<News[]>('public/news')
        return data
    },
    // GET news by id
    getById: async (id: number): Promise<News> => {
        const { data } = await axiosClient.get<News>(`public/news/${id}`)
        return data
    },
}