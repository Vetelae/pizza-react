import type { MenuItem } from './menuItem';
import type { Cart } from './cart';

export interface CartItem {
    id: number;
    quantity: number;
    unitPrice: number;
    menuItemId: number;
    menuItem: MenuItem;
    cartId: number;
    cart: Cart;
    notes: string | null;
}

export type CartItemCreate = Omit<CartItem, 'id' | 'menuItem' | 'cart'>