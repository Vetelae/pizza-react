import type { IconType } from 'react-icons'

interface KpiCardProps {
  label: string
  value: string
  description: string
  icon: IconType
  accentClassName: string
  iconClassName: string
}

export default function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  accentClassName,
  iconClassName,
}: KpiCardProps) {
  return (
    <article
      className={`min-h-44 rounded-md border border-l-4 border-gray-700 bg-gray-800 p-5 ${accentClassName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-300">{label}</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
            {value}
          </p>
        </div>
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconClassName}`}
          aria-hidden="true"
        >
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-xs text-gray-400">{description}</p>
    </article>
  )
}
