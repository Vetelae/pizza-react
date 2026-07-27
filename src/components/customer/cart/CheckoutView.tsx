import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { CheckoutDto } from '@/types/cart'
import { useCart, useCheckout } from '@/hooks/public/useCart'
import { OrderType, PaymentMethod } from '@/types/enums'
import { useProfile } from '@/hooks/public/useAuth'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/utils/formatters'

interface CheckoutViewProps {
  onBack: () => void
  onClose: () => void
}

export default function CheckoutView({ onBack, onClose }: CheckoutViewProps) {
  const { data: cart } = useCart()
  const { data: profile } = useProfile()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const checkout = useCheckout()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
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
    const order = await checkout.mutateAsync(data)
    onClose()
    const search = order.lookupToken
      ? `?token=${encodeURIComponent(order.lookupToken)}`
      : ''
    navigate(`/orders/${order.id}${search}`)
  }

  const items = cart?.items ?? []
  const orderType = watch('type')

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-md text-sm bg-zinc-800 border text-zinc-100
     outline-none transition-colors placeholder:text-zinc-500
     focus:ring-2 focus:ring-orange/50 focus:border-orange
     ${hasError ? 'border-red-500' : 'border-zinc-700'}`

  const errorClass = 'mt-1 text-xs text-red-400'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-zinc-400 hover:text-orange
          transition-colors text-xs mb-4 w-fit"
      >
        ← Back to cart
      </button>

      {/* Order summary (compact) */}
      <div className="bg-zinc-800 rounded-lg p-3 mb-4">
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-2">
          Order summary
        </p>
        <ul className="space-y-1 mb-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-xs text-zinc-300">
              <span className="truncate mr-2">
                {item.menuItemName} × {item.quantity}
              </span>
              <span className="shrink-0">{formatCurrency(item.total)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-zinc-700 pt-2 flex justify-between">
          <span className="text-zinc-400 text-xs">Total</span>
          <span className="text-orange font-bold text-sm">
            {formatCurrency(cart?.subtotal ?? 0)}
          </span>
        </div>
      </div>

      {/* Checkout form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0 overflow-y-auto space-y-3 pr-1"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Full name</label>
          <input
            {...register('customerName', { required: 'Name is required' })}
            readOnly={isAuthenticated}
            placeholder="Jane Doe"
            className={`${inputClass(!!errors.customerName)} ${isAuthenticated ? 'cursor-not-allowed opacity-75' : ''}`}
          />
          {errors.customerName && <p className={errorClass}>{errors.customerName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
          <input
            {...register('customerEmail', { required: 'Email is required' })}
            type="email"
            readOnly={isAuthenticated}
            placeholder="jane@example.com"
            className={`${inputClass(!!errors.customerEmail)} ${isAuthenticated ? 'cursor-not-allowed opacity-75' : ''}`}
          />
          {errors.customerEmail && <p className={errorClass}>{errors.customerEmail.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Phone</label>
          <input
            {...register('customerPhone', { required: 'Phone is required' })}
            type="tel"
            placeholder="+358 40 123 4567"
            className={inputClass(!!errors.customerPhone)}
          />
          {errors.customerPhone && <p className={errorClass}>{errors.customerPhone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Order type</label>
          <select
            {...register('type', {
              required: 'Order type is required',
              setValueAs: (value) => Number(value),
            })}
            className={inputClass(!!errors.type)}
          >
            <option value={OrderType.Pickup}>Pickup</option>
            <option value={OrderType.Delivery}>Delivery</option>
          </select>
          {errors.type && <p className={errorClass}>{errors.type.message}</p>}
        </div>

        {/* Only shown when Delivery is selected */}
        {orderType === OrderType.Delivery && (
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Delivery address
            </label>
            <input
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
              <p className={errorClass}>{errors.deliveryAddress.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Payment method
          </label>
          <select
            {...register('paymentMethod', {
              required: 'Payment method is required',
              setValueAs: (value) => Number(value),
            })}
            className={inputClass(!!errors.paymentMethod)}
          >
            <option value={PaymentMethod.Cash}>Cash</option>
            <option value={PaymentMethod.Card}>Card</option>
          </select>
          {errors.paymentMethod && <p className={errorClass}>{errors.paymentMethod.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Notes <span className="text-zinc-500">(optional)</span>
          </label>
          <textarea
            {...register('notes')}
            placeholder="Allergies, special requests..."
            rows={2}
            className={`${inputClass(false)} resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="pt-2 mt-auto">
          <button
            type="submit"
            disabled={checkout.isPending}
            className="w-full bg-orange text-gray-900 font-bold py-2.5 rounded-lg
              hover:brightness-110 transition-all text-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkout.isPending ? 'Placing order...' : 'Place Order'}
          </button>
          {checkout.isError && (
            <p className="mt-2 text-xs text-red-400 text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
