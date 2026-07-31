import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
} from 'react-icons/fi'
import OrderHistoryTable from '@/components/admin/orders/OrderHistoryTable'
import AdminOrderDetailsModal from '@/components/admin/orders/AdminOrderDetailsModal'
import { useAdminOrderHistory } from '@/hooks/admin/useAdminOrder'
import {
  OrderHistoryPeriod,
  type OrderHistoryPeriod as OrderHistoryPeriodValue,
  type OrderHistoryQuery,
  type OrderHistoryStatus,
} from '@/types/order'

const PERIOD_OPTIONS: Array<{
  value: OrderHistoryPeriodValue
  label: string
}> = [
  { value: OrderHistoryPeriod.Today, label: 'Today' },
  { value: OrderHistoryPeriod.Yesterday, label: 'Yesterday' },
  { value: OrderHistoryPeriod.Last7Days, label: 'Last 7 days' },
  { value: OrderHistoryPeriod.Last30Days, label: 'Last 30 days' },
  { value: OrderHistoryPeriod.ThisMonth, label: 'This month' },
  { value: OrderHistoryPeriod.LastMonth, label: 'Last month' },
  { value: OrderHistoryPeriod.Custom, label: 'Custom range' },
]

const PAGE_SIZES = [20, 50, 100] as const

const isPeriod = (value: string | null): value is OrderHistoryPeriodValue =>
  PERIOD_OPTIONS.some((option) => option.value === value)

const getPage = (value: string | null) => {
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1
}

const getPageSize = (value: string | null): OrderHistoryQuery['pageSize'] => {
  const parsedValue = Number(value)
  return PAGE_SIZES.includes(parsedValue as OrderHistoryQuery['pageSize'])
    ? (parsedValue as OrderHistoryQuery['pageSize'])
    : 20
}

const getStatus = (value: string | null): OrderHistoryStatus | undefined =>
  value === 'Completed' || value === 'Cancelled' ? value : undefined

type FilterUpdates = Record<string, string | number | undefined>

export default function AdminOrderHistory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const page = getPage(searchParams.get('page'))
  const pageSize = getPageSize(searchParams.get('pageSize'))
  const periodParam = searchParams.get('period')
  const period = isPeriod(periodParam)
    ? periodParam
    : OrderHistoryPeriod.Last30Days
  const status = getStatus(searchParams.get('status'))
  const search = (searchParams.get('search') ?? '').slice(0, 100)
  const fromDate = searchParams.get('fromDate') || undefined
  const toDate = searchParams.get('toDate') || undefined
  const [searchInput, setSearchInput] = useState(search)

  const updateFilters = useCallback(
    (updates: FilterUpdates, resetPage = true) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams)

          Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '') {
              nextParams.delete(key)
            } else {
              nextParams.set(key, String(value))
            }
          })

          if (resetPage) nextParams.delete('page')
          return nextParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    const normalizedSearch = searchInput.trim()
    if (normalizedSearch === search) return

    const timer = window.setTimeout(() => {
      updateFilters({ search: normalizedSearch || undefined })
    }, 400)

    return () => window.clearTimeout(timer)
  }, [search, searchInput, updateFilters])

  const query = useMemo<OrderHistoryQuery>(
    () => ({
      page,
      pageSize,
      period,
      status,
      search: search || undefined,
      fromDate: period === OrderHistoryPeriod.Custom ? fromDate : undefined,
      toDate: period === OrderHistoryPeriod.Custom ? toDate : undefined,
    }),
    [fromDate, page, pageSize, period, search, status, toDate]
  )

  const historyQuery = useAdminOrderHistory(query)
  const history = historyQuery.data
  const isCustomRangeIncomplete =
    period === OrderHistoryPeriod.Custom && (!fromDate || !toDate)
  const isCustomRangeInvalid =
    period === OrderHistoryPeriod.Custom &&
    Boolean(fromDate && toDate && fromDate > toDate)
  const hasFilters =
    Boolean(search || status) || period !== OrderHistoryPeriod.Last30Days

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const changePeriod = (nextPeriod: OrderHistoryPeriodValue) => {
    updateFilters({
      period:
        nextPeriod === OrderHistoryPeriod.Last30Days ? undefined : nextPeriod,
      fromDate: undefined,
      toDate: undefined,
    })
  }

  const firstVisibleOrder = history?.totalCount
    ? (history.page - 1) * history.pageSize + 1
    : 0
  const lastVisibleOrder = history?.totalCount
    ? Math.min(history.page * history.pageSize, history.totalCount)
    : 0

  useEffect(() => {
    if (history && history.totalPages > 0 && page > history.totalPages) {
      updateFilters({ page: history.totalPages }, false)
    }
  }, [history, page, updateFilters])

  return (
    <div className="mx-auto w-full max-w-384">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order history</h1>
          <p className="mt-1 text-sm text-gray-400">
            {history
              ? `${history.totalCount} ${history.totalCount === 1 ? 'order' : 'orders'} found`
              : 'Review completed and cancelled orders'}
          </p>
        </div>
      </header>

      <section
        className="mb-5 rounded-md border border-gray-700 bg-gray-800 p-4"
        aria-label="Order history filters"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1.5fr)_minmax(10rem,0.8fr)_minmax(10rem,0.8fr)_8rem_auto]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Search
            </span>
            <span className="relative block">
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchInput}
                maxLength={100}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Order number, name or phone"
                className="h-10 w-full rounded border border-gray-600 bg-gray-900 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-orange focus:outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Date
            </span>
            <select
              value={period}
              onChange={(event) =>
                changePeriod(event.target.value as OrderHistoryPeriodValue)
              }
              className="h-10 w-full rounded border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-orange focus:outline-none"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Status
            </span>
            <select
              value={status ?? ''}
              onChange={(event) =>
                updateFilters({
                  status: getStatus(event.target.value),
                })
              }
              className="h-10 w-full rounded border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-orange focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Per page
            </span>
            <select
              value={pageSize}
              onChange={(event) =>
                updateFilters({
                  pageSize:
                    Number(event.target.value) === 20
                      ? undefined
                      : Number(event.target.value),
                })
              }
              className="h-10 w-full rounded border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-orange focus:outline-none"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end sm:col-span-2 xl:col-span-1">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters && pageSize === 20 && page === 1}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-gray-600 px-3 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 xl:w-auto"
            >
              <FiX aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>

        {period === OrderHistoryPeriod.Custom && (
          <div className="mt-4 grid gap-4 border-t border-gray-700 pt-4 sm:grid-cols-2 xl:max-w-xl">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                From date
              </span>
              <input
                type="date"
                value={fromDate ?? ''}
                max={toDate}
                onChange={(event) =>
                  updateFilters({ fromDate: event.target.value || undefined })
                }
                className="h-10 w-full rounded border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-orange focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                To date
              </span>
              <input
                type="date"
                value={toDate ?? ''}
                min={fromDate}
                onChange={(event) =>
                  updateFilters({ toDate: event.target.value || undefined })
                }
                className="h-10 w-full rounded border border-gray-600 bg-gray-900 px-3 text-sm text-white focus:border-orange focus:outline-none"
              />
            </label>
          </div>
        )}
      </section>

      {isCustomRangeIncomplete || isCustomRangeInvalid ? (
        <div className="border border-amber-800 bg-amber-950/30 px-5 py-8 text-center text-sm text-amber-200">
          {isCustomRangeInvalid
            ? 'The start date must be before or the same as the end date.'
            : 'Select both a start and end date to load a custom range.'}
        </div>
      ) : (
        <OrderHistoryTable
          orders={history?.items ?? []}
          isLoading={historyQuery.isLoading}
          isError={historyQuery.isError}
          emptyMessage={
            hasFilters
              ? 'No orders match the selected filters.'
              : 'No completed or cancelled orders were found in the last 30 days.'
          }
          onOpen={setSelectedOrderId}
          onRetry={() => historyQuery.refetch()}
        />
      )}

      {history &&
        history.totalCount > 0 &&
        !isCustomRangeIncomplete &&
        !isCustomRangeInvalid && (
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-700 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-400">
            Showing {firstVisibleOrder}-{lastVisibleOrder} of {history.totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || historyQuery.isFetching}
              onClick={() => updateFilters({ page: page - 1 }, false)}
              className="inline-flex h-9 items-center gap-1 rounded border border-gray-600 px-3 font-semibold text-gray-300 transition hover:border-gray-500 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft aria-hidden="true" />
              Previous
            </button>
            <span className="min-w-24 text-center text-gray-300">
              Page {history.page} of {Math.max(history.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={
                page >= history.totalPages ||
                history.totalPages === 0 ||
                historyQuery.isFetching
              }
              onClick={() => updateFilters({ page: page + 1 }, false)}
              className="inline-flex h-9 items-center gap-1 rounded border border-gray-600 px-3 font-semibold text-gray-300 transition hover:border-gray-500 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <AdminOrderDetailsModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  )
}
