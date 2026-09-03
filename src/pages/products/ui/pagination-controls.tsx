import { Button } from '@/shared/ui'

interface PaginationControlsProps {
  page: number
  totalPages: number
  canGoNext: boolean
  onPageChange: (updater: (current: number) => number) => void
}

/**
 * Extracted from ProductsPage: paging is its own concern, and splitting it kept
 * both components under the 50-line function limit the linter enforces.
 */
export function PaginationControls({
  page,
  totalPages,
  canGoNext,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 0}
        onClick={() => {
          onPageChange((current) => Math.max(0, current - 1))
        }}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {String(page + 1)}
        {totalPages > 0 && ` of ${String(totalPages)}`}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!canGoNext}
        onClick={() => {
          onPageChange((current) => current + 1)
        }}
      >
        Next
      </Button>
    </div>
  )
}
