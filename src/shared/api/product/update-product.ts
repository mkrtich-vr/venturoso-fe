import { apiRequest } from '../client'
import type { Product, ProductPatch } from './product'

/**
 * DummyJSON simulates the update and echoes the merged product back — it does
 * not persist, which is fine for demonstrating the mutation + cache flow.
 */
export function updateProduct(productId: number, patch: ProductPatch): Promise<Product> {
  return apiRequest<Product>(`/products/${String(productId)}`, {
    method: 'PATCH',
    body: patch,
  })
}
