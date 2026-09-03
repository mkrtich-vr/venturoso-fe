import { apiRequest } from '../client'
import type { Product } from './product'

export function getProduct(productId: number, signal?: AbortSignal): Promise<Product> {
  return apiRequest<Product>(`/products/${String(productId)}`, { signal })
}
