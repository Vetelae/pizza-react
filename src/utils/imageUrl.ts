export const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return null

  return `${import.meta.env.VITE_BASE_URL ?? ''}${imagePath}`
}
