/**
 * Raw API shapes for the product resource. Domain-named (`product.ts`) rather
 * than a generic `types.ts`, per FSD rule 4-4.
 */
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
}

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

/** Fields the demo API accepts on a PATCH. */
export interface ProductPatch {
  title?: string
  price?: number
  stock?: number
}
