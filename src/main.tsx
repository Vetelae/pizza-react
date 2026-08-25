import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { useAuthStore } from '@/store/authStore'
import { isRateLimitError } from '@/utils/apiErrors'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !isRateLimitError(error) && failureCount < 3,
    },
  },
})

const getCartIdentity = () => {
  const { isAuthenticated, userId } = useAuthStore.getState()
  return isAuthenticated && userId ? `user:${userId}` : 'anonymous'
}

let cartIdentity = getCartIdentity()

useAuthStore.subscribe((state) => {
  const nextCartIdentity =
    state.isAuthenticated && state.userId
      ? `user:${state.userId}`
      : 'anonymous'

  if (nextCartIdentity !== cartIdentity) {
    queryClient.removeQueries({ queryKey: ['cart'] })
    cartIdentity = nextCartIdentity
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
