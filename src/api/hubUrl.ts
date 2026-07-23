export const getHubUrl = (hubPath: string) => {
  const normalizedHubPath = hubPath.replace(/^\/+/, '')
  const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined

  if (!configuredApiUrl) return `/${normalizedHubPath}`

  const url = new URL(configuredApiUrl, window.location.origin)
  const apiPath = url.pathname.replace(/\/+$/, '')
  const basePath = apiPath.endsWith('/api') ? apiPath.slice(0, -4) : apiPath

  url.pathname = `${basePath}/${normalizedHubPath}`.replace(/\/{2,}/g, '/')
  url.search = ''
  url.hash = ''

  return url.toString()
}
