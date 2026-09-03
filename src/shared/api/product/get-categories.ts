import { apiRequest } from '../client'

export function getCategories(signal?: AbortSignal): Promise<string[]> {
  return apiRequest<string[]>('/products/category-list', { signal })
}
