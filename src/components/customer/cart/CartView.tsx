import { useMemo, useState } from 'react'
import { FaMinus, FaPlus, FaShoppingCart, FaTimes, FaUtensils } from 'react-icons/fa'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/public/useCart'
import { useMenuItems } from '@/hooks/public/useMenuItems'
import { formatCurrency } from '@/utils/formatters'
import { getImageUrl } from '@/utils/imageUrl'

interface CartViewProps {
  onCheckout: () => void
}

export default function CartView({ onCheckout }: CartViewProps) {
  const { data: cart, isLoading } = useCart()
  const { data: menuItems } = useMenuItems()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(
    () => new Set()
  )

  const menuItemsById = useMemo(
    () => new Map(menuItems?.map((item) => [item.id, item]) ?? []),
    [menuItems]
  )

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status">
        <p className="text-sm font-medium text-orange">Loading cart...</p>
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-2xl text-orange"
        >
          <FaShoppingCart />
        </span>
        <p className="text-sm font-medium text-zinc-500">
          Your cart is empty.
        </p>
        <p className="text-xs text-zinc-400">Add something from the menu!</p>
      </div>
    )
  }

  const isAnyMutationPending = updateItem.isPending || removeItem.isPending

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className="flex-1 space-y-3 overflow-y-auto pr-1 pb-1">
        {items.map((item) => {
          const menuItem = menuItemsById.get(item.menuItemId)
          const imageUrl = getImageUrl(menuItem?.imagePath)
          const showImage = imageUrl && !failedImageIds.has(item.menuItemId)
          const isUpdating =
            updateItem.isPending &&
            updateItem.variables?.cartItemId === item.id
          const isRemoving =
            removeItem.isPending && removeItem.variables === item.id
          const hasUpdateError =
            updateItem.isError &&
            updateItem.variables?.cartItemId === item.id
          const hasRemoveError =
            removeItem.isError && removeItem.variables === item.id
          const hasMutationError = hasUpdateError || hasRemoveError

          return (
            <li
              key={item.id}
              aria-busy={isUpdating || isRemoving}
              className="rounded-xl bg-zinc-800 p-3.5 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex gap-3">
                <div className="h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                  {showImage ? (
                    <img
                      src={imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedImageIds((currentIds) => {
                          const nextIds = new Set(currentIds)
                          nextIds.add(item.menuItemId)
                          return nextIds
                        })
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`Image unavailable for ${item.menuItemName}`}
                      className="flex h-full w-full items-center justify-center text-xl text-zinc-400"
                    >
                      <FaUtensils aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 wrap-break-word text-sm font-bold leading-5 text-orange">
                      {item.menuItemName}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={isAnyMutationPending}
                      aria-label={`Remove ${item.menuItemName} from cart`}
                      className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors
                        hover:bg-zinc-700 hover:text-red-300 focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-orange
                        disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaTimes aria-hidden="true" className="text-xs" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-xs text-zinc-400">
                    {formatCurrency(item.unitPrice)} each
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem.mutate({
                                cartItemId: item.id,
                                dto: { quantity: item.quantity - 1 },
                              })
                            : removeItem.mutate(item.id)
                        }
                        disabled={isAnyMutationPending}
                        aria-label={`Decrease quantity of ${item.menuItemName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full
                          bg-zinc-700 text-orange transition-colors hover:bg-orange
                          hover:text-gray-900 focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-orange
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaMinus aria-hidden="true" className="text-[10px]" />
                      </button>
                      <span
                        aria-label={`Quantity ${item.quantity}`}
                        aria-live="polite"
                        className="w-6 text-center text-sm font-semibold text-zinc-100"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateItem.mutate({
                            cartItemId: item.id,
                            dto: { quantity: item.quantity + 1 },
                          })
                        }
                        disabled={isAnyMutationPending}
                        aria-label={`Increase quantity of ${item.menuItemName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full
                          bg-zinc-700 text-orange transition-colors hover:bg-orange
                          hover:text-gray-900 focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-orange
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaPlus aria-hidden="true" className="text-[10px]" />
                      </button>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-zinc-100">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              </div>

              {hasMutationError && (
                <p role="alert" className="mt-2 text-xs text-red-300">
                  Couldn&apos;t update this item. Please try again.
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-4 border-t border-zinc-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-600">Subtotal</span>
          <span className="text-lg font-bold text-zinc-900">
            {formatCurrency(cart?.subtotal ?? 0)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-400">Taxes included</p>
        <button
          type="button"
          onClick={onCheckout}
          className="mt-4 w-full rounded-xl bg-orange px-4 py-3 text-sm font-bold
            text-gray-900 shadow-sm transition hover:brightness-110
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-orange"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}
