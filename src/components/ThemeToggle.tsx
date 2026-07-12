import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <Button
      variant="neutral"
      size="icon"
      aria-label="toggle theme"
      onClick={toggle}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}
