interface VerifyEmailProps {
  onLoginClick: () => void
}

export default function VerifyEmail({ onLoginClick }: VerifyEmailProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-zinc-600">
        We sent a verification link to your email. Click the link in the email to finish creating your account.
      </p>

      <p className="text-sm text-zinc-500">
        Didn't receive it? Check your spam folder.
      </p>

      <hr className="my-2 border-zinc-200" />

      <div className="flex items-center justify-center">
        <p className="font-semibold text-zinc-900">
          Already verified?
        </p>
      </div>

      <button
        type="button"
        onClick={onLoginClick}
        className="text-sm font-medium text-orange transition-colors hover:text-amber-600
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        Sign in here
      </button>
    </div>
  )
}
