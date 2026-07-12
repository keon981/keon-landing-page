import { useTranslation } from 'react-i18next'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

const links = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
] as const

export function Navbar() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 rounded-base border-2 border-border bg-main px-4 py-2 shadow-shadow">
        <a href="#about" className="font-mono text-xl font-heading" aria-label="home">
          K.
        </a>
        <div className="hidden flex-1 items-center gap-4 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-heading hover:underline">
              {t(l.key)}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LangToggle />
          <ThemeToggle />
          <Button variant="accent" size="sm" asChild>
            <a href="#contact">{t('nav.cta')}</a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
