import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi'
import type { OrderCard } from '@/types/order'
import type { OrderStatusName } from '@/types/enums'
import {
  formatCurrency,
  formatElapsedTime,
  normalizeOrderStatus,
  normalizeOrderType,
  ORDER_STATUS_CONFIG,
} from './orderMonitoringUtils'

interface OrderMonitoringCardProps {
  order: OrderCard
  now: number
  isUpdating: boolean
  onOpen: (orderId: number) => void
  onAdvance: (orderId: number, status: OrderStatusName) => void
}

export default function OrderMonitoringCard({
  order,
  now,
  isUpdating,
  onOpen,
  onAdvance,
}: OrderMonitoringCardProps) {
  const status = normalizeOrderStatus(order.status) ?? 'Pending'
  const type = normalizeOrderType(order.type)
  const config = ORDER_STATUS_CONFIG[status]

  const openOrder = () => onOpen(order.id)

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open order ${order.id}`}
      onClick={openOrder}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openOrder()
        }
      }}
      className={`border-l-4 ${config.borderClass} cursor-pointer rounded-md border-y border-r border-gray-200 bg-white p-4 text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:border-r-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-gray-950">Order #{order.id}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
            <FiUser aria-hidden="true" />
            <span className="truncate">{order.customerName}</span>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
          <FiClock aria-hidden="true" />
          {formatElapsedTime(order.createdAt, now)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-gray-100 py-3 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          {type === 'Delivery' ? <FiMapPin aria-hidden="true" /> : <FiShoppingBag aria-hidden="true" />}
          {type ?? 'Unknown'}
        </span>
        <span className="text-right font-semibold text-gray-900">
          {formatCurrency(order.totalAmount)}
        </span>
        <span className="col-span-2 text-xs text-gray-500">
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {config.nextStatus && (
        <button
          type="button"
          disabled={isUpdating}
          onClick={(event) => {
            event.stopPropagation()
            onAdvance(order.id, config.nextStatus!)
          }}
          className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${config.buttonClass}`}
        >
          {isUpdating ? 'Updating...' : config.actionLabel}
          {!isUpdating && <FiArrowRight aria-hidden="true" />}
        </button>
      )}
    </article>
  )
}
