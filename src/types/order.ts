import type { ApplicationUser } from './applicationUser'
import type { OrderItem, OrderItemDto } from './orderItem'
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

export interface OrderDto {
    id: number
    createdAt: string
    customerName: string
    customerEmail: string
    customerPhone: string
    deliveryAddress: string | null
    type: OrderType
    status: OrderStatus
    paymentMethod: PaymentMethod
    totalAmount: number
    notes: string | null
    userId: string | null
    items: OrderItemDto[]
}