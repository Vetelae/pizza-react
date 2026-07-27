import axiosClient from '../axiosClient'
import type { TodayKpis } from '@/types/dashboard'

export const adminDashboardApi = {
  getTodayKpis: async (signal?: AbortSignal): Promise<TodayKpis> => {
    const { data } = await axiosClient.get<TodayKpis>(
      'admin/dashboard/today-kpis',
      { signal }
    )
    return data
  },
}
