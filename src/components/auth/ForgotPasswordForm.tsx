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
      <div className="flex flex-col gap-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          If that email is registered, you'll receive a password reset link shortly.
        </p>

        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Didn't receive it? Check your spam folder.
        </p>

        <hr className="text-zinc-400" />

        <div className="flex items-center justify-center">
          <p className="text-zinc-900 dark:text-zinc-50 font-semibold">
            Remembered your password?
          </p>
        </div>

        <button
          type="button"
          onClick={onLoginClick}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Sign in here
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm
            bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10
            transition-shadow"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
          {(error as Error).message ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900
          rounded-lg py-2.5 text-sm font-medium
          hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Sending…' : 'Send reset link'}
      </button>

      <hr className="text-zinc-400 mt-5" />

      <div className="flex items-center justify-center mt-5">
        <p className="text-zinc-900 font-semibold">
          Remembered your password?
        </p>
      </div>

      <button
        type="button"
        onClick={onLoginClick}
        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
      >
        Sign in here
      </button>
    </form>
  )
}