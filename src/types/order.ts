import type { ApplicationUser } from './applicationUser'
import type { OrderItem, CreateOrderItemDto } from './orderItem'
import { OrderType, OrderStatus, PaymentMethod } from './enums'

export interface Order {
    id: number;
    createdAt: string;
    lookupToken?: string | null;
    userId: string | null;
    user: ApplicationUser | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    type: OrderType | keyof typeof OrderType;
    status: OrderStatus | keyof typeof OrderStatus;
    paymentMethod: PaymentMethod | keyof typeof PaymentMethod;
    totalAmount: number;
    notes: string | null;
    items: OrderItem[];
}

export interface CreateOrderDto {
    customerName: string
    customerEmail: string
    customerPhone: string
    deliveryAddress: string | null
    type: OrderType
    paymentMethod: PaymentMethod
    notes: string | null
    items: CreateOrderItemDto[]
}

export interface UpdateOrderDto {
    status?: OrderStatus
    notes?: string | null
}
