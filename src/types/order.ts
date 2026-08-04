import type { ApplicationUser } from './applicationUser'
import type { OrderItem } from './orderItem'
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

export const OrderHistoryPeriod = {
    Today: 'Today',
    Yesterday: 'Yesterday',
    Last7Days: 'Last7Days',
    Last30Days: 'Last30Days',
    ThisMonth: 'ThisMonth',
    LastMonth: 'LastMonth',
    Custom: 'Custom',
} as const

export type OrderHistoryPeriod =
    typeof OrderHistoryPeriod[keyof typeof OrderHistoryPeriod]

export type OrderHistoryStatus = 'Completed' | 'Cancelled'

export interface OrderHistoryQuery {
    page: number;
    pageSize: 20 | 50 | 100;
    period: OrderHistoryPeriod;
    fromDate?: string;
    toDate?: string;
    status?: OrderHistoryStatus;
    search?: string;
}

export interface OrderHistoryItem {
    id: number;
    createdAt: string;
    customerName: string;
    customerPhone: string;
    status: OrderStatus | keyof typeof OrderStatus;
    type: OrderType | keyof typeof OrderType;
    itemCount: number;
    totalAmount: number;
}

export interface OrderHistoryResponse {
    items: OrderHistoryItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
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

export interface UpdateOrderDto {
    status?: OrderStatus
    notes?: string | null
}

export interface UpdateOrderStatusDto {
    status: OrderStatusName;
}
