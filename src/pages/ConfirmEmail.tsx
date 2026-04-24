import { useConfirmEmail } from '@/hooks/public/useAuth'
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: confirmEmail, isPending, isSuccess, isError } = useConfirmEmail()
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
      <div className="flex flex-col gap-6 max-w-sm mx-auto mt-20 px-4">
        <p className="text-xl text-center font-bold text-green-600 px-3 py-2 rounded-lg">
          Verifying your email...
        </p>
      </div>
    )

  if (isError)
    return (
      <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 px-4">
        <p className="text-xl text-center font-bold text-red-500 px-3 py-2 rounded-lg">
          Verification failed.
          <br />
          The link may have expired.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs bg-gray-700 text-orange hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors mt-10"
        >
          Back to home
        </button>
      </div>
    )

  if (isSuccess)
    return (
      <div className="flex flex-col gap-6 max-w-sm mx-auto mt-20 px-4">
        <p className="text-xl text-center font-bold text-green-600 px-3 py-2 rounded-lg">
          Email verified!
          <br />
          Redirecting you to the app...
        </p>
      </div>
    )

  return null
}