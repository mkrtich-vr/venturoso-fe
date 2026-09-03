import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui'

/**
 * Route-level error boundary. Scoped to a section of the tree rather than the
 * whole app, so one broken route does not blank the page.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : 'Something went wrong'

  const detail =
    isRouteErrorResponse(error) || !(error instanceof Error)
      ? 'The page could not be displayed.'
      : error.message

  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{detail}</AlertDescription>
    </Alert>
  )
}
