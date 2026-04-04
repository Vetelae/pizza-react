import axiosClient from '../axiosClient'
import type { MenuItem, MenuItemCreate, MenuItemImageUploadResponse } from '../../types/menuItem'

export const adminMenuItemApi = {
  // CREATE menu item
  createMenuItem: async (dto: MenuItemCreate): Promise<MenuItem> => {
    const { data } = await axiosClient.post<MenuItem>('admin/menuitems', dto)
    return data
  },

  // UPDATE menu item
  updateMenuItem: async (id: number, dto: MenuItemCreate): Promise<MenuItem> => {
    const { data } = await axiosClient.put<MenuItem>(`admin/menuitems/${id}`, dto)
    return data
  },

  // UPLOAD menu item image
  uploadMenuItemImage: async (id: number, file: File): Promise<MenuItemImageUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosClient.post<MenuItemImageUploadResponse>(
      `admin/menuitems/${id}/upload-image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  },

  // DELETE menu item
  deleteMenuItem: async (id: number): Promise<void> => {
    await axiosClient.delete(`admin/menuitems/${id}`)
  },
}