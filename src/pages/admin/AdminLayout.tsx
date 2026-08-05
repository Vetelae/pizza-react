import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  LuClipboardList,
  LuHistory,
  LuLayoutDashboard,
  LuMenu,
  LuNewspaper,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuPizza,
  LuTags,
  LuX,
} from 'react-icons/lu'
import { useActiveAdminOrders } from '@/hooks/admin/useAdminOrder'

interface AdminNavItem {
  label: string
  icon: IconType
  to?: string
  showActiveOrderCount?: boolean
}

interface AdminNavSection {
  title: string
  items: AdminNavItem[]
}

const navigationSections: AdminNavSection[] = [
  {
    title: 'Overview',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
      {
        to: '/admin/order-monitoring',
        label: 'Live Orders',
        icon: LuClipboardList,
        showActiveOrderCount: true,
      },
      { to: '/admin/order-history', label: 'Order History', icon: LuHistory },
    ],
  },
  {
    title: 'Menu Management',
    items: [
      { to: '/admin/menu-items', label: 'Menu', icon: LuPizza },
      { to: '/admin/categories', label: 'Categories', icon: LuTags },
    ],
  },
  {
    title: 'Content',
    items: [{ to: '/admin/news', label: 'News', icon: LuNewspaper }],
  },
]

const SIDEBAR_STORAGE_KEY = 'admin-sidebar-collapsed'

interface SidebarNavigationProps {
  activeOrderCount?: number
  collapsed?: boolean
  mobile?: boolean
  onNavigate?: () => void
}

function SidebarNavigation({
  activeOrderCount,
  collapsed = false,
  mobile = false,
  onNavigate,
}: SidebarNavigationProps) {
  const showDesktopLabels = !collapsed

  const labelClassName = mobile
    ? 'inline'
    : showDesktopLabels
      ? 'hidden lg:inline'
      : 'hidden'

  const itemAlignmentClassName = mobile
    ? 'justify-start'
    : showDesktopLabels
      ? 'justify-center lg:justify-start'
      : 'justify-center'

  const tooltipClassName = mobile
    ? 'hidden'
    : showDesktopLabels
      ? 'md:block lg:hidden'
      : 'md:block'

  const renderCount = (item: AdminNavItem, compact: boolean) => {
    if (!item.showActiveOrderCount || activeOrderCount === undefined) return null

    const countLabel = activeOrderCount > 99 ? '99+' : activeOrderCount

    if (compact) {
      return (
        <span
          className="absolute right-1.5 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[10px] font-bold leading-4 text-gray-950"
          aria-hidden="true"
        >
          {countLabel}
        </span>
      )
    }

    return (
      <span
        className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-orange/15 px-1.5 text-[11px] font-bold leading-5 text-orange"
        aria-hidden="true"
      >
        {countLabel}
      </span>
    )
  }

  return (
    <nav aria-label="Admin navigation">
      {navigationSections.map((section, sectionIndex) => (
        <div
          key={section.title}
          className={
            sectionIndex > 0 && (mobile || showDesktopLabels)
              ? mobile
                ? 'mt-5 border-t border-white/6 pt-5'
                : 'mt-2 lg:mt-5 lg:border-t lg:border-white/6 lg:pt-5'
              : sectionIndex > 0
                ? 'mt-2'
                : ''
          }
        >
          <h2
            className={
              mobile
                ? 'mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500'
                : showDesktopLabels
                  ? 'mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 lg:block'
                  : 'hidden'
            }
          >
            {section.title}
          </h2>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const accessibleLabel =
                item.showActiveOrderCount && activeOrderCount !== undefined
                  ? `${item.label}, ${activeOrderCount} active ${
                      activeOrderCount === 1 ? 'order' : 'orders'
                    }`
                  : item.label

              if (!item.to) {
                return (
                  <div
                    key={item.label}
                    role="link"
                    aria-disabled="true"
                    aria-label={item.label}
                    tabIndex={0}
                    className={`group relative flex h-11 cursor-not-allowed items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-500 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-orange/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${itemAlignmentClassName}`}
                  >
                    <Icon className="shrink-0 text-xl" aria-hidden="true" />
                    <span className={labelClassName}>{item.label}</span>
                    <span
                      className={`pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-gray-700 bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-gray-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${tooltipClassName}`}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={onNavigate}
                  aria-label={accessibleLabel}
                  className={({ isActive }) =>
                    `group relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-orange/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
                      isActive
                        ? 'bg-orange/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    } ${itemAlignmentClassName}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-orange"
                          aria-hidden="true"
                        />
                      )}
                      <Icon
                        className={`shrink-0 text-xl transition-colors ${
                          isActive ? 'text-orange' : 'text-gray-400 group-hover:text-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                      <span className={labelClassName}>{item.label}</span>

                      {mobile && renderCount(item, false)}
                      {!mobile && showDesktopLabels && (
                        <>
                          <span className="lg:hidden">{renderCount(item, true)}</span>
                          <span className="hidden lg:contents">{renderCount(item, false)}</span>
                        </>
                      )}
                      {!mobile && !showDesktopLabels && renderCount(item, true)}

                      <span
                        className={`pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-gray-700 bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-gray-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${tooltipClassName}`}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  const activeOrdersQuery = useActiveAdminOrders()
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    try {
      return window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null)
  const mobileDrawerRef = useRef<HTMLElement>(null)
  const activeOrderCount = activeOrdersQuery.data?.length

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(isDesktopCollapsed)
      )
    } catch {
      // The sidebar still works if browser storage is unavailable.
    }
  }, [isDesktopCollapsed])

  useEffect(() => {
    if (!isMobileOpen) return

    const previousOverflow = document.body.style.overflow
    const mobileMenuButton = mobileMenuButtonRef.current
    document.body.style.overflow = 'hidden'
    mobileCloseButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = mobileDrawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )

      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      mobileMenuButton?.focus()
    }
  }, [isMobileOpen])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-900">
      <div className="flex h-12 items-center border-b border-white/6 bg-gray-800 px-3 md:hidden">
        <button
          ref={mobileMenuButtonRef}
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-controls="admin-mobile-sidebar"
          aria-expanded={isMobileOpen}
          className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-sm font-semibold text-gray-200 outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-orange/80"
        >
          <LuMenu className="text-xl text-orange" aria-hidden="true" />
          Admin navigation
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside
          className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 self-start border-r border-white/6 bg-linear-to-b from-gray-800 to-gray-900/95 px-2 py-4 shadow-[4px_0_18px_rgba(0,0,0,0.12)] transition-[width] duration-200 motion-reduce:transition-none md:block md:w-18 ${
            isDesktopCollapsed ? 'lg:w-18' : 'lg:w-52'
          }`}
        >
          <div
            className={`mb-4 hidden h-9 items-center lg:flex ${
              isDesktopCollapsed ? 'justify-center' : 'justify-end px-1'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsDesktopCollapsed((collapsed) => !collapsed)}
              aria-controls="admin-desktop-nav"
              aria-expanded={!isDesktopCollapsed}
              aria-label={
                isDesktopCollapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'
              }
              title={
                isDesktopCollapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-orange/80"
            >
              {isDesktopCollapsed ? (
                <LuPanelLeftOpen className="text-xl" aria-hidden="true" />
              ) : (
                <LuPanelLeftClose className="text-xl" aria-hidden="true" />
              )}
            </button>
          </div>

          <div id="admin-desktop-nav">
            <SidebarNavigation
              activeOrderCount={activeOrderCount}
              collapsed={isDesktopCollapsed}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-gray-900 p-3 sm:p-5 xl:p-6">
          <Outlet />
        </main>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close admin navigation"
          />

          <aside
            ref={mobileDrawerRef}
            id="admin-mobile-sidebar"
            className="relative h-full w-72 max-w-[85vw] overflow-y-auto border-r border-white/6 bg-linear-to-b from-gray-800 to-gray-900 px-3 py-4 shadow-2xl"
          >
            <div className="mb-5 flex h-10 items-center justify-between border-b border-white/6 px-2 pb-4">
              <span className="font-semibold text-white">Admin navigation</span>
              <button
                ref={mobileCloseButtonRef}
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close admin navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-orange/80"
              >
                <LuX className="text-xl" aria-hidden="true" />
              </button>
            </div>

            <SidebarNavigation
              activeOrderCount={activeOrderCount}
              mobile
              onNavigate={() => setIsMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </div>
  )
}
