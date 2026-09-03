import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { Product } from '@/shared/api'
import { ProductCard } from './product-card'

const product: Product = {
  id: 7,
  title: 'Ergonomic Desk Lamp',
  description: 'A lamp.',
  category: 'furniture',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 3,
  thumbnail: 'https://example.com/lamp.png',
  images: [],
}

function renderCard(overrides: Partial<Product> = {}, onDiscount = vi.fn()) {
  render(
    <MemoryRouter>
      <ProductCard
        product={{ ...product, ...overrides }}
        onDiscount={onDiscount}
        isDiscounting={false}
      />
    </MemoryRouter>,
  )
  return { onDiscount }
}

describe('ProductCard', () => {
  it('shows the discounted price alongside the original', () => {
    renderCard()
    expect(screen.getByText('$90.00')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('links to the product detail route', () => {
    renderCard()
    expect(screen.getByRole('link', { name: 'Ergonomic Desk Lamp' })).toHaveAttribute(
      'href',
      '/products/7',
    )
  })

  it('reports stock while the item is available', () => {
    renderCard()
    expect(screen.getByText('In stock: 3')).toBeInTheDocument()
  })

  it('marks the item out of stock when there is none left', () => {
    renderCard({ stock: 0 })
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('calls onDiscount with the product when the button is pressed', async () => {
    const user = userEvent.setup()
    const { onDiscount } = renderCard()

    await user.click(screen.getByRole('button', { name: 'Apply 10% off' }))

    expect(onDiscount).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }))
  })
})
