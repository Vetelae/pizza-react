import { Link } from 'react-router-dom'
import { useUserOrder } from '@/hooks/user/useUserOrder'
import { OrderStatus, OrderType, PaymentMethod } from '@/types/enums'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

interface ProfileOrderDetailsModalProps {
  orderId: number | null
  onClose: () => void
}

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

const paymentLabels: Record<keyof typeof PaymentMethod, string> = {
  Cash: 'Cash',
  Card: 'Card',
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

const getPaymentLabel = (paymentMethod: number | string) => {
  const paymentKey = normalizeEnumValue(paymentMethod, PaymentMethod)
  return paymentKey ? paymentLabels[paymentKey] : 'Unknown'
}

export default function ProfileOrderDetailsModal({
  orderId,
  onClose,
}: ProfileOrderDetailsModalProps) {
  const { data: order, isLoading, isError } = useUserOrder(orderId ?? 0, !!orderId)

  if (!orderId) return null

  const createdAt = order ? formatDateTime(order.createdAt) : ''
  const orderTotal = Number(order?.totalAmount ?? 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-order-details-title"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 bg-gray-900 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              Order details
            </p>
            <h2 id="profile-order-details-title" className="mt-2 text-2xl font-bold">
              Order #{orderId}
            </h2>
            {order && <p className="mt-1 text-sm text-zinc-300">Placed on {createdAt}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="text-2xl leading-none text-zinc-300 transition-colors hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[calc(90vh-7rem)] overflow-y-auto px-6 py-5">
          {isLoading && (
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Loading order details...
            </p>
          )}

          {isError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Could not load this order.
            </p>
          )}

          {order && (
            <div className="grid gap-6 md:grid-cols-[1.35fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">Items</h3>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {order.items.map((item) => {
                    const itemName = item.menuItem?.name ?? item.menuItemName ?? `Item #${item.menuItemId}`
                    const unitPrice = Number(item.unitPrice ?? item.menuItemValue ?? 0)
                    const lineTotal = item.quantity * unitPrice

                    return (
                      <div
                        key={item.id ?? `${item.menuItemId}-${item.quantity}`}
                        className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{itemName}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity} x {formatCurrency(unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Order</h3>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Type</dt>
                      <dd className="font-medium text-gray-900">{getTypeLabel(order.type)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Payment</dt>
                      <dd className="font-medium text-gray-900">
                        {getPaymentLabel(order.paymentMethod)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="font-medium text-gray-900">{order.customerPhone}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Email</dt>
                      <dd className="font-medium text-gray-900">{order.customerEmail}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Customer</h3>
                  <p className="mt-3 font-medium text-gray-900">{order.customerName}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {normalizeEnumValue(order.type, OrderType) === 'Delivery'
                      ? order.deliveryAddress || 'Delivery address not provided'
                      : 'Pickup order'}
                  </p>
                  {order.notes && (
                    <p className="mt-3 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Notes:</span> {order.notes}
                    </p>
                  )}
                </div>

                <Link
                  to="/menu"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-orange px-5 py-3 text-sm font-bold text-gray-900 transition-all hover:brightness-110"
                >
                  Place another order
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
