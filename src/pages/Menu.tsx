import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCheck, FaPlus, FaUtensils } from 'react-icons/fa'
import type { MenuItem } from '@/types/menuItem'
import { useMenuItems } from '@/hooks/public/useMenuItems'
import { useCategories } from '@/hooks/public/useCategories'
import { useAddCartItem } from '@/hooks/public/useCart'
import { formatCurrency } from '@/utils/formatters'
import { getImageUrl } from '@/utils/imageUrl'

function MenuSkeleton() {
  return (
    <div
      aria-label="Loading menu"
      className="mx-auto w-full max-w-7xl animate-pulse px-6 pb-20 motion-reduce:animate-none md:px-10"
    >
      <div className="mb-8 h-10 w-40 rounded-lg bg-orange/15" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-gray-800 shadow-lg"
          >
            <div className="aspect-square bg-gray-700" />
            <div className="space-y-4 p-5">
              <div className="h-6 w-2/3 rounded bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 rounded bg-gray-700" />
                <div className="h-4 w-4/5 rounded bg-gray-700" />
              </div>
              <div className="h-12 rounded-xl bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface MenuCardProps {
  item: MenuItem
  isAdding: boolean
  isAdded: boolean
  hasAddError: boolean
  disableAdd: boolean
  onAdd: (item: MenuItem) => void
}

function MenuCard({
  item,
  isAdding,
  isAdded,
  hasAddError,
  disableAdd,
  onAdd,
}: MenuCardProps) {
  const imageUrl = getImageUrl(item.imagePath)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-lg ring-1 ring-gray-900/10 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-orange/35 focus-within:ring-2 focus-within:ring-orange motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
            <FaUtensils aria-hidden="true" className="text-4xl" />
            <span className="text-sm font-medium">Image unavailable</span>
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/65">
            <span className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-gray-900 shadow-md">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-tight text-orange">
            {item.name}
          </h3>
          <p className="shrink-0 rounded-full bg-orange/15 px-3 py-1 text-base font-bold text-orange">
            {formatCurrency(item.price)}
          </p>
        </div>

        {item.description && (
          <p className="mt-3 flex-1 text-sm leading-6 text-gray-300">
            {item.description}
          </p>
        )}

        <button
          type="button"
          onClick={() => onAdd(item)}
          disabled={!item.isAvailable || disableAdd}
          className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none ${
            isAdded
              ? 'bg-pea text-white'
              : item.isAvailable
                ? 'bg-orange text-gray-900 hover:brightness-110'
                : 'bg-gray-600 text-gray-300'
          }`}
        >
          {isAdded ? (
            <FaCheck aria-hidden="true" />
          ) : (
            item.isAvailable && <FaPlus aria-hidden="true" />
          )}
          <span aria-live="polite">
            {!item.isAvailable
              ? 'Sold out'
              : isAdding
                ? 'Adding...'
                : isAdded
                  ? 'Added'
                  : 'Add to cart'}
          </span>
        </button>

        {hasAddError && (
          <p role="alert" className="mt-3 text-center text-sm text-red-300">
            Couldn&apos;t add this item. Please try again.
          </p>
        )}
      </div>
    </article>
  )
}

function Menu() {
  const {
    data: menuItems,
    isLoading: menuItemsLoading,
    isError: menuItemsError,
    isFetching: menuItemsFetching,
    refetch: refetchMenuItems,
  } = useMenuItems()
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    isFetching: categoriesFetching,
    refetch: refetchCategories,
  } = useCategories()
  const addCartItem = useAddCartItem()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [addingItemId, setAddingItemId] = useState<number | null>(null)
  const [addedItemId, setAddedItemId] = useState<number | null>(null)
  const [addErrorItemId, setAddErrorItemId] = useState<number | null>(null)
  const stickyNavRef = useRef<HTMLDivElement>(null)
  const addedFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const visibleCategories = useMemo(
    () =>
      categories?.filter((category) =>
        menuItems?.some((item) => item.categoryId === category.id)
      ) ?? [],
    [categories, menuItems]
  )

  useEffect(() => {
    if (visibleCategories.length === 0) return

    setActiveCategory((currentCategory) =>
      visibleCategories.some((category) => category.id === currentCategory)
        ? currentCategory
        : visibleCategories[0].id
    )
  }, [visibleCategories])

  useEffect(
    () => () => {
      if (addedFeedbackTimeoutRef.current) {
        clearTimeout(addedFeedbackTimeoutRef.current)
      }
    },
    []
  )

  const scrollToSection = (id: number) => {
    const element = document.getElementById(String(id))

    if (element) {
      const navbarHeight = 64
      const categoryNavHeight = stickyNavRef.current?.offsetHeight ?? 0
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        categoryNavHeight -
        20

      window.scrollTo({ top, behavior: 'smooth' })
    }

    setActiveCategory(id)
  }

  useEffect(() => {
    if (visibleCategories.length === 0) return

    const handleScroll = () => {
      const navbarHeight = 64
      const categoryNavHeight = stickyNavRef.current?.offsetHeight ?? 0
      const offset = navbarHeight + categoryNavHeight + 32

      for (const category of [...visibleCategories].reverse()) {
        const element = document.getElementById(String(category.id))

        if (element && element.getBoundingClientRect().top <= offset) {
          setActiveCategory(category.id)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleCategories])

  const handleAddToCart = async (item: MenuItem) => {
    if (!item.isAvailable || addCartItem.isPending) return

    setAddingItemId(item.id)
    setAddErrorItemId(null)

    try {
      await addCartItem.mutateAsync({
        menuItemId: item.id,
        quantity: 1,
      })
      setAddedItemId(item.id)

      if (addedFeedbackTimeoutRef.current) {
        clearTimeout(addedFeedbackTimeoutRef.current)
      }

      addedFeedbackTimeoutRef.current = setTimeout(() => {
        setAddedItemId(null)
      }, 1800)
    } catch {
      setAddErrorItemId(item.id)
    } finally {
      setAddingItemId(null)
    }
  }

  const isLoading = menuItemsLoading || categoriesLoading
  const isError = menuItemsError || categoriesError
  const isRetrying = menuItemsFetching || categoriesFetching

  return (
    <div className="min-h-screen bg-powder">
      <header className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <p className="text-sm font-bold tracking-[0.2em] text-orange uppercase">
          Freshly prepared
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
          Find Your
          <span className="text-orange"> Favorite</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700 md:text-lg md:leading-8">
          Explore our pizzas, kebabs, salads, sides, and drinks—all prepared
          fresh and ready to enjoy.
        </p>
      </header>

      {visibleCategories.length > 0 && !isError && (
        <div
          ref={stickyNavRef}
          className="sticky top-16 z-40 border-y border-orange/25 bg-gray-900/95 shadow-lg shadow-black/20 backdrop-blur"
        >
          <nav
            aria-label="Menu categories"
            className="mx-auto w-full max-w-7xl overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 md:px-10 [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max min-w-full items-stretch gap-2 md:justify-center">
              {visibleCategories.map((category) => {
                const isActive = activeCategory === category.id
                const imageUrl = getImageUrl(category.imagePath)

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => scrollToSection(category.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex min-w-20 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold whitespace-nowrap transition sm:min-w-22 sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                      isActive
                        ? 'bg-orange text-gray-900 shadow-md ring-2 ring-cream/80'
                        : 'text-cream hover:bg-orange/15 hover:text-orange'
                    }`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                        className={`h-16 w-16 rounded-lg object-cover ring-2 sm:h-20 sm:w-20 ${
                          isActive ? 'ring-gray-900/20' : 'ring-orange/25'
                        }`}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-700 text-xs sm:h-20 sm:w-20"
                      >
                        {category.name.charAt(0)}
                      </span>
                    )}
                    {category.name}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      )}

      <main>
        {isLoading && <MenuSkeleton />}

        {isError && (
          <section
            role="alert"
            className="mx-auto mb-20 max-w-xl rounded-2xl bg-cream px-6 py-10 text-center shadow-lg ring-1 ring-orange/15"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              We couldn&apos;t load the menu
            </h2>
            <p className="mt-3 text-gray-600">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => {
                void Promise.all([refetchMenuItems(), refetchCategories()])
              }}
              disabled={isRetrying}
              className="mt-6 min-h-11 rounded-xl bg-orange px-6 py-3 font-bold text-gray-900 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-wait disabled:opacity-70"
            >
              {isRetrying ? 'Trying again...' : 'Try again'}
            </button>
          </section>
        )}

        {!isLoading && !isError && visibleCategories.length === 0 && (
          <section className="mx-auto mb-20 max-w-xl rounded-2xl bg-cream px-6 py-10 text-center shadow-lg ring-1 ring-orange/15">
            <FaUtensils
              aria-hidden="true"
              className="mx-auto text-4xl text-orange"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              The menu is being prepared
            </h2>
            <p className="mt-3 text-gray-600">
              Please check back soon for today&apos;s selection.
            </p>
          </section>
        )}

        {!isLoading && !isError && visibleCategories.length > 0 && (
          <div className="mx-auto w-full max-w-7xl space-y-20 px-6 pb-20 pt-12 md:px-10 md:pt-16">
            {visibleCategories.map((category) => {
              const categoryItems =
                menuItems?.filter(
                  (item) => item.categoryId === category.id
                ) ?? []

              return (
                <section
                  key={category.id}
                  id={String(category.id)}
                  aria-labelledby={`category-${category.id}-heading`}
                  className="scroll-mt-36"
                >
                  <div className="mb-8 flex items-end justify-between gap-6">
                    <div>
                      <p className="text-sm font-bold tracking-[0.18em] text-orange uppercase">
                        Fresh from the kitchen
                      </p>
                      <h2
                        id={`category-${category.id}-heading`}
                        className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl"
                      >
                        {category.name}
                      </h2>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-gray-500">
                      {categoryItems.length}{' '}
                      {categoryItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        isAdding={addingItemId === item.id}
                        isAdded={addedItemId === item.id}
                        hasAddError={addErrorItemId === item.id}
                        disableAdd={addCartItem.isPending}
                        onAdd={handleAddToCart}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Menu
