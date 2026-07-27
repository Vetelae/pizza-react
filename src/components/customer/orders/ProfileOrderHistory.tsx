import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileOrderDetailsModal from '@/components/customer/orders/ProfileOrderDetailsModal'
import OrderConnectionIndicator from '@/components/customer/orders/OrderConnectionIndicator'
import { useCustomerOrderConnection } from '@/hooks/customer/useCustomerOrderConnection'
import { useUserOrders } from '@/hooks/user/useUserOrder'
import { OrderStatus, OrderType } from '@/types/enums'
import type { Order } from '@/types/order'
import { isTerminalOrderStatus } from '@/utils/orderStatus'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

type EnumMap = Record<string, number>

const normalizeEnumValue = <T extends EnumMap>(
  value: number | string,
  enumMap: T
): keyof T | null => {
  if (typeof value === 'string' && value in enumMap) {
    return value as keyof T
  }

  const entry = Object.entries(enumMap).find(([, enumValue]) => enumValue === value)
  return entry ? entry[0] : null
}

const statusLabels: Record<keyof typeof OrderStatus, string> = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Preparing: 'Preparing',
  Ready: 'Ready',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
}

const statusStyles: Record<keyof typeof OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-sky-100 text-sky-800',
  Preparing: 'bg-orange/20 text-orange',
  Ready: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
}

const typeLabels: Record<keyof typeof OrderType, string> = {
  Pickup: 'Pickup',
  Delivery: 'Delivery',
}

const getStatusLabel = (status: number | string) => {
  const statusKey = normalizeEnumValue(status, OrderStatus)
  return statusKey ? statusLabels[statusKey] : 'Unknown'
}

const getStatusStyle = (status: number | string) => {
  const statusKey = normalizeEnumValue(status, OrderStatus)
  return statusKey ? statusStyles[statusKey] : 'bg-zinc-100 text-zinc-800'
}

const getTypeLabel = (type: number | string) => {
  const typeKey = normalizeEnumValue(type, OrderType)
  return typeKey ? typeLabels[typeKey] : 'Unknown'
}

const getOrderSummary = (order: Order) => {
  if (!order.items.length) {
    return 'No items listed'
  }

  const visibleItems = order.items.slice(0, 2).map((item) => {
    const itemName = item.menuItem?.name ?? item.menuItemName ?? `Item #${item.menuItemId}`
    return `${itemName} x${item.quantity}`
  })

  const hiddenItems = order.items.length - visibleItems.length

  return hiddenItems > 0
    ? `${visibleItems.join(', ')} +${hiddenItems} more`
    : visibleItems.join(', ')
}

export default function ProfileOrderHistory() {
  const ordersQuery = useUserOrders()
  const { data: orders, isLoading, isError } = ordersQuery
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const hasActiveOrders =
    !orders || orders.some(order => !isTerminalOrderStatus(order.status))
  const connectionStatus = useCustomerOrderConnection({
    enabled: true,
    snapshotReady: ordersQuery.isFetched,
    hasActiveOrders,
  })

  const sortedOrders = useMemo(
    () =>
      [...(orders ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  )

  return (
    <section className="mt-10 border-t border-gray-700 pt-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-orange">Order history</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Your previous orders and their latest statuses.
          </p>
        </div>

        {sortedOrders.length > 0 && (
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-sm text-zinc-400">
              {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'}
            </p>
            {hasActiveOrders && (
              <OrderConnectionIndicator status={connectionStatus} />
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <p className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-zinc-300">
          Loading your orders...
        </p>
      )}

      {isError && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          Could not load your order history.
        </p>
      )}

      {!isLoading && !isError && sortedOrders.length === 0 && (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <p className="text-sm text-zinc-300">You have not placed any orders yet.</p>
          <Link
            to="/menu"
            className="mt-4 inline-flex rounded-lg bg-orange px-4 py-2 text-sm font-bold text-gray-900 transition-all hover:brightness-110"
          >
            Browse menu
          </Link>
        </div>
      )}

      {sortedOrders.length > 0 && (
        <div className="space-y-3">
          {sortedOrders.map((order) => {
            const orderTotal = Number(order.totalAmount ?? 0)

            return (
              <article
                key={order.id}
                className="rounded-lg border border-gray-700 bg-gray-800 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-zinc-400">
                      Placed on {formatDateTime(order.createdAt)}
                    </p>
                    <p className="mt-3 text-sm text-zinc-300">{getOrderSummary(order)}</p>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-zinc-400">{getTypeLabel(order.type)}</p>
                      <p className="mt-1 text-lg font-bold text-zinc-100">
                        {formatCurrency(orderTotal)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className="rounded-lg border border-orange px-4 py-2 text-sm font-bold text-orange transition-colors hover:bg-orange hover:text-gray-900"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <ProfileOrderDetailsModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </section>
  )
}
