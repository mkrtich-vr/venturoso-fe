import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        That URL does not match any route in this application.
      </p>
      <Button variant="outline" render={<Link to={ROUTES.home} />} nativeButton={false}>
        Back to home
      </Button>
    </div>
  )
}
