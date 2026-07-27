export interface TodayKpis {
  date: string
  timeZone: string
  generatedAt: string
  ordersToday: number
  revenueToday: number
  averageOrderValue: number
  averagePrepTimeMinutes: number | null
  pendingOrders: number
  ordersInProgress: number
}
