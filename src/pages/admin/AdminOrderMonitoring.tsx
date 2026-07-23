import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  FiAlertTriangle,
  FiRefreshCw,
  FiWifi,
  FiWifiOff,
} from 'react-icons/fi'
import OrderMonitoringBoard from '@/components/admin/orders/OrderMonitoringBoard'
import AdminOrderDetailsModal from '@/components/admin/orders/AdminOrderDetailsModal'
import type { OrderStatusName } from '@/types/enums'
import {
  useActiveAdminOrders,
  useUpdateOrderStatus,
} from '@/hooks/admin/useAdminOrder'
import {
  useOrderMonitoringConnection,
} from '@/hooks/admin/useOrderMonitoringConnection'
import type { OrderConnectionStatus } from '@/types/realtime'

const CONNECTION_LABELS: Record<OrderConnectionStatus, string> = {
  connecting: 'Connecting',
  connected: 'Live',
  reconnecting: 'Reconnecting',
  offline: 'Offline',
}

function ConnectionIndicator({ status }: { status: OrderConnectionStatus }) {
  const isConnected = status === 'connected'
  const isBusy = status === 'connecting' || status === 'reconnecting'

  return (
    <span
      className={`inline-flex h-9 items-center gap-2 rounded border px-3 text-xs font-bold ${
        isConnected
          ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
          : isBusy
            ? 'border-amber-700 bg-amber-950/40 text-amber-300'
            : 'border-red-800 bg-red-950/40 text-red-300'
      }`}
      title={isConnected ? 'Real-time updates connected' : 'Orders may be out of date'}
    >
      {isConnected ? (
        <FiWifi aria-hidden="true" />
      ) : (
        <FiWifiOff aria-hidden="true" />
      )}
      {CONNECTION_LABELS[status]}
    </span>
  )
}

function BoardSkeleton() {
  return (
    <div
      className="grid overflow-hidden rounded-md border border-gray-700 lg:grid-cols-4 lg:divide-x lg:divide-gray-700"
      aria-label="Loading active orders"
    >
      {[0, 1, 2, 3].map((column) => (
        <div key={column} className={column > 0 ? 'hidden bg-gray-800/70 lg:block' : 'bg-gray-800/70'}>
          <div className="h-14 border-b border-gray-700 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
          </div>
          <div className="space-y-3 p-3">
            {[0, 1].map((card) => (
              <div key={card} className="h-48 animate-pulse rounded bg-gray-700/70" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminOrderMonitoring() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [actionError, setActionError] = useState<string | null>(null)
  const activeOrdersQuery = useActiveAdminOrders()
  const statusMutation = useUpdateOrderStatus()
  const connectionStatus = useOrderMonitoringConnection(activeOrdersQuery.isSuccess)
  const orders = activeOrdersQuery.data ?? []
  const updatingOrderId = statusMutation.isPending
    ? statusMutation.variables?.id ?? null
    : null

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const closeModal = useCallback(() => setSelectedOrderId(null), [])

  const updateStatus = async (orderId: number, status: OrderStatusName) => {
    setActionError(null)
    statusMutation.reset()

    try {
      await statusMutation.mutateAsync({
        id: orderId,
        dto: { status },
      })
    } catch (error) {
      const isConflict =
        axios.isAxiosError(error) && error.response?.status === 409
      setActionError(
        isConflict
          ? 'This order was changed elsewhere. The board has been refreshed.'
          : 'Could not update the order. Please try again.'
      )
    }
  }

  const cancelOrder = async (orderId: number) => {
    statusMutation.reset()
    await statusMutation.mutateAsync({
      id: orderId,
      dto: { status: 'Cancelled' },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[96rem]">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order monitoring</h1>
          <p className="mt-1 text-sm text-gray-400">
            {orders.length} active {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionIndicator status={connectionStatus} />
          <button
            type="button"
            onClick={() => activeOrdersQuery.refetch()}
            disabled={activeOrdersQuery.isFetching}
            aria-label="Refresh active orders"
            title="Refresh active orders"
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 transition hover:border-gray-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <FiRefreshCw
              className={activeOrdersQuery.isFetching ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {actionError && (
        <div
          className="mb-4 flex items-start gap-2 border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          {actionError}
        </div>
      )}

      {activeOrdersQuery.isLoading && <BoardSkeleton />}

      {activeOrdersQuery.isError && (
        <div className="border border-red-800 bg-gray-800 px-5 py-10 text-center">
          <FiAlertTriangle className="mx-auto text-red-400" size={28} aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-white">
            Active orders could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => activeOrdersQuery.refetch()}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
          >
            <FiRefreshCw aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {activeOrdersQuery.isSuccess && (
        <OrderMonitoringBoard
          orders={orders}
          now={now}
          updatingOrderId={updatingOrderId}
          onOpen={setSelectedOrderId}
          onAdvance={updateStatus}
        />
      )}

      {selectedOrderId && (
        <AdminOrderDetailsModal
          key={selectedOrderId}
          orderId={selectedOrderId}
          isChangingStatus={statusMutation.isPending}
          onClose={closeModal}
          onCancel={cancelOrder}
        />
      )}
    </div>
  )
}
