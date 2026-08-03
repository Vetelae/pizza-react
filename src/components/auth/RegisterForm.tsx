import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import type { RegisterDto } from '@/types/auth'
import { useRegister } from '@/hooks/public/useAuth'

interface RegisterFormProps {
  onLoginClick: () => void
  onVerifyClick: () => void
}

export default function RegisterForm({ onLoginClick, onVerifyClick }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: registerUser, isPending, error } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>()

  const onSubmit = (data: RegisterDto) => {
    registerUser(data, { onSuccess: () => onVerifyClick() })
  }

  const inputClassName = `rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm
    text-zinc-900 transition-shadow placeholder:text-zinc-400 focus:border-orange
    focus:outline-none focus:ring-2 focus:ring-orange/25`

  return (
    <>
      <p className="mb-6 text-sm text-zinc-600">
        Create your account with your name, email and a password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-first-name" className="text-sm font-medium text-zinc-700">
            First name
          </label>
          <input
            id="register-first-name"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-invalid={!!errors.firstName}
            {...register('firstName', { required: 'First name is required' })}
            className={inputClassName}
          />
          {errors.firstName && (
            <p className="text-xs text-red-700">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-last-name" className="text-sm font-medium text-zinc-700">
            Last name
          </label>
          <input
            id="register-last-name"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-invalid={!!errors.lastName}
            {...register('lastName', { required: 'Last name is required' })}
            className={inputClassName}
          />
          {errors.lastName && (
            <p className="text-xs text-red-700">{errors.lastName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
            })}
            className={inputClassName}
          />
          {errors.email && (
            <p className="text-xs text-red-700">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-describedby="register-password-hint"
              aria-invalid={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              className={`${inputClassName} w-full pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center
                rounded-r-lg text-zinc-500 transition-colors hover:text-zinc-900
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
          <p id="register-password-hint" className="text-xs text-zinc-500">
            Use at least 8 characters.
          </p>
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
          {isPending ? 'Creating account…' : 'Create account'}
        </button>

        <hr className="my-2 border-zinc-200" />

        <p className="text-center font-semibold text-zinc-900">Already have an account?</p>

        <button
          type="button"
          onClick={onLoginClick}
          className="text-sm font-medium text-orange transition-colors hover:text-amber-600
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Sign in here
        </button>
      </form>
    </>
  )
}
