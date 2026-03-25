import type { MenuItem } from './menuItem'

export interface Category {
    id: number
    name: string
    imagePath: string
    imageFileName: string
    menuItems?: MenuItem[]
}

export type CategoryCreate = Omit<Category, 'id' | 'menuItems'>