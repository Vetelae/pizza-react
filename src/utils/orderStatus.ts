import { OrderStatus } from '@/types/enums'
import type { OrderStatusName } from '@/types/enums'

export const normalizeOrderStatus = (
  status: number | string | null | undefined
): OrderStatusName | null => {
  if (typeof status === 'string' && status in OrderStatus) {
    return status as OrderStatusName
  }

  const entry = Object.entries(OrderStatus).find(([, value]) => value === status)
  return entry ? (entry[0] as OrderStatusName) : null
}

export const isTerminalOrderStatus = (
  status: number | string | null | undefined
) => {
  const normalizedStatus = normalizeOrderStatus(status)
  return normalizedStatus === 'Completed' || normalizedStatus === 'Cancelled'
}
