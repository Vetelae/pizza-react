import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useConfirmEmail } from '@/hooks/useAuth'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: confirmEmail, isPending, isError, isSuccess } = useConfirmEmail()

  const userId = searchParams.get('userId')
  const token = searchParams.get('token')
  
  useEffect(() => {
    if (userId && token) {
      confirmEmail({ userId, token })
    }
  }, [userId, token, confirmEmail])

// View to display if pending state with email verification
if (isPending)
    return (
  <div className="flex flex-col gap-6 max-w-sm mx-auto mt-20 px-4">
    <p className="text-xl text-center font-bold text-green-600 px-3 py-2 rounded-lg">
      Verifying your email...
    </p>
  </div>
)

// View to display if error state with email verification
if (isError) return (
  <div className="flex flex-col gap-6 max-w-sm mx-auto mt-16 px-4">
    <p className="text-xl text-center font-bold text-red-500 px-3 py-2 rounded-lg">
      Verification failed.
      <br/>The link may have expired.
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

// View to display if success state with email verification
if (isSuccess) return (
  <div className="flex flex-col gap-6 max-w-sm mx-auto mt-20 px-4">
    <p className="text-xl text-center font-bold text-green-600 px-3 py-2 rounded-lg">
      Email verified!<br />
      Redirecting you to the app...
    </p>
  </div>
)

return null
}