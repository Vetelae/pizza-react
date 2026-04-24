import { useEffect, useRef, useState } from 'react'
import type { MenuItem } from '@/types/menuItem'
import { CartModal } from '@/components/customer/cart/CartModal'
import { useMenuItems } from '@/hooks/public/useMenuItems'
import { useCategories } from '@/hooks/public/useCategories'

function Menu() {
  const { data: menuItems, isLoading: menuItemsLoading, isError: menuItemsError } = useMenuItems()
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const stickyNavRef = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

    // Set first category as active once categories load
  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0].id)
    }
  }, [categories])

  const scrollToSection = (id: number) => {
    const el = document.getElementById(String(id))
    if (el) {
      const navHeight = 64
      const stickyHeight = stickyNavRef.current?.offsetHeight ?? 0
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - stickyHeight - 12
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActiveCategory(id)
  }

  // Highlight active section on scroll
  useEffect(() => {
    if (!categories) return
    const handleScroll = () => {
      const navHeight = 64
      const stickyHeight = stickyNavRef.current?.offsetHeight ?? 0
      const offset = navHeight + stickyHeight + 24

      for (const cat of [...categories].reverse()) {
        const el = document.getElementById(String(cat.id))
        if (el && el.getBoundingClientRect().top <= offset) {
          setActiveCategory(cat.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories])

  const isLoading = menuItemsLoading || categoriesLoading
  const isError = menuItemsError || categoriesError

  return (
    <div className="min-h-screen mt-10">

      <CartModal
        isOpen={selectedItem !== null}
        menuItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* ── Always-visible sticky category nav ── */}
      <div
        ref={stickyNavRef}
        className="fixed top-16 left-0 right-0 z-40"
      >
        <div className="bg-gray-900/95 backdrop-blur border-b border-orange/30 shadow-lg shadow-black/40">
          <div className="flex items-center justify-center gap-1 px-4 py-2 max-w-3xl mx-auto">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                  transition-all duration-200 whitespace-nowrap
                  ${activeCategory === cat.id
                    ? 'bg-orange text-gray-900'
                    : 'text-orange hover:bg-orange/15'}
                `}
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${cat.imagePath}`}
                  alt={cat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer to push content below the sticky nav */}
      <div className="h-14" />

      {isLoading && <p className="text-orange">Loading menu...</p>}
      {isError && <p className="text-orange">Failed to load menu.</p>}

      {/* ── Menu sections ── */}
{categories?.map((cat) => (
  <div key={cat.id} id={String(cat.id)} className="mt-5 scroll-mt-32">
    <div className="flex-1 flex items-center justify-center">
      <div className="grid grid-cols-1 mb-12 md:grid-cols-4 gap-6 w-full max-w-6xl">

        <h2 className="underline underline-offset-4 text-4xl font-semibold text-left mb-2 text-orange col-span-full">
          {cat.name}
        </h2>

        {menuItems
          ?.filter((item) => item.categoryId === cat.id)
          .map((item) => (
            <div key={item.id} className="bg-gray-700 rounded-lg shadow-md p-6 flex flex-col">
              <h2 className="text-orange font-bold text-xl md:text-2xl mb-4">{item.name}</h2>
              <p className="text-orange text-sm md:text-base grow">{item.description}</p>
              <h2 className="text-orange text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">
                {item.price}$
              </h2>
              <img
                src={`${import.meta.env.VITE_BASE_URL}${item.imagePath}`}
                alt={item.name}
                className="mt-3 border border-orange rounded-lg w-48 mx-auto md:w-full"
              />
              <button 
              onClick={() => setSelectedItem(item)}
              className="mt-5 bg-gray-900 text-orange"
              >
                Order now!
              </button>
            </div>
          ))}

      </div>
    </div>

    <hr className="h-px mt-5 mb-10 bg-orange border-0" />
  </div>
))}

    </div>
  )
}

export default Menu