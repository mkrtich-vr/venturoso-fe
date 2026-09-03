import { Card, CardContent, CardHeader, Skeleton } from '@/shared/ui'

/** Placeholder card shown while the first page of products is loading. */
export function ProductCardSkeleton() {
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
