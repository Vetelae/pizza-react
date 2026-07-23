import {
  OrderType,
  PaymentMethod,
} from '@/types/enums'
import type {
  OrderStatusName,
  OrderTypeName,
  PaymentMethodName,
} from '@/types/enums'

export { normalizeOrderStatus } from '@/utils/orderStatus'

type EnumMap = Record<string, number>

export const ACTIVE_ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
] as const satisfies readonly OrderStatusName[]

export type ActiveOrderStatus = typeof ACTIVE_ORDER_STATUSES[number]

export interface OrderStatusConfig {
  label: string
  actionLabel: string
  nextStatus: OrderStatusName | null
  dotClass: string
  borderClass: string
  badgeClass: string
  buttonClass: string
}

export const ORDER_STATUS_CONFIG: Record<OrderStatusName, OrderStatusConfig> = {
  Pending: {
    label: 'Pending',
    actionLabel: 'Confirm',
    nextStatus: 'Confirmed',
    dotClass: 'bg-amber-400',
    borderClass: 'border-l-amber-400',
    badgeClass: 'bg-amber-100 text-amber-900',
    buttonClass: 'bg-amber-500 text-gray-950 hover:bg-amber-400',
  },
  Confirmed: {
    label: 'Confirmed',
    actionLabel: 'Start preparing',
    nextStatus: 'Preparing',
    dotClass: 'bg-sky-400',
    borderClass: 'border-l-sky-400',
    badgeClass: 'bg-sky-100 text-sky-900',
    buttonClass: 'bg-sky-500 text-white hover:bg-sky-400',
  },
  Preparing: {
    label: 'Preparing',
    actionLabel: 'Mark ready',
    nextStatus: 'Ready',
    dotClass: 'bg-orange',
    borderClass: 'border-l-orange',
    badgeClass: 'bg-orange/20 text-amber-900',
    buttonClass: 'bg-orange text-gray-950 hover:brightness-110',
  },
  Ready: {
    label: 'Ready',
    actionLabel: 'Complete',
    nextStatus: 'Completed',
    dotClass: 'bg-emerald-400',
    borderClass: 'border-l-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-900',
    buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-500',
  },
  Completed: {
    label: 'Completed',
    actionLabel: '',
    nextStatus: null,
    dotClass: 'bg-emerald-500',
    borderClass: 'border-l-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-900',
    buttonClass: '',
  },
  Cancelled: {
    label: 'Cancelled',
    actionLabel: '',
    nextStatus: null,
    dotClass: 'bg-rose-500',
    borderClass: 'border-l-rose-500',
    badgeClass: 'bg-rose-100 text-rose-900',
    buttonClass: '',
  },
}

const normalizeEnumName = <T extends EnumMap>(
  value: number | string,
  enumMap: T
): keyof T | null => {
  if (typeof value === 'string' && value in enumMap) {
    return value as keyof T
  }

  const entry = Object.entries(enumMap).find(([, enumValue]) => enumValue === value)
  return entry ? entry[0] : null
}

export const normalizeOrderType = (
  value: number | string
): OrderTypeName | null =>
  normalizeEnumName(value, OrderType) as OrderTypeName | null

export const normalizePaymentMethod = (
  value: number | string
): PaymentMethodName | null =>
  normalizeEnumName(value, PaymentMethod) as PaymentMethodName | null

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value))

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatElapsedTime = (value: string, now: number) => {
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return 'Unknown'

  const totalMinutes = Math.max(0, Math.floor((now - timestamp) / 60_000))
  const days = Math.floor(totalMinutes / 1_440)
  const hours = Math.floor((totalMinutes % 1_440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
