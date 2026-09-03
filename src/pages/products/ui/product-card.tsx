import { Link } from 'react-router'
import type { Product } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { applyDiscount, formatPrice } from '@/shared/lib'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui'

interface ProductCardProps {
  product: Product
  onDiscount: (product: Product) => void
  isDiscounting: boolean
}

/**
 * Page-local component. FSD says start in `pages` and only extract to a lower
 * layer once something is genuinely reused in more than one place — so this
 * stays here until a second page needs it.
 */
export function ProductCard({ product, onDiscount, isDiscounting }: ProductCardProps) {
  const hasDiscount = product.discountPercentage > 0
  const finalPrice = applyDiscount(product.price, product.discountPercentage)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">
          <Link to={ROUTES.productDetail(product.id)} className="hover:underline">
            {product.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{product.category}</Badge>
          {product.stock > 0 ? (
            <Badge variant="outline">In stock: {product.stock}</Badge>
          ) : (
            <Badge variant="destructive">Out of stock</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          disabled={isDiscounting}
          onClick={() => {
            onDiscount(product)
          }}
        >
          {isDiscounting ? 'Applying…' : 'Apply 10% off'}
        </Button>
      </CardFooter>
    </Card>
  )
}
