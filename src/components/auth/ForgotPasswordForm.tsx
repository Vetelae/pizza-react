import { useForm } from 'react-hook-form'
import type { ForgotPasswordDto } from '@/types/auth'
import { useForgotPassword } from '@/hooks/public/useAuth'

interface ForgotPasswordFormProps {
  onLoginClick: () => void
}

export default function ForgotPasswordForm({ onLoginClick }: ForgotPasswordFormProps) {
  const { mutate: forgotPassword, isPending, error, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>()

  const onSubmit = (data: ForgotPasswordDto) => {
    forgotPassword(data)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-600">
          If that email is registered, you'll receive a password reset link shortly.
        </p>

        <p className="text-sm text-zinc-500">
          Didn't receive it? Check your spam folder.
        </p>

        <hr className="my-2 border-zinc-200" />

        <div className="flex items-center justify-center">
          <p className="font-semibold text-zinc-900">
            Remembered your password?
          </p>
        </div>

        <button
          type="button"
          onClick={onLoginClick}
          className="text-sm font-medium text-orange transition-colors hover:text-amber-600
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Sign in here
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <p className="text-sm text-zinc-600">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm
            text-zinc-900 transition-shadow placeholder:text-zinc-400
            focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/25"
        />
        {errors.email && (
          <p className="text-xs text-red-700">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {(error as Error).message ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 rounded-lg bg-orange py-2.5 text-sm font-bold text-gray-950
          transition-colors hover:bg-amber-400 focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-orange
          disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send reset link'}
      </button>

      <hr className="my-2 border-zinc-200" />

      <div className="flex items-center justify-center">
        <p className="font-semibold text-zinc-900">
          Remembered your password?
        </p>
      </div>

      <button
        type="button"
        onClick={onLoginClick}
        className="text-sm font-medium text-orange transition-colors hover:text-amber-600
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        Sign in here
      </button>
    </form>
  )
}
