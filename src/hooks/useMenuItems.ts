import { useQuery } from '@tanstack/react-query'
import { menuItemsApi } from '../api/public/menuItemsApi'

export const useMenuItems = () => {
    return useQuery({
        queryKey: ['menuItems'],
        queryFn: menuItemsApi.getAll,
    })
}

export const useMenuItemById = (id: number) => {
    return useQuery({
        queryKey: ['menuItems', id],
        queryFn: () => menuItemsApi.getById(id),
    })
}