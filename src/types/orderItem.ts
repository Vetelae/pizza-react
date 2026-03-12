import type { MenuItem } from './menuItem'
import type { Order } from './order'

export interface OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    menuItemId: number;
    menuItem: MenuItem;
    orderId: number;
    order: Order;
}

export type OrderItemCreate = Omit<OrderItem, 'id' | 'menuItem' | 'order'>