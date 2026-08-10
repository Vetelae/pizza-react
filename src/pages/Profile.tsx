import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ProfileOrderHistory from '@/components/customer/orders/ProfileOrderHistory'
import { useProfile, useUpdateProfile } from '@/hooks/public/useAuth'
import type { UpdateProfileDto } from '@/types/auth'

export default function Profile() {
  const { data: profile, isLoading, isError } = useProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileDto>()

  useEffect(() => {
    if (!profile) return

    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber ?? '',
      address: profile.address ?? '',
    })
  }, [profile, reset])

  const onSubmit = async (data: UpdateProfileDto) => {
    const updatedProfile = await updateProfile.mutateAsync({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phoneNumber: data.phoneNumber?.trim() || null,
      address: data.address?.trim() || null,
    })

    reset({
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      phoneNumber: updatedProfile.phoneNumber ?? '',
      address: updatedProfile.address ?? '',
    })

    toast.success('Profile updated successfully.')
  }

  const inputClass = (hasError = false) =>
    `w-full rounded-md border bg-zinc-800 px-3 py-2 text-sm text-zinc-100
     outline-none transition-colors placeholder:text-zinc-500
     focus:border-orange focus:ring-2 focus:ring-orange/50
     ${hasError ? 'border-red-500' : 'border-zinc-700'}`

  const errorClass = 'mt-1 text-xs text-red-400'

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border border-gray-700 bg-gray-800 p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  First name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    validate: (value) => !!value.trim() || 'First name is required',
                  })}
                  className={inputClass(!!errors.firstName)}
                />
                {errors.firstName && (
                  <p className={errorClass}>{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Last name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    validate: (value) => !!value.trim() || 'Last name is required',
                  })}
                  className={inputClass(!!errors.lastName)}
                />
                {errors.lastName && (
                  <p className={errorClass}>{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  value={profile.email ?? ''}
                  readOnly
                  className={`${inputClass()} cursor-not-allowed opacity-75`}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Phone number
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  placeholder="+358 40 123 4567"
                  className={inputClass()}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Address
                </label>
                <input
                  {...register('address')}
                  placeholder="Street, city, postcode"
                  className={inputClass()}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-gray-700 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-5">
                {updateProfile.isError && (
                  <p className="text-sm text-red-400">
                    Could not update your profile. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={updateProfile.isPending || !isDirty}
                className="rounded-lg bg-orange px-5 py-2.5 text-sm font-bold text-gray-900
                  transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {profile && <ProfileOrderHistory />}
      </div>
    </section>
  )
}
