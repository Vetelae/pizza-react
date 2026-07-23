import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/order-monitoring', label: 'Order monitoring' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/menu-items', label: 'Menu Items' },
  { to: '/admin/news', label: 'News' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <aside className="w-full shrink-0 border-b border-gray-700 bg-gray-800 p-3 md:w-56 md:border-b-0 md:border-r md:p-4">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange text-white' : 'text-orange hover:bg-gray-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 bg-gray-900 p-3 sm:p-5 xl:p-6">
        <Outlet />
      </main>
    </div>
  )
}
