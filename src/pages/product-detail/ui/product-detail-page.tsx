import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { productQueries } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { applyDiscount, formatPrice } from '@/shared/lib'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Separator,
  Skeleton,
} from '@/shared/ui'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const parsedId = Number(productId)

  const { data, isPending, isError, error } = useQuery({
    ...productQueries.detail(parsedId),
    enabled: Number.isFinite(parsedId),
  })

  if (!Number.isFinite(parsedId)) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Invalid product</AlertTitle>
        <AlertDescription>“{productId}” is not a valid product id.</AlertDescription>
      </Alert>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this product</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-40" />
      </div>
    )
  }

  return (
    <article className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        render={<Link to={ROUTES.products} />}
        nativeButton={false}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        All products
      </Button>

      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">{data.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{data.category}</Badge>
          {data.brand !== undefined && <Badge variant="outline">{data.brand}</Badge>}
          <Badge variant="outline">Rating {data.rating.toFixed(1)}</Badge>
        </div>
      </header>

      <Separator />

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold">
          {formatPrice(applyDiscount(data.price, data.discountPercentage))}
        </span>
        {data.discountPercentage > 0 && (
          <>
            <span className="text-muted-foreground line-through">{formatPrice(data.price)}</span>
            <span className="rounded-md bg-success px-2 py-0.5 text-sm text-success-foreground">
              −{data.discountPercentage.toFixed(0)}%
            </span>
          </>
        )}
      </div>

      <p className="max-w-2xl text-muted-foreground">{data.description}</p>

      {data.stock <= 10 && (
        <p className="w-fit rounded-md bg-warning px-3 py-1.5 text-sm text-warning-foreground">
          Only {String(data.stock)} left in stock
        </p>
      )}
    </article>
  )
}
