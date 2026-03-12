import type { CartItem } from './cartItem';
import type { ApplicationUser } from './applicationUser';

export interface Cart {
    id: number;
    userId: string | null;
    sessionId: string | null;
    createdAt: string;
    updatedAt: string;
    user: ApplicationUser | null;
    cartItems: CartItem[];
}

export type CartCreate = Omit<Cart, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'cartItems'>