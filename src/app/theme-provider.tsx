import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { resolveTheme, useThemeStore } from '@/shared/theme'

/**
 * Applies the theme chosen in the Zustand store to the document.
 *
 * The store holds the preference (client state); this provider is the single
 * place that touches the DOM for it, and it also follows the OS setting live
 * while the preference is 'system'.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark')
    }
    apply()

    // Only the 'system' preference needs to keep listening; the other two are
    // one-shot. Explicit `undefined` keeps every branch returning a value.
    if (theme !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => {
      media.removeEventListener('change', apply)
    }
  }, [theme])

  return children
}
