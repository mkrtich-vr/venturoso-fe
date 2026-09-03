import { MoonIcon, SunIcon } from 'lucide-react'
import { resolveTheme, useThemeStore } from '@/shared/theme'
import { Button } from '@/shared/ui'

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = resolveTheme(theme) === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
