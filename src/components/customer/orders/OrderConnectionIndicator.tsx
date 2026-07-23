import { FiWifi, FiWifiOff } from 'react-icons/fi'
import type { OrderConnectionStatus } from '@/types/realtime'

const CONNECTION_LABELS: Record<OrderConnectionStatus, string> = {
  connecting: 'Connecting live updates',
  connected: 'Live updates',
  reconnecting: 'Reconnecting live updates',
  offline: 'Checking for updates',
}

interface OrderConnectionIndicatorProps {
  status: OrderConnectionStatus
}

export default function OrderConnectionIndicator({
  status,
}: OrderConnectionIndicatorProps) {
  const isConnected = status === 'connected'
  const isBusy = status === 'connecting' || status === 'reconnecting'

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        isConnected
          ? 'border-emerald-700 bg-emerald-950/50 text-emerald-300'
          : isBusy
            ? 'border-amber-700 bg-amber-950/50 text-amber-300'
            : 'border-zinc-600 bg-zinc-800 text-zinc-300'
      }`}
      title={
        isConnected
          ? 'Order status changes will appear automatically.'
          : 'Orders are being checked periodically while live updates reconnect.'
      }
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
