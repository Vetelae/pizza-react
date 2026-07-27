import {
  FiActivity,
  FiBarChart2,
  FiClock,
  FiCreditCard,
  FiInbox,
  FiShoppingBag,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import type { TodayKpis } from '@/types/dashboard'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import KpiCard from './KpiCard'

interface TodayKpiGridProps {
  kpis: TodayKpis
}

interface KpiDisplay {
  label: string
  value: string
  description: string
  icon: IconType
  accentClassName: string
  iconClassName: string
}

export default function TodayKpiGrid({ kpis }: TodayKpiGridProps) {
  const averagePrepTime =
    kpis.averagePrepTimeMinutes === null
      ? '—'
      : `${formatNumber(Math.round(kpis.averagePrepTimeMinutes))} min`

  const cards: KpiDisplay[] = [
    {
      label: 'Orders Today',
      value: formatNumber(kpis.ordersToday),
      description: 'Non-cancelled orders created today',
      icon: FiShoppingBag,
      accentClassName: 'border-l-orange',
      iconClassName: 'bg-orange/15 text-orange',
    },
    {
      label: 'Revenue Today',
      value: formatCurrency(kpis.revenueToday),
      description: 'Revenue from orders completed today',
      icon: FiCreditCard,
      accentClassName: 'border-l-emerald-400',
      iconClassName: 'bg-emerald-950/60 text-emerald-300',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(kpis.averageOrderValue),
      description: 'Average value of orders completed today',
      icon: FiBarChart2,
      accentClassName: 'border-l-sky-400',
      iconClassName: 'bg-sky-950/60 text-sky-300',
    },
    {
      label: 'Avg Prep Time',
      value: averagePrepTime,
      description: 'Orders that became ready today',
      icon: FiClock,
      accentClassName: 'border-l-violet-400',
      iconClassName: 'bg-violet-950/60 text-violet-300',
    },
    {
      label: 'Pending Now',
      value: formatNumber(kpis.pendingOrders),
      description: 'Orders awaiting confirmation',
      icon: FiInbox,
      accentClassName: 'border-l-amber-400',
      iconClassName: 'bg-amber-950/60 text-amber-300',
    },
    {
      label: 'In Progress Now',
      value: formatNumber(kpis.ordersInProgress),
      description: 'Confirmed, preparing or ready orders',
      icon: FiActivity,
      accentClassName: 'border-l-rose-400',
      iconClassName: 'bg-rose-950/60 text-rose-300',
    },
  ]

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Today's key performance indicators"
    >
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  )
}

export function TodayKpiGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading today's key performance indicators"
      aria-busy="true"
    >
      {[0, 1, 2, 3, 4, 5].map((card) => (
        <div
          key={card}
          className="min-h-44 animate-pulse rounded-md border border-gray-700 bg-gray-800 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="w-2/3">
              <div className="h-4 w-28 rounded bg-gray-700" />
              <div className="mt-5 h-10 w-36 rounded bg-gray-700" />
            </div>
            <div className="h-10 w-10 rounded-md bg-gray-700" />
          </div>
          <div className="mt-5 h-3 w-48 max-w-full rounded bg-gray-700" />
        </div>
      ))}
      <span className="sr-only">Loading dashboard metrics</span>
    </div>
  )
}
