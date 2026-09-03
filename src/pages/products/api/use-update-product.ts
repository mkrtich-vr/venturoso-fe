import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productKeys, updateProduct } from '@/shared/api'
import type { Product, ProductPatch } from '@/shared/api'

/**
 * Mutation lives in the page that uses it, not next to the queries — FSD keeps
 * mutations near their point of use, and the query factory stays read-only.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, patch }: { productId: number; patch: ProductPatch }) =>
      updateProduct(productId, patch),

    onSuccess: (updated: Product, variables) => {
      // Write the fresh record straight into the detail cache — no refetch needed.
      queryClient.setQueryData(productKeys.detail(variables.productId), updated)
      // Lists are derived data, so invalidate just those rather than everything
      // under productKeys.all (which would needlessly drop every detail entry).
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
