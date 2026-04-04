import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminMenuItemApi } from '@/api/admin/adminMenuItemApi'
import type { MenuItemCreate } from '@/types/menuItem'

// useCreateMenuItem
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminMenuItemApi.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    },
  })
}

// useUpdateMenuItem
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: MenuItemCreate }) =>
      adminMenuItemApi.updateMenuItem(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    },
  })
}

// useUploadMenuItemImage
export const useUploadMenuItemImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      adminMenuItemApi.uploadMenuItemImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    },
  })
}

// useDeleteMenuItem
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminMenuItemApi.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    },
  })
}