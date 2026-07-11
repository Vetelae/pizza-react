import { useProfile } from '@/hooks/public/useAuth'

export default function Profile() {
  const { data: profile, isLoading, isError } = useProfile()

  const details = [
    { label: 'First name', value: profile?.firstName },
    { label: 'Last name', value: profile?.lastName },
    { label: 'Email', value: profile?.email },
    { label: 'Phone number', value: profile?.phoneNumber },
    { label: 'Address', value: profile?.address },
  ]

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange">Profile</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your saved account details for faster checkout.
          </p>
        </div>

        {isLoading && (
          <p className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-zinc-300">
            Loading profile...
          </p>
        )}

        {isError && (
          <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            Could not load your profile details.
          </p>
        )}

        {profile && (
          <dl className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
            {details.map(detail => (
              <div
                key={detail.label}
                className="grid gap-1 border-b border-gray-700 px-4 py-4 last:border-b-0 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="text-sm font-medium text-zinc-400">{detail.label}</dt>
                <dd className="text-sm text-zinc-100 sm:col-span-2">
                  {detail.value || 'Not provided'}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
