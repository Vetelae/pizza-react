import type { MenuItem } from './menuItem'
import type { Order } from './order'

export interface OrderItem {
    id?: number;
    quantity: number;
    unitPrice?: number;
    menuItemId: number;
    menuItem?: MenuItem | null;
    menuItemName?: string;
    menuItemValue?: number;
    orderId?: number;
    order?: Order;
}

// DTO (API shape)
export interface OrderItemDto {
    menuItemId: number
    menuItemName: string
    menuItemValue: number
    quantity: number
}
