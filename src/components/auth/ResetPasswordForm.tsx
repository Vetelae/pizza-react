import { useForm } from 'react-hook-form'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useResetPassword } from '@/hooks/useAuth'
import type { ResetPasswordDto } from '@/types/auth'

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const { mutate: resetPassword, isPending, error, isSuccess } = useResetPassword()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<ResetPasswordDto, 'email' | 'token'>>()

  const onSubmit = (data: Omit<ResetPasswordDto, 'email' | 'token'>) => {
    resetPassword({ ...data, email, token })
  }

  if (!token || !email) {
    return (
      <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 px-4">
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
          Invalid or missing reset link. Please request a new one.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Back to home
        </button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 px-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your password has been reset successfully.
        </p>

        <hr className="text-zinc-400" />

        <div className="flex items-center justify-center">
          <p className="text-zinc-900 dark:text-zinc-50 font-semibold">
            Ready to sign in?
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Sign in here
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 max-w-sm mx-auto mt-16 px-4"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          New password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register('newPassword', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm
            bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10
            transition-shadow"
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Confirm password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === watch('newPassword') || 'Passwords do not match',
          })}
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm
            bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400
            focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10
            transition-shadow"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
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
        {isPending ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  )
}