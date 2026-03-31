import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/menu-items', label: 'Menu Items' },
  { to: '/admin/news', label: 'News' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen pt-16">
      <aside className="w-56 bg-gray-800 border-r border-gray-700 p-4">
        <nav className="flex flex-col gap-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange text-white' : 'text-orange hover:bg-gray-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}