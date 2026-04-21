import axiosClient from '../axiosClient'
import type { Category, CategoryImageUploadResponse, CreateCategoryDto, UpdateCategoryDto } from '../../types/category'

export const adminCategoryApi = {
    // CREATE category
    createCategory: async (dto: CreateCategoryDto): Promise<Category> => {
        const { data } = await axiosClient.post<Category>('admin/categories', dto)
        return data
    },
    // UPDATE category
    updateCategory: async (id: number, dto: UpdateCategoryDto): Promise<Category> => {
        const { data } = await axiosClient.put<Category>(`admin/categories/${id}`, dto)
        return data
    },
    // UPLOAD category image
    uploadCategoryImage: async (id: number, file: File): Promise<CategoryImageUploadResponse> => {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await axiosClient.post<CategoryImageUploadResponse>(
            `admin/categories/${id}/upload-image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return data
    },
    // DELETE category
    deleteCategory: async (id: number): Promise<void> => {
        await axiosClient.delete(`admin/categories/${id}`)
    }
}