// enums.ts
export const OrderType = {
    Delivery: 0,
    Pickup: 1,
} as const
export type OrderType = typeof OrderType[keyof typeof OrderType]

export const OrderStatus = {
    Pending: 0,
    Confirmed: 1,
    Preparing: 2,
    OutForDelivery: 3,
    Delivered: 4,
    Cancelled: 5,
} as const
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export const PaymentMethod = {
    Cash: 0,
    Card: 1,
} as const
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]