import axiosClient from '../axiosClient'
import type { Category } from '../../types/category'

export const categoriesApi = {
    // GET all categories
    getAll: async (): Promise<Category[]> => {
        const { data } = await axiosClient.get<Category[]>('/public/categories')
        return data
    },
    // GET category by id
    getById: async (id: number): Promise<Category> => {
        const { data } = await axiosClient.get<Category>(`/public/categories/${id}`)
        return data
    },
}