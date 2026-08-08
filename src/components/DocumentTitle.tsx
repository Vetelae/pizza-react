import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

const DEFAULT_TITLE = 'Pizza Shop'

// Add new routes here
const routeTitles = [
  { path: '/menu', title: 'Menu - Pizza Shop' },
  { path: '/about', title: 'About - Pizza Shop' },
  { path: '/profile', title: 'Profile - Pizza Shop' },
  { path: '/orders/:orderId', title: 'Order details - Pizza Shop' },
  { path: '/confirm-email', title: 'Confirm email - Pizza Shop' },
  { path: '/reset-password', title: 'Reset password - Pizza Shop' },
  { path: '/admin/dashboard', title: 'Dashboard - Pizza Shop' },
  {
    path: '/admin/order-monitoring',
    title: 'Order monitoring - Pizza Shop',
  },
  { path: '/admin/order-history', title: 'Order history - Pizza Shop' },
  { path: '/admin/categories', title: 'Categories - Pizza Shop' },
  { path: '/admin/menu-items', title: 'Menu items - Pizza Shop' },
  { path: '/admin/news', title: 'News - Pizza Shop' },
]

export default function DocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const matchingRoute = routeTitles.find(({ path }) =>
      matchPath({ path, end: true }, pathname),
    )

    document.title = matchingRoute?.title ?? DEFAULT_TITLE
  }, [pathname])

  return null
}
