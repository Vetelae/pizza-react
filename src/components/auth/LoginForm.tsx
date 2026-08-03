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
      <p className="mb-6 text-sm text-zinc-600">
        Sign in with your email and password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="login-email"
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm
              text-zinc-900 transition-shadow placeholder:text-zinc-400
              focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/25"
          />
          {errors.password && (
            <p className="text-xs text-red-700">{errors.password.message}</p>
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
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={onForgotClick}
          className="text-sm font-medium text-orange transition-colors hover:text-amber-600
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Forgot password?
        </button>

        <hr className="my-2 border-zinc-200" />

        <p className="text-center font-semibold text-zinc-900">
          Don&apos;t have an account yet?
        </p>

        <button
          type="button"
          onClick={onRegisterClick}
          className="text-sm font-medium text-orange transition-colors hover:text-amber-600
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Register here
        </button>
      </form>
    </>
  )
}
