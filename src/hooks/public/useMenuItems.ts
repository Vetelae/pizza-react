import { menuItemsApi } from '@/api/public/menuItemsApi'
import { useQuery } from '@tanstack/react-query'

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