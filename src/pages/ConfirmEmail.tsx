import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useConfirmEmail } from '@/hooks/useAuth'

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const { mutate: confirmEmail, isPending, isError, isSuccess } = useConfirmEmail()

  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  useEffect(() => {
    if (userId && token) {
      confirmEmail({ userId, token })
    }
  }, [])

  if (isPending) return <p>Verifying your email...</p>
  if (isError) return <p className="text-red-500">Verification failed. The link may have expired.</p>
  if (isSuccess) return <p className="text-green-500">Email verified! Redirecting you to the app...</p>
  return null
}