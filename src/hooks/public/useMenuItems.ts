import { menuItemsApi } from '@/api/public/menuItemsApi'
import { useQuery } from '@tanstack/react-query'

const STALE_TIME = 1000 * 60 * 5

export const useMenuItems = () => {
    return useQuery({
        queryKey: ['menuItems'],
        queryFn: menuItemsApi.getAll,
        staleTime: STALE_TIME,
    })
}

export const useMenuItemById = (id: number) => {
    return useQuery({
        queryKey: ['menuItems', id],
        queryFn: () => menuItemsApi.getById(id),
        staleTime: STALE_TIME,
    })
}
