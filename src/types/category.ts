import type { MenuItem } from './menuItem'

export interface Category {
    id: number
    name: string
    imagePath: string
    imageFileName: string
    menuItems?: MenuItem[]
}

// API DTOs
export interface CreateCategoryDto {
    name: string
}

export interface UpdateCategoryDto {
    name: string
}

export interface CategoryImageUploadResponse {
    imagePath: string
}