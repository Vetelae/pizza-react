import type { MenuItem } from './menuItem'

export interface Category {
    id: number
    name: string
    imagePath: string
    imageFileName: string
    menuItems?: MenuItem[]
}

export interface CategoryImageUploadResponse {
    imagePath: string
}

export type CategoryCreate = Omit<Category, 'id' | 'menuItems'>
export type CategoryUpdate = CategoryCreate