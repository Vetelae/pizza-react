import type { MenuItem } from './menuItem'

export interface Category {
    id: number;
    name: string;
    menuItems: MenuItem[];
}

export type CategoryCreate = Omit<Category, 'id' | 'menuItems'>