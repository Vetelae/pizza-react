import { useConfirmEmail } from '@/hooks/public/useAuth'
import { useAuthStore } from '@/store/authStore'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { isRateLimitError } from '@/utils/apiErrors'

type ConfirmationTone = 'loading' | 'success' | 'error'

interface ConfirmationStatusCardProps {
  children?: ReactNode
  description: string
  icon: ReactNode
  role: 'status' | 'alert'
  title: string
  tone: ConfirmationTone
}

const toneClassNames: Record<ConfirmationTone, string> = {
  loading: 'bg-orange/15 text-amber-700 ring-orange/25',
  success: 'bg-green-50 text-green-700 ring-green-200',
  error: 'bg-red-50 text-red-700 ring-red-200',
}

function ConfirmationStatusCard({
  children,
  description,
  icon,
  role,
  title,
  tone,
}: ConfirmationStatusCardProps) {
  const titleId = `confirmation-${tone}-title`

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6">
      <section
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center
          shadow-lg ring-1 ring-orange/20 sm:px-9 sm:py-10"
      >
        <div
          role={role}
          aria-live={role === 'alert' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <div
            aria-hidden="true"
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full
              text-2xl ring-1 ${toneClassNames[tone]}`}
          >
            {icon}
          </div>

          <h1 id={titleId} className="mt-6 text-2xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600 sm:text-base">
            {description}
          </p>
        </div>

        {children && <div className="mt-7 flex flex-col gap-3">{children}</div>}
      </section>
    </div>
  )
}

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const openLogin = useAuthStore((state) => state.openLogin)
  const { mutate: confirmEmail, isPending, isSuccess, isError, error } = useConfirmEmail()
  const hasFired = useRef(false)

  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!userId || !token) return
    if (hasFired.current) return
    hasFired.current = true
    confirmEmail({ userId, token })
  }, [userId, token, confirmEmail])

  if (isPending || (!isSuccess && !isError))
    return (
      <ConfirmationStatusCard
        role="status"
        tone="loading"
        title="Verifying your email"
        description="This should only take a moment. Please keep this page open."
        icon={<FaSpinner className="motion-safe:animate-spin" />}
      />
    )

  if (isError)
    return (
      <ConfirmationStatusCard
        role="alert"
        tone="error"
        title="We couldn't verify your email"
        description={
          isRateLimitError(error)
            ? 'Too many verification attempts. Please wait and try again.'
            : 'This confirmation link may have expired or already been used.'
        }
        icon={<FaExclamationTriangle />}
      >
        <button
          type="button"
          onClick={() => {
            navigate('/home')
            openLogin()
          }}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl
            bg-orange px-5 py-3 text-sm font-bold text-gray-950 shadow-sm transition
            hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-orange active:scale-[0.99] motion-reduce:transform-none"
        >
          Go to sign in
        </button>
        <Link
          to="/home"
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-4
            text-sm font-semibold text-gray-600 transition-colors hover:text-orange
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Back to home
        </Link>
      </ConfirmationStatusCard>
    )

  if (isSuccess)
    return (
      <ConfirmationStatusCard
        role="status"
        tone="success"
        title="Email verified!"
        description="Your account is ready. We're taking you to Pizza Shop."
        icon={<FaCheck />}
      >
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl
            bg-orange px-5 py-3 text-sm font-bold text-gray-950 shadow-sm transition
            hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-orange active:scale-[0.99] motion-reduce:transform-none"
        >
          Continue now
        </button>
        <p className="text-xs text-gray-500">Redirecting automatically...</p>
      </ConfirmationStatusCard>
    )

  return null
}
