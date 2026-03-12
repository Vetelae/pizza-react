import axiosClient from './axiosClient'
import type { MenuItem } from '../types/menuItem'

export const menuItemsApi = {
    getAll: async (): Promise<MenuItem[]> => {
        const { data } = await axiosClient.get<MenuItem[]>('/public/menuitems')
        return data
    },
    getById: async (id: number): Promise<MenuItem> => {
        const { data } = await axiosClient.get<MenuItem>(`/public/menuitems/${id}`)
        return data
    },
}