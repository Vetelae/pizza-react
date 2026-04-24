import type { Category } from './category'

export interface MenuItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    isAvailable: boolean;
    categoryId: number;
    category: Category;
    imagePath: string | null;
    imageFileName: string | null;
}

// API DTOs
export interface CreateMenuItemDto {
    name: string
    description?: string | null
    price: number
    isAvailable: boolean
    categoryId: number
    imagePath?: string | null
    imageFileName?: string | null
}

export interface UpdateMenuItemDto {
    name: string
    description?: string | null
    price: number
    isAvailable: boolean
    categoryId: number
}

export type MenuItemImageUploadResponse = {
  imagePath: string
}