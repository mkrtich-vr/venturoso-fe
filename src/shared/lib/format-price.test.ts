import { describe, expect, it } from 'vitest'
import { applyDiscount, formatPrice } from './format-price'

describe('formatPrice', () => {
  it('formats a value as USD by default', () => {
    expect(formatPrice(1999.5)).toBe('$1,999.50')
  })

  it('respects an explicit currency and locale', () => {
    // Non-breaking space is what Intl actually emits, hence the regex.
    expect(formatPrice(10, 'EUR', 'de-DE')).toMatch(/^10,00\s€$/u)
  })

  it('rounds to two fraction digits', () => {
    expect(formatPrice(0.005)).toBe('$0.01')
  })
})

describe('applyDiscount', () => {
  it('reduces the price by the given percentage', () => {
    expect(applyDiscount(100, 25)).toBe(75)
  })

  it('returns the original price when the discount is zero', () => {
    expect(applyDiscount(49.99, 0)).toBe(49.99)
  })
})
