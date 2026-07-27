import { useQuery } from '@tanstack/react-query'
import { adminDashboardApi } from '@/api/admin/adminDashboardApi'

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  todayKpis: ['admin', 'dashboard', 'today-kpis'] as const,
}

export const useTodayKpis = () => {
  return useQuery({
    queryKey: adminDashboardKeys.todayKpis,
    queryFn: ({ signal }) => adminDashboardApi.getTodayKpis(signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })
}
