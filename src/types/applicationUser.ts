import type { Cart } from './cart';
import type { Order } from './order';

export interface ApplicationUser {
    // From IdentityUser
    id: string;
    userName: string | null;
    email: string | null;
    phoneNumber: string | null;
    emailConfirmed: boolean;

    // Custom fields
    firstName: string;
    lastName: string;

    // Navigation
    cart: Cart | null;
    orders: Order[];
}