import { useEffect, useState } from 'react'
import {
  FiAlertTriangle,
  FiClock,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiX,
  FiXCircle,
} from 'react-icons/fi'
import { useAdminOrderById } from '@/hooks/admin/useAdminOrder'
import {
  formatCurrency,
  formatDateTime,
  normalizeOrderStatus,
  normalizeOrderType,
  normalizePaymentMethod,
  ORDER_STATUS_CONFIG,
} from './orderMonitoringUtils'

interface AdminOrderDetailsModalProps {
  orderId: number | null
  isChangingStatus?: boolean
  onClose: () => void
  onCancel?: (orderId: number) => Promise<void>
}

export default function AdminOrderDetailsModal({
  orderId,
  isChangingStatus = false,
  onClose,
  onCancel,
}: AdminOrderDetailsModalProps) {
  const [isConfirmingCancellation, setIsConfirmingCancellation] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useAdminOrderById(orderId ?? 0)

  useEffect(() => {
    if (!orderId) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, orderId])

  if (!orderId) return null

  const status = order ? normalizeOrderStatus(order.status) : null
  const type = order ? normalizeOrderType(order.type) : null
  const paymentMethod = order ? normalizePaymentMethod(order.paymentMethod) : null
  const canCancel =
    Boolean(onCancel) && status !== 'Completed' && status !== 'Cancelled'

  const timeline = order
    ? [
        { label: 'Received', value: order.createdAt },
        { label: 'Confirmed', value: order.confirmedAt },
        { label: 'Preparing', value: order.preparingAt },
        { label: 'Ready', value: order.readyAt },
        { label: 'Completed', value: order.completedAt },
        { label: 'Cancelled', value: order.cancelledAt },
      ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value))
    : []

  const cancelOrder = async () => {
    if (!onCancel) return

    setCancelError(null)
    try {
      await onCancel(orderId)
      onClose()
    } catch {
      setCancelError('The order could not be cancelled. Its latest status has been refreshed.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-order-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-700 bg-gray-900 px-5 py-4 text-white sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="admin-order-details-title" className="text-xl font-bold sm:text-2xl">
                Order #{orderId}
              </h2>
              {status && (
                <span
                  className={`rounded px-2.5 py-1 text-xs font-bold ${ORDER_STATUS_CONFIG[status].badgeClass}`}
                >
                  {ORDER_STATUS_CONFIG[status].label}
                </span>
              )}
            </div>
            {order && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                <FiClock aria-hidden="true" />
                Received {formatDateTime(order.createdAt)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            title="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            <FiX size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[calc(92vh-5.25rem)] overflow-y-auto">
          {isLoading && (
            <div className="space-y-4 p-6" aria-label="Loading order details">
              <div className="h-24 animate-pulse rounded bg-gray-100" />
              <div className="h-48 animate-pulse rounded bg-gray-100" />
            </div>
          )}

          {isError && (
            <div className="p-6 text-center">
              <FiAlertTriangle className="mx-auto text-red-500" size={26} aria-hidden="true" />
              <p className="mt-3 text-sm text-gray-700">Could not load this order.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Try again
              </button>
            </div>
          )}

          {order && (
            <div className="grid md:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)]">
              <div className="p-5 sm:p-6">
                <h3 className="text-base font-bold text-gray-950">Order items</h3>
                <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {order.items.map((item, index) => {
                    const itemName =
                      item.menuItem?.name ??
                      item.menuItemName ??
                      `Item #${item.menuItemId}`
                    const unitPrice = Number(item.unitPrice ?? item.menuItemValue ?? 0)

                    return (
                      <div
                        key={item.id ?? `${item.menuItemId}-${index}`}
                        className="flex items-start justify-between gap-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{itemName}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity} x {formatCurrency(unitPrice)}
                          </p>
                        </div>
                        <p className="shrink-0 font-bold text-gray-950">
                          {formatCurrency(item.quantity * unitPrice)}
                        </p>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between py-4 text-lg font-bold text-gray-950">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>

                {order.notes && (
                  <section className="mt-3 border-l-4 border-orange bg-amber-50 px-4 py-3">
                    <h3 className="text-sm font-bold text-gray-900">Order notes</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{order.notes}</p>
                  </section>
                )}
              </div>

              <aside className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6 md:border-l md:border-t-0">
                <section>
                  <h3 className="text-sm font-bold uppercase text-gray-500">Customer</h3>
                  <p className="mt-3 font-bold text-gray-950">{order.customerName}</p>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="mt-2 flex items-center gap-2 break-all text-sm text-gray-700 hover:text-gray-950"
                  >
                    <FiPhone aria-hidden="true" />
                    {order.customerPhone}
                  </a>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="mt-2 flex items-center gap-2 break-all text-sm text-gray-700 hover:text-gray-950"
                  >
                    <FiMail aria-hidden="true" />
                    {order.customerEmail}
                  </a>
                </section>

                <section className="mt-6 border-t border-gray-200 pt-5">
                  <h3 className="text-sm font-bold uppercase text-gray-500">Fulfilment</h3>
                  <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-gray-900">
                    {type === 'Delivery' ? (
                      <FiMapPin className="mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <FiShoppingBag className="mt-0.5 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {type ?? 'Unknown'}
                      {type === 'Delivery' && (
                        <span className="mt-1 block font-normal text-gray-600">
                          {order.deliveryAddress || 'Address not provided'}
                        </span>
                      )}
                    </span>
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    <FiCreditCard aria-hidden="true" />
                    {paymentMethod ?? 'Unknown'} payment
                  </p>
                </section>

                <section className="mt-6 border-t border-gray-200 pt-5">
                  <h3 className="text-sm font-bold uppercase text-gray-500">Timeline</h3>
                  <ol className="mt-3 space-y-3">
                    {timeline.map((entry) => (
                      <li key={entry.label} className="flex items-start justify-between gap-3 text-sm">
                        <span className="font-semibold text-gray-800">{entry.label}</span>
                        <time className="text-right text-gray-500">
                          {formatDateTime(entry.value)}
                        </time>
                      </li>
                    ))}
                  </ol>
                </section>

                {canCancel && (
                  <section className="mt-6 border-t border-gray-200 pt-5">
                    {!isConfirmingCancellation ? (
                      <button
                        type="button"
                        onClick={() => setIsConfirmingCancellation(true)}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-red-300 bg-white px-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                      >
                        <FiXCircle aria-hidden="true" />
                        Cancel order
                      </button>
                    ) : (
                      <div className="border border-red-200 bg-red-50 p-3">
                        <p className="text-sm font-semibold text-red-900">
                          Cancel this order?
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isChangingStatus}
                            onClick={() => setIsConfirmingCancellation(false)}
                            className="h-9 rounded border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                          >
                            Keep order
                          </button>
                          <button
                            type="button"
                            disabled={isChangingStatus}
                            onClick={cancelOrder}
                            className="h-9 rounded bg-red-600 px-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
                          >
                            {isChangingStatus ? 'Cancelling...' : 'Confirm cancel'}
                          </button>
                        </div>
                      </div>
                    )}
                    {cancelError && (
                      <p className="mt-3 text-sm text-red-700" role="alert">
                        {cancelError}
                      </p>
                    )}
                  </section>
                )}
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
