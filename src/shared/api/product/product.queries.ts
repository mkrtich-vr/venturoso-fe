import { queryOptions } from '@tanstack/react-query'
import { getCategories } from './get-categories'
import { getProduct } from './get-product'
import { getProducts } from './get-products'

/**
 * Query key factory — hierarchical and `as const`, so a prefix invalidates
 * everything beneath it:
 *
 *   all      -> ['products']
 *   lists    -> ['products', 'list']
 *   list(p)  -> ['products', 'list', { page, pageSize }]
 *   details  -> ['products', 'detail']
 *   detail(1)-> ['products', 'detail', 1]
 *
 * `queryClient.invalidateQueries({ queryKey: productKeys.all })` therefore
 * clears both lists and details in one call.
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...productKeys.lists(), { page, pageSize }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (productId: number) => [...productKeys.details(), productId] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
}

/**
 * Query factory. `queryOptions` gives full inference and lets the same
 * definition feed useQuery, prefetchQuery and setQueryData without repeating
 * the key. staleTime is colocated per family, tuned to how volatile the data is.
 */
export const productQueries = {
  list: (page: number, pageSize: number) =>
    queryOptions({
      queryKey: productKeys.list(page, pageSize),
      queryFn: ({ signal }) => getProducts({ limit: pageSize, skip: page * pageSize }, signal),
      // User-generated content: fresh enough for a minute.
      staleTime: 60_000,
    }),

  detail: (productId: number) =>
    queryOptions({
      queryKey: productKeys.detail(productId),
      queryFn: ({ signal }) => getProduct(productId, signal),
      staleTime: 5 * 60_000,
    }),

  categories: () =>
    queryOptions({
      queryKey: productKeys.categories(),
      queryFn: ({ signal }) => getCategories(signal),
      // Reference data: rarely changes.
      staleTime: 30 * 60_000,
    }),
}
