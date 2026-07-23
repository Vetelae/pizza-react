import type { OrderCard } from '@/types/order'
import type { OrderStatusName } from '@/types/enums'
import OrderMonitoringCard from './OrderMonitoringCard'
import {
  type ActiveOrderStatus,
  ORDER_STATUS_CONFIG,
} from './orderMonitoringUtils'

interface OrderMonitoringColumnProps {
  status: ActiveOrderStatus
  orders: OrderCard[]
  now: number
  updatingOrderId: number | null
  onOpen: (orderId: number) => void
  onAdvance: (orderId: number, status: OrderStatusName) => void
}

export default function OrderMonitoringColumn({
  status,
  orders,
  now,
  updatingOrderId,
  onOpen,
  onAdvance,
}: OrderMonitoringColumnProps) {
  const config = ORDER_STATUS_CONFIG[status]

  return (
    <section
      aria-labelledby={`order-column-${status}`}
      className="min-w-0 bg-gray-800/70"
    >
      <header className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
        <h2
          id={`order-column-${status}`}
          className="flex items-center gap-2 text-sm font-bold text-white"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
          {config.label}
        </h2>
        <span className="min-w-7 rounded bg-gray-700 px-2 py-1 text-center text-xs font-bold text-gray-200">
          {orders.length}
        </span>
      </header>

      <div className="min-h-52 space-y-3 p-3">
        {orders.length === 0 ? (
          <div className="flex min-h-36 items-center justify-center border border-dashed border-gray-700 px-4 text-center text-sm text-gray-500">
            No {config.label.toLowerCase()} orders
          </div>
        ) : (
          orders.map((order) => (
            <OrderMonitoringCard
              key={order.id}
              order={order}
              now={now}
              isUpdating={updatingOrderId === order.id}
              onOpen={onOpen}
              onAdvance={onAdvance}
            />
          ))
        )}
      </div>
    </section>
  )
}
