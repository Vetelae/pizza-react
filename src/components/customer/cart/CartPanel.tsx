import { useCallback, useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useCartStore } from '@/store/cartStore'
import { useCart } from '@/hooks/public/useCart'
import CartView from './CartView'
import CheckoutView from './CheckoutView'

type View = 'cart' | 'checkout'

export default function CartPanel() {
  const [view, setView] = useState<View>('cart')
  const { isCartOpen, closeCart } = useCartStore()
  const { data: cart } = useCart()
  const panelRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const onClose = useCallback(() => {
    closeCart()
    setTimeout(() => setView('cart'), 300)
  }, [closeCart])

  useEffect(() => {
    if (!isCartOpen) return

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    const animationFrame = requestAnimationFrame(() => {
      const firstFocusableElement =
        panelRef.current?.querySelector<HTMLElement>(focusableSelector)
      const initialFocusTarget = firstFocusableElement ?? panelRef.current

      initialFocusTarget?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault()
        const focusTarget = event.shiftKey ? lastElement : firstElement
        focusTarget.focus()
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isCartOpen, onClose])

  useEffect(() => {
    if (!isCartOpen) return

    const animationFrame = requestAnimationFrame(() => {
      titleRef.current?.focus()
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [isCartOpen, view])

  useEffect(() => {
    document.documentElement.style.overflow = isCartOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isCartOpen])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isCartOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-panel-title"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-full flex-col
          border-l border-zinc-200 bg-white p-5 outline-none transition-transform
          duration-300 ease-in-out sm:w-107.5 sm:p-6 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2
              ref={titleRef}
              id="cart-panel-title"
              tabIndex={-1}
              className="text-xl font-bold text-zinc-900 outline-none"
            >
              {view === 'cart' ? 'Your Cart' : 'Checkout'}
            </h2>
            {view === 'cart' && itemCount > 0 && (
              <span
                aria-label={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
                aria-live="polite"
                className="rounded-full bg-orange px-2 py-0.5 text-xs font-bold text-gray-900"
              >
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg p-2 text-zinc-400 transition-colors
              hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {view === 'cart' && (
          <CartView onCheckout={() => setView('checkout')} />
        )}
        {view === 'checkout' && (
          <CheckoutView onBack={() => setView('cart')} onClose={onClose} />
        )}
      </aside>
    </>
  )
}
