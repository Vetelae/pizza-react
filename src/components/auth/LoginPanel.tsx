import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import { useLogin } from '@/hooks/useAuth'
import type { LoginDto } from '@/types/auth'

export default function LoginPanel() {
  const { isLoginOpen, closeLogin } = useAuthStore()
  const { mutate: login, isPending, error, reset } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>()

  // Close on Escape — valid DOM side effect, not data fetching
  useEffect(() => {
    if (!isLoginOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLogin() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isLoginOpen, closeLogin])

  // Lock body scroll — valid DOM side effect
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isLoginOpen])

  const onClose = () => {
    closeLogin()
    reset() // clear any API error when closing
  }

  const onSubmit = (data: LoginDto) => {
    login(data)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isLoginOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-900
          border-l border-zinc-100 dark:border-zinc-800 z-50
          flex flex-col p-8 transition-transform duration-300 ease-in-out
          ${isLoginOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h2>
          <button
            onClick={onClose}
            aria-label="Close sign in panel"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
              p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                Forgot password?
              </button>
            </div>
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

          {/* API error from mutation */}
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
        </form>
      </aside>
    </>
  )
}