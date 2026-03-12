import axiosClient from './axiosClient'
import type { News } from '../types/news'

export const newsApi = {
    // GET all news
    getAll: async (): Promise<News[]> => {
        const { data } = await axiosClient.get<News[]>('/news')
        return data
    },
    // GET news by id
    getById: async (id: number): Promise<News> => {
        const { data } = await axiosClient.get<News>(`/news/${id}`)
        return data
    },
}