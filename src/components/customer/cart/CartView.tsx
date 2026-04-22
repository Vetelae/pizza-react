import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart'

interface CartViewProps {
  onCheckout: () => void
}

export default function CartView({ onCheckout }: CartViewProps) {
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-orange text-sm">Loading cart...</p>
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <span className="text-4xl">🛒</span>
        <p className="text-zinc-400 text-sm">Your cart is empty.</p>
        <p className="text-zinc-500 text-xs">Add something from the menu!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable item list */}
      <ul className="flex-1 overflow-y-auto space-y-3 pr-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 items-start bg-zinc-800 rounded-lg p-3"
          >
            {/* Name + price + quantity */}
            <div className="flex-1 min-w-0">
              <p className="text-orange font-semibold text-sm truncate">{item.menuItemName}</p>
              <p className="text-zinc-400 text-xs mt-0.5">
                ${item.unitPrice.toFixed(2)} each · ${item.total.toFixed(2)}
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem.mutate({ cartItemId: item.id, dto: { quantity: item.quantity - 1 } })
                      : removeItem.mutate(item.id)
                  }
                  className="w-6 h-6 rounded-full bg-zinc-700 text-orange hover:bg-orange hover:text-gray-900
                    transition-colors text-sm font-bold flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-orange text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItem.mutate({ cartItemId: item.id, dto: { quantity: item.quantity + 1 } })
                  }
                  className="w-6 h-6 rounded-full bg-zinc-700 text-orange hover:bg-orange hover:text-gray-900
                    transition-colors text-sm font-bold flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeItem.mutate(item.id)}
              className="text-zinc-500 hover:text-red-400 transition-colors text-lg leading-none shrink-0 mt-0.5"
              aria-label="Remove item"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Subtotal + CTA */}
      <div className="border-t border-zinc-700 pt-4 mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Subtotal</span>
          <span className="text-orange font-bold text-lg">
            ${cart?.subtotal?.toFixed(2) ?? '0.00'}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-orange text-gray-900 font-bold py-2.5 rounded-lg
            hover:brightness-110 transition-all text-sm"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  )
}