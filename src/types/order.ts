import type { ApplicationUser } from './applicationUser'
import type { OrderItem, CreateOrderItemDto } from './orderItem'
import { OrderType, OrderStatus, PaymentMethod } from './enums'
import type { OrderStatusName } from './enums'

export interface Order {
    id: number;
    createdAt: string;
    statusChangedAt: string;
    confirmedAt?: string | null;
    preparingAt?: string | null;
    readyAt?: string | null;
    completedAt?: string | null;
    cancelledAt?: string | null;
    lookupToken?: string | null;
    userId: string | null;
    user?: ApplicationUser | null;
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

export interface OrderCard {
    id: number;
    createdAt: string;
    statusChangedAt: string;
    customerName: string;
    type: OrderType | keyof typeof OrderType;
    status: OrderStatus | keyof typeof OrderStatus;
    itemCount: number;
    totalAmount: number;
}

export interface OrderStatusChangedEvent {
    orderId: number;
    oldStatus: OrderStatusName;
    newStatus: OrderStatusName;
    changedAt: string;
    order: OrderCard;
}

export interface CustomerOrderStatusChanged {
    orderId: number;
    oldStatus: OrderStatusName;
    newStatus: OrderStatusName;
    changedAt: string;
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

export interface UpdateOrderStatusDto {
    status: OrderStatusName;
}
