import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useOrder } from '@/hooks/public/useOrder'
import { useUserOrder } from '@/hooks/user/useUserOrder'
import { useCustomerOrderConnection } from '@/hooks/customer/useCustomerOrderConnection'
import { useAuthStore } from '@/store/authStore'
import { OrderStatus, OrderType, PaymentMethod } from '@/types/enums'
import { isTerminalOrderStatus } from '@/utils/orderStatus'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import OrderConnectionIndicator from '@/components/customer/orders/OrderConnectionIndicator'

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

const typeLabels: Record<keyof typeof OrderType, string> = {
  Pickup: 'Pickup',
  Delivery: 'Delivery',
}

const paymentLabels: Record<keyof typeof PaymentMethod, string> = {
  Cash: 'Cash',
  Card: 'Card',
}

const statusStyles: Record<keyof typeof OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-sky-100 text-sky-800',
  Preparing: 'bg-orange/20 text-orange',
  Ready: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
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

function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchParams] = useSearchParams()
  const parsedOrderId = Number(orderId)
  const isValidOrderId = Number.isInteger(parsedOrderId) && parsedOrderId > 0
  const lookupToken = searchParams.get('token')
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userId = useAuthStore(state => state.userId)
  const shouldUseUserOrder = isAuthenticated && !!userId && !lookupToken

  const publicOrderQuery = useOrder(
    parsedOrderId,
    lookupToken,
    isValidOrderId && !shouldUseUserOrder
  )
  const userOrderQuery = useUserOrder(
    parsedOrderId,
    isValidOrderId && shouldUseUserOrder
  )
  const orderQuery = shouldUseUserOrder
    ? userOrderQuery
    : publicOrderQuery
  const { data: order, isLoading, isError } = orderQuery
  const canReceiveLiveUpdates =
    isValidOrderId && (!!lookupToken || (isAuthenticated && !!userId))
  const hasActiveOrder = !order || !isTerminalOrderStatus(order.status)
  const connectionStatus = useCustomerOrderConnection({
    enabled: canReceiveLiveUpdates,
    orderId: isValidOrderId ? parsedOrderId : null,
    lookupToken,
    snapshotReady: orderQuery.isFetched,
    hasActiveOrders: hasActiveOrder,
  })

  if (!isValidOrderId) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Invalid order number</h1>
          <p className="mt-3 text-gray-600">The order link is missing a valid order ID.</p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-orange px-5 py-3 font-semibold text-gray-900"
          >
            Back to menu
          </Link>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="text-lg font-medium text-gray-700">Loading your order...</p>
        </div>
      </section>
    )
  }

  if (isError || !order) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <p className="mt-3 text-gray-600">
            We could not load the details for order #{parsedOrderId}.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-orange px-5 py-3 font-semibold text-gray-900"
          >
            Order again
          </Link>
        </div>
      </section>
    )
  }

  const createdAt = formatDateTime(order.createdAt)

  const orderTotal = Number(order.totalAmount ?? 0)

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="bg-gray-900 px-8 py-8 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-orange">Order received</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              <p className="mt-2 text-sm text-zinc-300">Placed on {createdAt}</p>
              {canReceiveLiveUpdates && hasActiveOrder && (
                <div className="mt-3">
                  <OrderConnectionIndicator status={connectionStatus} />
                </div>
              )}
            </div>
            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="grid gap-8 px-8 py-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => {
                const itemName = item.menuItem?.name ?? item.menuItemName ?? `Item #${item.menuItemId}`
                const unitPrice = Number(item.unitPrice ?? item.menuItemValue ?? 0)
                const lineTotal = item.quantity * unitPrice

                return (
                  <div
                    key={item.id ?? `${item.menuItemId}-${item.quantity}`}
                    className="flex items-start justify-between border-b border-gray-200 pb-4"
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

            <div className="mt-6 flex items-center justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(orderTotal)}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Order details</h2>
              <dl className="mt-4 space-y-3 text-sm">
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

            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
              <p className="mt-4 font-medium text-gray-900">{order.customerName}</p>
              <p className="mt-2 text-sm text-gray-600">
                {normalizeEnumValue(order.type, OrderType) === 'Delivery'
                  ? order.deliveryAddress || 'Delivery address not provided'
                  : 'Pickup order'}
              </p>
              {order.notes && (
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Notes:</span> {order.notes}
                </p>
              )}
            </div>

            <Link
              to="/menu"
              className="inline-flex w-full items-center justify-center rounded-full bg-orange px-5 py-3 font-semibold text-gray-900"
            >
              Place another order
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderDetails
