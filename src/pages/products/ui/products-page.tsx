import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Product } from '@/shared/api'
import { productQueries } from '@/shared/api'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@/shared/ui'
import { useUpdateProduct } from '../api/use-update-product'
import { ProductCard } from './product-card'

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

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => {
            setPage((current) => Math.max(0, current - 1))
          }}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {String(page + 1)}
          {totalPages > 0 && ` of ${String(totalPages)}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={isPlaceholderData || (totalPages > 0 && page + 1 >= totalPages)}
          onClick={() => {
            setPage((current) => current + 1)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-32" />
      </CardContent>
    </Card>
  )
}
