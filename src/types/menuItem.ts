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

export type MenuItemImageUploadResponse = {
  imagePath: string
}

export type MenuItemCreate = Omit<MenuItem, 'id' | 'category'>