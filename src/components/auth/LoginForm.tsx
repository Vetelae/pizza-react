import { useForm } from 'react-hook-form'
import type { LoginDto } from '@/types/auth'
import { useLogin } from '@/hooks/public/useAuth'

interface LoginFormProps {
  onRegisterClick: () => void
  onForgotClick: () => void
}

export default function LoginForm({ onRegisterClick, onForgotClick }: LoginFormProps) {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>()

  const onSubmit = (data: LoginDto) => {
    login(data)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm font-semibold text-zinc-900">Sign in with your email and password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm
              bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400
              focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10
              transition-shadow"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
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
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={onForgotClick}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Forgot password?
        </button>

        <hr className="text-zinc-400 mt-5" />

        <div className="flex items-center justify-center mt-5">
          <p className="text-zinc-900 font-semibold">
            Don't have an account yet?
          </p>
        </div>

        <button
          type="button"
          onClick={onRegisterClick}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Register here
        </button>
      </form>
    </>
  )
}