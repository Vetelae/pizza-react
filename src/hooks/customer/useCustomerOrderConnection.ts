import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { getHubUrl } from '@/api/hubUrl'
import { getValidAccessToken } from '@/api/axiosClient'
import { publicOrderKeys } from '@/hooks/public/useOrder'
import { userOrderKeys } from '@/hooks/user/useUserOrder'
import { useAuthStore } from '@/store/authStore'
import type { CustomerOrderStatusChanged, Order } from '@/types/order'
import type { OrderConnectionStatus } from '@/types/realtime'

const OFFLINE_POLL_INTERVAL = 15_000
const CONNECTED_RECONCILE_INTERVAL = 60_000

interface UseCustomerOrderConnectionOptions {
  enabled: boolean
  orderId?: number | null
  lookupToken?: string | null
  snapshotReady: boolean
  hasActiveOrders: boolean
}

const applyStatusChange = (
  order: Order | undefined,
  change: CustomerOrderStatusChanged
) => {
  if (!order || order.id !== change.orderId) return order

  const currentChangedAt = new Date(order.statusChangedAt).getTime()
  const incomingChangedAt = new Date(change.changedAt).getTime()

  if (
    !Number.isNaN(currentChangedAt) &&
    !Number.isNaN(incomingChangedAt) &&
    incomingChangedAt < currentChangedAt
  ) {
    return order
  }

  if (
    order.status === change.newStatus &&
    order.statusChangedAt === change.changedAt
  ) {
    return order
  }

  return {
    ...order,
    status: change.newStatus,
    statusChangedAt: change.changedAt,
  }
}

export const useCustomerOrderConnection = ({
  enabled,
  orderId,
  lookupToken,
  snapshotReady,
  hasActiveOrders,
}: UseCustomerOrderConnectionOptions) => {
  const queryClient = useQueryClient()
  const userId = useAuthStore(state => state.userId)
  const [status, setStatus] = useState<OrderConnectionStatus>('connecting')
  const snapshotReadyRef = useRef(snapshotReady)
  const pendingEventsRef = useRef<CustomerOrderStatusChanged[]>([])
  const usesLookupToken = !!lookupToken
  const canConnect =
    enabled && (!!userId || (!!orderId && usesLookupToken))

  const refreshRelevantQueries = useCallback(
    (changedOrderId = orderId) => {
      const refreshes: Promise<unknown>[] = []

      if (orderId && lookupToken && changedOrderId === orderId) {
        refreshes.push(
          queryClient.invalidateQueries({
            queryKey: publicOrderKeys.detail(orderId, lookupToken),
            exact: true,
          })
        )
      }

      if (userId) {
        refreshes.push(
          queryClient.invalidateQueries({
            queryKey: userOrderKeys.list(userId),
            exact: true,
          })
        )

        if (!usesLookupToken && changedOrderId) {
          refreshes.push(
            queryClient.invalidateQueries({
              queryKey: userOrderKeys.detail(userId, changedOrderId),
              exact: true,
            })
          )
        }
      }

      return Promise.all(refreshes)
    },
    [lookupToken, orderId, queryClient, userId, usesLookupToken]
  )

  const applyEvent = useCallback(
    (change: CustomerOrderStatusChanged) => {
      if (orderId && lookupToken && change.orderId === orderId) {
        queryClient.setQueryData<Order>(
          publicOrderKeys.detail(orderId, lookupToken),
          current => applyStatusChange(current, change)
        )
      }

      if (userId) {
        queryClient.setQueryData<Order[]>(
          userOrderKeys.list(userId),
          current =>
            current?.map(order => applyStatusChange(order, change) ?? order)
        )

        if (!usesLookupToken) {
          queryClient.setQueryData<Order>(
            userOrderKeys.detail(userId, change.orderId),
            current => applyStatusChange(current, change)
          )
        }
      }

      void refreshRelevantQueries(change.orderId)
    },
    [
      lookupToken,
      orderId,
      queryClient,
      refreshRelevantQueries,
      userId,
      usesLookupToken,
    ]
  )

  useEffect(() => {
    snapshotReadyRef.current = snapshotReady
    if (!snapshotReady) return

    const pendingEvents = pendingEventsRef.current
    pendingEventsRef.current = []
    pendingEvents.forEach(applyEvent)
  }, [applyEvent, snapshotReady])

  useEffect(() => {
    if (!canConnect) return

    let disposed = false
    let retryTimeout: number | undefined

    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl('hubs/customer/orders'), {
        accessTokenFactory: async () => (await getValidAccessToken()) ?? '',
      })
      .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
      .configureLogging(LogLevel.Warning)
      .build()

    const handleStatusChanged = (change: CustomerOrderStatusChanged) => {
      if (!snapshotReadyRef.current) {
        pendingEventsRef.current.push(change)
        return
      }

      applyEvent(change)
    }

    const subscribeToGuestOrder = async () => {
      if (orderId && lookupToken) {
        await connection.invoke('SubscribeToOrder', orderId, lookupToken)
      }
    }

    const scheduleStart = () => {
      window.clearTimeout(retryTimeout)
      retryTimeout = window.setTimeout(() => void startConnection(), 5_000)
    }

    const handleConnectionFailure = async () => {
      if (disposed) return

      setStatus('offline')
      if (connection.state !== HubConnectionState.Disconnected) {
        try {
          await connection.stop()
        } catch {
          // The retry below will create the next connection attempt.
        }
      }

      if (!disposed) scheduleStart()
    }

    const startConnection = async () => {
      if (disposed || connection.state !== HubConnectionState.Disconnected) return

      setStatus('connecting')
      try {
        await connection.start()
        await subscribeToGuestOrder()

        if (!disposed) {
          setStatus('connected')
          void refreshRelevantQueries()
        }
      } catch {
        await handleConnectionFailure()
      }
    }

    connection.on('OrderStatusChanged', handleStatusChanged)

    connection.onreconnecting(() => {
      if (!disposed) setStatus('reconnecting')
    })
    connection.onreconnected(() => {
      if (disposed) return

      void (async () => {
        try {
          await subscribeToGuestOrder()

          if (!disposed) {
            setStatus('connected')
            void refreshRelevantQueries()
          }
        } catch {
          await handleConnectionFailure()
        }
      })()
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
      connection.off('OrderStatusChanged', handleStatusChanged)
      void connection.stop()
    }
  }, [
    applyEvent,
    canConnect,
    lookupToken,
    orderId,
    refreshRelevantQueries,
  ])

  useEffect(() => {
    if (!canConnect || !hasActiveOrders) return

    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshRelevantQueries()
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshRelevantQueries()
      }
    }
    const interval = window.setInterval(
      refreshIfVisible,
      status === 'connected'
        ? CONNECTED_RECONCILE_INTERVAL
        : OFFLINE_POLL_INTERVAL
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
  }, [canConnect, hasActiveOrders, refreshRelevantQueries, status])

  return status
}
