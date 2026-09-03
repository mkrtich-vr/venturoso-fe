import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Product } from '@/shared/api'
import { productQueries } from '@/shared/api'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui'
import { useUpdateProduct } from '../api/use-update-product'
import { PaginationControls } from './pagination-controls'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-list-skeleton'

const PAGE_SIZE = 6

export function ProductsPage() {
  const [page, setPage] = useState(0)

  // Server state: TanStack Query. The factory carries the key and staleTime,
  // so nothing about caching is decided here.
  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    ...productQueries.list(page, PAGE_SIZE),
    placeholderData: (previous) => previous,
  })

  const updateProduct = useUpdateProduct()

  const handleDiscount = (product: Product) => {
    updateProduct.mutate({
      productId: product.id,
      patch: { price: Number((product.price * 0.9).toFixed(2)) },
    })
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load products</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">Products</h1>
        <p className="text-muted-foreground">
          Paginated through TanStack Query, fetched from dummyjson.com.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: PAGE_SIZE }, (_, index) => <ProductCardSkeleton key={index} />)
          : data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDiscount={handleDiscount}
                isDiscounting={
                  updateProduct.isPending && updateProduct.variables.productId === product.id
                }
              />
            ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        canGoNext={!isPlaceholderData && !(totalPages > 0 && page + 1 >= totalPages)}
        onPageChange={setPage}
      />
    </div>
  )
}
