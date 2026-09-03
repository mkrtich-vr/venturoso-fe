import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

/**
 * One QueryClient for the app, created at module scope so it survives re-renders.
 * Per-query staleTime overrides live in the query factories
 * (`@/shared/api/product/product.queries`); this is only the baseline.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default is 0, which refetches on every mount. One minute is a saner
      // floor; volatile data overrides it downward, reference data upward.
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
