import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { getHubUrl } from '@/api/hubUrl'
import { getValidAccessToken } from '@/api/axiosClient'
import type { OrderCard, OrderStatusChangedEvent } from '@/types/order'
import type { OrderConnectionStatus } from '@/types/realtime'
import { adminOrderKeys } from './useAdminOrder'
import {
  ACTIVE_ORDER_STATUSES,
  normalizeOrderStatus,
} from '@/components/admin/orders/orderMonitoringUtils'

type MonitoringEvent =
  | { type: 'created' | 'updated'; order: OrderCard }
  | { type: 'statusChanged'; change: OrderStatusChangedEvent }

const isActiveOrder = (order: OrderCard) => {
  const status = normalizeOrderStatus(order.status)
  return status !== null && ACTIVE_ORDER_STATUSES.includes(status as never)
}

export const useOrderMonitoringConnection = (snapshotReady: boolean) => {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<OrderConnectionStatus>('connecting')
  const snapshotReadyRef = useRef(snapshotReady)
  const pendingEventsRef = useRef<MonitoringEvent[]>([])
  const refreshActiveOrders = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.active,
        exact: true,
      }),
    [queryClient]
  )

  const upsertOrder = useCallback(
    (order: OrderCard) => {
      queryClient.setQueryData<OrderCard[]>(adminOrderKeys.active, (current = []) => {
        const withoutOrder = current.filter((item) => item.id !== order.id)
        if (!isActiveOrder(order)) return withoutOrder

        return [...withoutOrder, order].sort(
          (left, right) =>
            new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        )
      })
    },
    [queryClient]
  )

  const applyEvent = useCallback(
    (event: MonitoringEvent) => {
      if (event.type === 'statusChanged') {
        const { change } = event
        upsertOrder({ ...change.order, status: change.newStatus })
        void queryClient.invalidateQueries({
          queryKey: adminOrderKeys.detail(change.orderId),
          exact: true,
        })
        return
      }

      upsertOrder(event.order)
      if (event.type === 'updated') {
        void queryClient.invalidateQueries({
          queryKey: adminOrderKeys.detail(event.order.id),
          exact: true,
        })
      }
    },
    [queryClient, upsertOrder]
  )

  useEffect(() => {
    snapshotReadyRef.current = snapshotReady
    if (!snapshotReady) return

    const pendingEvents = pendingEventsRef.current
    pendingEventsRef.current = []
    pendingEvents.forEach(applyEvent)
  }, [applyEvent, snapshotReady])

  useEffect(() => {
    let disposed = false
    let retryTimeout: number | undefined

    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl('hubs/admin/orders'), {
        accessTokenFactory: async () => (await getValidAccessToken()) ?? '',
      })
      .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
      .configureLogging(LogLevel.Warning)
      .build()

    const handleEvent = (event: MonitoringEvent) => {
      if (!snapshotReadyRef.current) {
        pendingEventsRef.current.push(event)
        return
      }
      applyEvent(event)
    }

    connection.on('OrderCreated', (order: OrderCard) => {
      handleEvent({ type: 'created', order })
    })
    connection.on('OrderStatusChanged', (change: OrderStatusChangedEvent) => {
      handleEvent({ type: 'statusChanged', change })
    })
    connection.on('OrderUpdated', (order: OrderCard) => {
      handleEvent({ type: 'updated', order })
    })

    const scheduleStart = () => {
      window.clearTimeout(retryTimeout)
      retryTimeout = window.setTimeout(() => void startConnection(), 5_000)
    }

    const startConnection = async () => {
      if (disposed || connection.state !== HubConnectionState.Disconnected) return

      setStatus('connecting')
      try {
        await connection.start()
        if (!disposed) {
          setStatus('connected')
          void refreshActiveOrders()
        }
      } catch {
        if (!disposed) {
          setStatus('offline')
          scheduleStart()
        }
      }
    }

    connection.onreconnecting(() => {
      if (!disposed) setStatus('reconnecting')
    })
    connection.onreconnected(() => {
      if (disposed) return
      setStatus('connected')
      void refreshActiveOrders()
    })
    connection.onclose(() => {
      if (disposed) return
      setStatus('offline')
      scheduleStart()
    })

    void startConnection()

    return () => {
      disposed = true
      window.clearTimeout(retryTimeout)
      connection.off('OrderCreated')
      connection.off('OrderStatusChanged')
      connection.off('OrderUpdated')
      void connection.stop()
    }
  }, [applyEvent, refreshActiveOrders])

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshActiveOrders()
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshActiveOrders()
      }
    }
    const interval = window.setInterval(
      refreshIfVisible,
      status === 'connected' ? 60_000 : 15_000
    )

    window.addEventListener('focus', refreshIfVisible)
    window.addEventListener('online', refreshIfVisible)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshIfVisible)
      window.removeEventListener('online', refreshIfVisible)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshActiveOrders, status])

  return status
}
