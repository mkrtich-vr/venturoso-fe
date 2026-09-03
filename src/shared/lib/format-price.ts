/**
 * Formats a number as a currency string.
 *
 * Domain-named file (`format-price.ts`), not a catch-all `utils.ts` — FSD rule
 * 4-4 forbids technical-role filenames because they collect unrelated domains.
 */
export function formatPrice(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/** Applies a percentage discount and returns the resulting price. */
export function applyDiscount(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100)
}
