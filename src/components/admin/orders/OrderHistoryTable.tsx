import { FiAlertTriangle, FiEye, FiRefreshCw } from 'react-icons/fi'
import type { OrderHistoryItem } from '@/types/order'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import {
  normalizeOrderStatus,
  normalizeOrderType,
  ORDER_STATUS_CONFIG,
} from './orderMonitoringUtils'

interface OrderHistoryTableProps {
  orders: OrderHistoryItem[]
  isLoading: boolean
  isError: boolean
  emptyMessage: string
  onOpen: (orderId: number) => void
  onRetry: () => void
}

const getOrderStatus = (order: OrderHistoryItem) =>
  normalizeOrderStatus(order.status)

const getOrderType = (order: OrderHistoryItem) =>
  normalizeOrderType(order.type) ?? 'Unknown'

function StatusBadge({ order }: { order: OrderHistoryItem }) {
  const status = getOrderStatus(order)

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-bold ${
        status
          ? ORDER_STATUS_CONFIG[status].badgeClass
          : 'bg-gray-700 text-gray-300'
      }`}
    >
      {status ?? 'Unknown'}
    </span>
  )
}

export default function OrderHistoryTable({
  orders,
  isLoading,
  isError,
  emptyMessage,
  onOpen,
  onRetry,
}: OrderHistoryTableProps) {
  if (isLoading) return <OrderHistorySkeleton />

  if (isError) {
    return (
      <div
        className="border border-red-800 bg-gray-800 px-5 py-10 text-center"
        role="alert"
      >
        <FiAlertTriangle
          className="mx-auto text-red-400"
          size={28}
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-semibold text-white">
          Order history could not be loaded.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
        >
          <FiRefreshCw aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 bg-gray-800/70 px-5 py-10 text-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-md border border-gray-700 bg-gray-800 md:block">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-900/60">
            <tr>
              {['Order', 'Placed', 'Customer', 'Type', 'Status', 'Items', 'Total'].map(
                (heading) => (
                  <th
                    key={heading}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 ${
                      heading === 'Items' || heading === 'Total'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {heading}
                  </th>
                )
              )}
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-gray-700/50"
              >
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">
                  #{order.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{order.customerName}</p>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-gray-400">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-300">{getOrderType(order)}</td>
                <td className="px-4 py-3">
                  <StatusBadge order={order} />
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  {order.itemCount}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-white">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onOpen(order.id)}
                    className="inline-flex items-center gap-1.5 rounded border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white"
                  >
                    <FiEye aria-hidden="true" />
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-md border border-gray-700 bg-gray-800 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-white">Order #{order.id}</h2>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <StatusBadge order={order} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">Customer</p>
                <p className="mt-1 font-semibold text-white">{order.customerName}</p>
                <p className="text-xs text-gray-400">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Type</p>
                <p className="mt-1 text-gray-200">{getOrderType(order)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Items</p>
                <p className="mt-1 text-gray-200">{order.itemCount}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
              <p className="font-bold text-white">{formatCurrency(order.totalAmount)}</p>
              <button
                type="button"
                onClick={() => onOpen(order.id)}
                className="inline-flex h-9 items-center gap-2 rounded border border-gray-600 px-3 text-xs font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white"
              >
                <FiEye aria-hidden="true" />
                Details
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function OrderHistorySkeleton() {
  return (
    <div
      className="overflow-hidden rounded-md border border-gray-700"
      aria-label="Loading order history"
      aria-busy="true"
    >
      <div className="h-10 bg-gray-900/60" />
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex h-16 items-center gap-4 border-t border-gray-700 bg-gray-800 px-4"
        >
          <div className="h-3 w-14 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-28 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-700" />
          <div className="ml-auto h-6 w-20 animate-pulse rounded bg-gray-700" />
        </div>
      ))}
      <span className="sr-only">Loading order history</span>
    </div>
  )
}
