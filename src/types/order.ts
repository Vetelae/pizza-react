import type { ApplicationUser } from './applicationUser'
import type { OrderItem } from './orderItem'
import { OrderType, OrderStatus, PaymentMethod } from './enums'

export interface Order {
    id: number;
    createdAt: string;
    userId: string | null;
    user: ApplicationUser | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    type: OrderType;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    notes: string | null;
    items: OrderItem[];
}

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'user' | 'items'>