import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * Client/UI state, owned by Zustand.
 *
 * This is the state boundary the project follows: **Zustand owns client state**
 * (theme, UI toggles, wizard steps), **TanStack Query owns server state**
 * (anything fetched from an API). Never cache server responses in here.
 *
 * Lives in `shared` rather than `app` because pages need to read it, and FSD
 * imports only ever travel downward (app -> pages -> shared).
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
      },
      toggleTheme: () => {
        set({ theme: resolveTheme(get().theme) === 'dark' ? 'light' : 'dark' })
      },
    }),
    { name: 'venturoso-theme' },
  ),
)

/** Collapses `'system'` into the concrete theme the OS is currently asking for. */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
