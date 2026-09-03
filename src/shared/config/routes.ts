/**
 * Route paths in one place, so pages and links can never drift apart.
 * Route *constants* are shared infrastructure; the router itself lives in
 * the app layer (`@/app/router`).
 */
export const ROUTES = {
  home: '/',
  products: '/products',
  productDetail: (productId: number | string) => `/products/${String(productId)}`,
} as const

/** Pattern form, for the route table (the functions above are for linking). */
export const ROUTE_PATTERNS = {
  home: '/',
  products: '/products',
  productDetail: '/products/:productId',
  notFound: '*',
} as const
