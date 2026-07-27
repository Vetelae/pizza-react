const APP_LOCALE = 'en-GB'

const currencyFormatter = new Intl.NumberFormat(APP_LOCALE, {
  style: 'currency',
  currency: 'EUR',
})

const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  weekday: 'long',
})

const dateTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/

export const formatCurrency = (value: number) =>
  currencyFormatter.format(Number(value))

export const formatDate = (value: string) => {
  const dateParts = ISO_DATE_PATTERN.exec(value)

  if (dateParts) {
    const [, year, month, day] = dateParts
    return `${day}/${month}/${year}`
  }

  return dateFormatter.format(new Date(value))
}

export const formatDateWithWeekday = (value: string) => {
  const dateParts = ISO_DATE_PATTERN.exec(value)
  const date = dateParts
    ? new Date(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3]))
    : new Date(value)

  return `${weekdayFormatter.format(date)} - ${formatDate(value)}`
}

export const formatDateTime = (value: string) =>
  dateTimeFormatter.format(new Date(value))

export const toDateInputValue = (value: string) =>
  ISO_DATE_PATTERN.exec(value)?.[0] ?? ''
