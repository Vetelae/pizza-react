import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import TodayKpiGrid, {
  TodayKpiGridSkeleton,
} from '@/components/admin/dashboard/TodayKpiGrid'
import { useTodayKpis } from '@/hooks/admin/useAdminDashboard'
import {
  formatDateWithWeekday,
  formatTimeInTimeZone,
} from '@/utils/formatters'

export default function AdminDashboard() {
  const todayKpisQuery = useTodayKpis()
  const kpis = todayKpisQuery.data

  return (
    <div className="mx-auto w-full max-w-384">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            {kpis
              ? `${formatDateWithWeekday(kpis.date)} · ${kpis.timeZone}`
              : 'Daily sales and live order workload'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {kpis && (
            <span className="text-xs text-gray-400">
              Updated{' '}
              {formatTimeInTimeZone(kpis.generatedAt, kpis.timeZone)}
            </span>
          )}
          <button
            type="button"
            onClick={() => void todayKpisQuery.refetch()}
            disabled={todayKpisQuery.isFetching}
            aria-label="Refresh dashboard metrics"
            title="Refresh dashboard metrics"
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-gray-700 bg-gray-800 text-gray-300 transition hover:border-gray-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <FiRefreshCw
              className={todayKpisQuery.isFetching ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {todayKpisQuery.isLoading && <TodayKpiGridSkeleton />}

      {todayKpisQuery.isError && !kpis && (
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
            Dashboard metrics could not be loaded.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Check the connection and try again.
          </p>
          <button
            type="button"
            onClick={() => void todayKpisQuery.refetch()}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
          >
            <FiRefreshCw aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {todayKpisQuery.isError && kpis && (
        <div
          className="mb-4 flex items-start gap-2 border border-amber-700 bg-amber-950/40 px-4 py-3 text-sm text-amber-200"
          role="alert"
        >
          <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          The latest refresh failed. Showing the last available metrics.
        </div>
      )}

      {kpis && <TodayKpiGrid kpis={kpis} />}
    </div>
  )
}
