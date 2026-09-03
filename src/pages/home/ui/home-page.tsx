import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui'

const STACK = [
  { name: 'Feature-Sliced Design', detail: 'app / pages / shared — extract only when shared' },
  { name: 'TanStack Query', detail: 'owns all server state, via queryOptions factories' },
  { name: 'Zustand', detail: 'owns client state — the theme you can toggle above' },
  { name: 'shadcn + Tailwind v4', detail: 'semantic tokens registered with @theme inline' },
]

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Starter
        </Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Venturoso frontend</h1>
        <p className="max-w-2xl text-muted-foreground">
          A Feature-Sliced Design starter wired end to end: routing, a real data layer, a themeable
          design system and tests. Every convention here is demonstrated by working code rather than
          described in a comment.
        </p>
        <div className="flex gap-3">
          {/* Base UI: rendering as a Link produces an <a>, so nativeButton
              must be false or the button semantics are wrong. */}
          <Button render={<Link to={ROUTES.products} />} nativeButton={false}>
            Browse products
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {STACK.map((item) => (
          <Card key={item.name} className="bg-surface-raised">
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Design tokens</CardTitle>
          <CardDescription>
            Custom tokens defined once in global.css, registered with Tailwind, and adapting to
            light/dark automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <span className="rounded-md bg-brand px-3 py-1.5 text-sm text-brand-foreground">
            brand
          </span>
          <span className="rounded-md bg-success px-3 py-1.5 text-sm text-success-foreground">
            success
          </span>
          <span className="rounded-md bg-warning px-3 py-1.5 text-sm text-warning-foreground">
            warning
          </span>
          <span className="rounded-md border bg-surface-raised px-3 py-1.5 text-sm">
            surface-raised
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
