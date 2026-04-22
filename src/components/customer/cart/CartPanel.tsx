import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useCartStore } from '@/store/cartStore'
import CartView from './CartView'
import CheckoutView from './CheckoutView'

type View = 'cart' | 'checkout'

export default function CartPanel() {
  const [view, setView] = useState<View>('cart')
  const { isCartOpen, closeCart } = useCartStore()
  const { data: cart } = useCart()

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  // Escape key
  useEffect(() => {
    if (!isCartOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isCartOpen])

  // Scroll lock
  useEffect(() => {
    document.documentElement.style.overflow = isCartOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [isCartOpen])

  const onClose = () => {
    closeCart()
    setTimeout(() => setView('cart'), 300) // reset view after slide-out animation
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-zinc-900
          border-l border-zinc-100 dark:border-zinc-800 z-50
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {view === 'cart' ? 'Your Cart' : 'Checkout'}
            </h2>
            {view === 'cart' && itemCount > 0 && (
              <span className="bg-orange text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
              p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* View switcher */}
        {view === 'cart' && (
          <CartView onCheckout={() => setView('checkout')} />
        )}
        {view === 'checkout' && (
          <CheckoutView
            onBack={() => setView('cart')}
            onClose={onClose}
          />
        )}
      </aside>
    </>
  )
}