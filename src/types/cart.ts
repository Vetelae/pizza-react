import type { CartItem } from './cartItem';
import type { ApplicationUser } from './applicationUser';
import type { OrderType, PaymentMethod } from './enums';

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

// DTOs (API shape)
export interface CartItemDto {
  id: number
  menuItemId: number
  menuItemName: string
  unitPrice: number
  quantity: number
  notes: string | null
  total: number
}

export interface CartDto {
  id: number
  userId: string | null
  sessionId: string | null
  createdAt: string
  updatedAt: string
  items: CartItemDto[]
  totalItems: number
  subtotal: number
}

export interface AddCartItemDto {
  menuItemId: number
  quantity: number
  notes?: string | null
}

export interface UpdateCartItemDto {
  quantity: number
  notes?: string | null
}

export interface CheckoutDto {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress?: string | null
  type: OrderType
  paymentMethod: PaymentMethod
  notes?: string | null
}