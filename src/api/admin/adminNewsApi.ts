import axiosClient from '../axiosClient'
import type { News, NewsCreate, NewsUpdate } from '../../types/news'

export const adminNewsApi = {
    // CREATE news
    createNews: async (dto: NewsCreate): Promise<News> => {
    const { data } = await axiosClient.post<News>('admin/news', dto)
    return data
},
    // UPDATE news
    updateNews: async (id: number, dto: NewsUpdate): Promise<News> => {
    const { data } = await axiosClient.put<News>(`admin/news/${id}`, dto)
    return data
},
    // DELETE news
    deleteNews: async (id: number): Promise<void> => {
    await axiosClient.delete(`admin/news/${id}`)
}
}