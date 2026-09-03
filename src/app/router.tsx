import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/home'
import { ROUTE_PATTERNS } from '@/shared/config'
import { RootLayout } from './root-layout'
import { RouteErrorBoundary } from './route-error-boundary'

/**
 * React Router in **Data mode** — route objects + createBrowserRouter, without
 * adopting the framework Vite plugin or file-based route conventions.
 *
 * Deliberately no `loader`/`action`: TanStack Query owns server state in this
 * project. Keeping fetching in one layer avoids double-fetching and the
 * revalidation/cache tug-of-war you get when both systems own the same data.
 *
 * Route objects live outside render, and the heavier routes are code-split via
 * `lazy` so the initial bundle only carries the shell and the home page.
 */
export const router = createBrowserRouter([
  {
    path: ROUTE_PATTERNS.home,
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      {
        path: ROUTE_PATTERNS.products,
        lazy: async () => {
          const { ProductsPage } = await import('@/pages/products')
          return { Component: ProductsPage }
        },
      },
      {
        path: ROUTE_PATTERNS.productDetail,
        lazy: async () => {
          const { ProductDetailPage } = await import('@/pages/product-detail')
          return { Component: ProductDetailPage }
        },
      },
      {
        path: ROUTE_PATTERNS.notFound,
        lazy: async () => {
          const { NotFoundPage } = await import('@/pages/not-found')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
