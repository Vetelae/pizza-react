import { useMemo, useState } from 'react'
import type { OrderCard } from '@/types/order'
import type { OrderStatusName } from '@/types/enums'
import OrderMonitoringColumn from './OrderMonitoringColumn'
import {
  ACTIVE_ORDER_STATUSES,
  type ActiveOrderStatus,
  normalizeOrderStatus,
  ORDER_STATUS_CONFIG,
} from './orderMonitoringUtils'

interface OrderMonitoringBoardProps {
  orders: OrderCard[]
  now: number
  updatingOrderId: number | null
  onOpen: (orderId: number) => void
  onAdvance: (orderId: number, status: OrderStatusName) => void
}

export default function OrderMonitoringBoard({
  orders,
  now,
  updatingOrderId,
  onOpen,
  onAdvance,
}: OrderMonitoringBoardProps) {
  const [activeStatus, setActiveStatus] = useState<ActiveOrderStatus>('Pending')

  const ordersByStatus = useMemo(
    () =>
      ACTIVE_ORDER_STATUSES.reduce<Record<ActiveOrderStatus, OrderCard[]>>(
        (groupedOrders, status) => {
          groupedOrders[status] = orders.filter(
            (order) => normalizeOrderStatus(order.status) === status
          )
          return groupedOrders
        },
        {
          Pending: [],
          Confirmed: [],
          Preparing: [],
          Ready: [],
        }
      ),
    [orders]
  )

  return (
    <>
      <div
        className="mb-3 grid grid-cols-2 gap-2 lg:hidden"
        role="tablist"
        aria-label="Order statuses"
      >
        {ACTIVE_ORDER_STATUSES.map((status) => {
          const config = ORDER_STATUS_CONFIG[status]
          const isActive = activeStatus === status

          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStatus(status)}
              className={`flex h-11 items-center justify-between rounded border px-3 text-sm font-semibold transition ${
                isActive
                  ? 'border-orange bg-gray-700 text-white'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                {config.label}
              </span>
              <span className="text-xs">{ordersByStatus[status].length}</span>
            </button>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-md border border-gray-700 lg:hidden">
        <OrderMonitoringColumn
          status={activeStatus}
          orders={ordersByStatus[activeStatus]}
          now={now}
          updatingOrderId={updatingOrderId}
          onOpen={onOpen}
          onAdvance={onAdvance}
        />
      </div>

      <div className="hidden overflow-hidden rounded-md border border-gray-700 lg:grid lg:grid-cols-4 lg:divide-x lg:divide-gray-700">
        {ACTIVE_ORDER_STATUSES.map((status) => (
          <OrderMonitoringColumn
            key={status}
            status={status}
            orders={ordersByStatus[status]}
            now={now}
            updatingOrderId={updatingOrderId}
            onOpen={onOpen}
            onAdvance={onAdvance}
          />
        ))}
      </div>
    </>
  )
}
