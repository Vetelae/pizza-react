interface VerifyEmailProps {
  onLoginClick: () => void
}

export default function VerifyEmail({ onLoginClick }: VerifyEmailProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        We sent a verification link to your email. Click the link in the email to finish creating your account.
      </p>

      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        Didn't receive it? Check your spam folder.
      </p>

      <hr className="text-zinc-400" />

      <div className="flex items-center justify-center">
        <p className="text-zinc-900 dark:text-zinc-50 font-semibold">
          Already verified?
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