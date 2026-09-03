/**
 * Public API for the `api` segment.
 *
 * FSD note: the shared layer has no slices, so it gets one barrel PER SEGMENT
 * (shared/api, shared/ui, shared/lib, ...) rather than a single
 * `shared/index.ts`. This keeps imports organised by intent.
 */
export { ApiError, apiRequest } from './client'
export * from './product'
