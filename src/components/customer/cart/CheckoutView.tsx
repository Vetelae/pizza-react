import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import type { CheckoutDto } from '@/types/cart'
import { useCart, useCheckout } from '@/hooks/public/useCart'
import { OrderType, PaymentMethod } from '@/types/enums'
import { useProfile } from '@/hooks/public/useAuth'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/utils/formatters'
import { isRateLimitError } from '@/utils/apiErrors'

interface CheckoutViewProps {
  onBack: () => void
  onClose: () => void
}

export default function CheckoutView({
  onBack,
  onClose,
}: CheckoutViewProps) {
  const { data: cart } = useCart()
  const { data: profile } = useProfile()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const checkout = useCheckout()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutDto>({
    defaultValues: { type: OrderType.Pickup },
  })

  useEffect(() => {
    if (!isAuthenticated || !profile) return

    const fullName = `${profile.firstName} ${profile.lastName}`.trim()

    if (!getValues('customerName') && fullName) {
      setValue('customerName', fullName)
    }

    if (!getValues('customerEmail') && profile.email) {
      setValue('customerEmail', profile.email)
    }

    if (!getValues('customerPhone') && profile.phoneNumber) {
      setValue('customerPhone', profile.phoneNumber)
    }

    if (!getValues('deliveryAddress') && profile.address) {
      setValue('deliveryAddress', profile.address)
    }
  }, [getValues, isAuthenticated, profile, setValue])

  const onSubmit = async (data: CheckoutDto) => {
    try {
      const order = await checkout.mutateAsync(data)
      onClose()
      const search = order.lookupToken
        ? `?token=${encodeURIComponent(order.lookupToken)}`
        : ''
      navigate(`/orders/${order.id}${search}`)
    } catch {
      // The mutation state renders the contextual error below.
    }
  }

  const items = cart?.items ?? []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart?.subtotal ?? 0
  const orderType = useWatch({ control, name: 'type' })

  const inputClass = (hasError: boolean) =>
    `w-full min-h-11 px-3 py-2 rounded-lg text-sm bg-zinc-800 border text-zinc-100
     outline-none transition-colors placeholder:text-zinc-500
     focus:ring-2 focus:ring-orange/50 focus:border-orange
     ${hasError ? 'border-red-500' : 'border-zinc-700'}`

  const errorClass = 'mt-1 text-xs text-red-500'
  const sectionHeadingClass =
    'mb-3 text-sm font-bold uppercase tracking-[0.12em] text-zinc-800'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex w-fit items-center gap-1.5 rounded-md text-xs
          font-medium text-zinc-500 transition-colors hover:text-orange
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-orange"
      >
        <FaArrowLeft aria-hidden="true" className="text-[10px]" />
        Back to cart
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 overflow-y-auto pr-1 pb-4">
          <section
            aria-labelledby="order-summary-heading"
            className="mb-6 rounded-xl bg-zinc-800 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3
                id="order-summary-heading"
                className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-300"
              >
                Order summary
              </h3>
              <span className="text-xs text-zinc-400">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <ul className="divide-y divide-zinc-700">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-2.5 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="wrap-break-word text-sm font-semibold text-zinc-100">
                      {item.menuItemName}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {formatCurrency(item.unitPrice)} &times; {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-zinc-100">
                    {formatCurrency(item.total)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-1 border-t border-zinc-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Subtotal</span>
                <span className="text-base font-bold text-orange">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">Taxes included</p>
            </div>
          </section>

          <section aria-labelledby="customer-details-heading" className="mb-6">
            <h3 id="customer-details-heading" className={sectionHeadingClass}>
              Customer
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-1 block text-xs font-medium text-zinc-600"
                >
                  Full name
                </label>
                <input
                  id="checkout-name"
                  {...register('customerName', {
                    required: 'Name is required',
                  })}
                  readOnly={isAuthenticated}
                  placeholder="Jane Doe"
                  className={`${inputClass(!!errors.customerName)} ${
                    isAuthenticated ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                />
                {errors.customerName && (
                  <p className={errorClass}>{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="mb-1 block text-xs font-medium text-zinc-600"
                >
                  Email
                </label>
                <input
                  id="checkout-email"
                  {...register('customerEmail', {
                    required: 'Email is required',
                  })}
                  type="email"
                  readOnly={isAuthenticated}
                  placeholder="jane@example.com"
                  className={`${inputClass(!!errors.customerEmail)} ${
                    isAuthenticated ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                />
                {errors.customerEmail && (
                  <p className={errorClass}>{errors.customerEmail.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="mb-1 block text-xs font-medium text-zinc-600"
                >
                  Phone
                </label>
                <input
                  id="checkout-phone"
                  {...register('customerPhone', {
                    required: 'Phone is required',
                  })}
                  type="tel"
                  placeholder="+358 40 123 4567"
                  className={inputClass(!!errors.customerPhone)}
                />
                {errors.customerPhone && (
                  <p className={errorClass}>{errors.customerPhone.message}</p>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="order-details-heading" className="mb-6">
            <h3 id="order-details-heading" className={sectionHeadingClass}>
              Order
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="checkout-order-type"
                  className="mb-1 block text-xs font-medium text-zinc-600"
                >
                  Order type
                </label>
                <select
                  id="checkout-order-type"
                  {...register('type', {
                    required: 'Order type is required',
                    setValueAs: (value) => Number(value),
                  })}
                  className={inputClass(!!errors.type)}
                >
                  <option value={OrderType.Pickup}>Pickup</option>
                  <option value={OrderType.Delivery}>Delivery</option>
                </select>
                {errors.type && (
                  <p className={errorClass}>{errors.type.message}</p>
                )}
              </div>

              {orderType === OrderType.Delivery && (
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1 block text-xs font-medium text-zinc-600"
                  >
                    Delivery address
                  </label>
                  <input
                    id="checkout-address"
                    {...register('deliveryAddress', {
                      validate: (value) =>
                        orderType !== OrderType.Delivery ||
                        !!value?.trim() ||
                        'Address is required for delivery',
                    })}
                    placeholder="Street, city, postcode"
                    className={inputClass(!!errors.deliveryAddress)}
                  />
                  {errors.deliveryAddress && (
                    <p className={errorClass}>
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="checkout-payment-method"
                  className="mb-1 block text-xs font-medium text-zinc-600"
                >
                  Payment method
                </label>
                <select
                  id="checkout-payment-method"
                  {...register('paymentMethod', {
                    required: 'Payment method is required',
                    setValueAs: (value) => Number(value),
                  })}
                  className={inputClass(!!errors.paymentMethod)}
                >
                  <option value={PaymentMethod.Cash}>Cash</option>
                  <option value={PaymentMethod.Card}>Card</option>
                </select>
                {errors.paymentMethod && (
                  <p className={errorClass}>{errors.paymentMethod.message}</p>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="order-notes-heading">
            <h3 id="order-notes-heading" className={sectionHeadingClass}>
              Notes
            </h3>
            <label htmlFor="checkout-notes" className="sr-only">
              Notes (optional)
            </label>
            <textarea
              id="checkout-notes"
              {...register('notes')}
              placeholder="Allergies, special requests..."
              rows={3}
              className={`${inputClass(false)} resize-none`}
            />
            <p className="mt-1 text-xs text-zinc-400">Optional</p>
          </section>
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <button
            type="submit"
            disabled={checkout.isPending}
            className="w-full rounded-xl bg-orange px-4 py-3 text-sm font-bold
              text-gray-900 shadow-sm transition hover:brightness-110
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-orange disabled:cursor-not-allowed
              disabled:opacity-50"
          >
            {checkout.isPending ? (
              'Placing order...'
            ) : (
              <>
                Place order &bull; {formatCurrency(subtotal)}
              </>
            )}
          </button>
          {checkout.isError && (
            <p role="alert" className="mt-2 text-center text-xs text-red-500">
              {isRateLimitError(checkout.error)
                ? 'Please wait before trying to place another order.'
                : 'Something went wrong. Please try again.'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
