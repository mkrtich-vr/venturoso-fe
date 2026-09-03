import { apiRequest } from '../client'
import type { ProductListResponse } from './product'

export function getProducts(
  { limit, skip }: { limit: number; skip: number },
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  return apiRequest<ProductListResponse>('/products', {
    signal,
    searchParams: { limit, skip },
  })
}
