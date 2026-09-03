const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

/** Thrown for any non-2xx response, so callers can branch on status. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  /** Forwarded from TanStack Query so in-flight requests cancel on unmount. */
  signal?: AbortSignal | undefined
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  searchParams?: Record<string, string | number | undefined>
}

/**
 * Minimal typed fetch wrapper. Infrastructure only — it knows nothing about any
 * specific resource, which is what keeps it legal in the shared layer.
 */
export async function apiRequest<TResponse>(
  path: string,
  { signal, method = 'GET', body, searchParams }: RequestOptions = {},
): Promise<TResponse> {
  const url = new URL(path, BASE_URL)

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed: ${String(response.status)} ${response.statusText}`,
    )
  }

  // `response.json()` is `any` by definition — this is the trust boundary where
  // an untyped payload becomes a typed one. Validate with a schema library here
  // if the API ever stops being trusted.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return (await response.json()) as TResponse
}
