import { NavLink, Outlet } from 'react-router'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Separator } from '@/shared/ui'
import { ThemeToggle } from './theme-toggle'

const NAV_LINKS = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.products, label: 'Products' },
]

/**
 * App-wide layout. Nested routes render through <Outlet />.
 * Lives in the app layer because it belongs to the routing structure itself,
 * not to any single page.
 */
export function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="font-heading text-lg font-semibold">Venturoso</span>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === ROUTES.home}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <Separator />
      <footer className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">
        Feature-Sliced Design starter · data from dummyjson.com
      </footer>
    </div>
  )
}
