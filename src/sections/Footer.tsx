import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SiGithub } from 'react-icons/si'
import { Button } from '@/components/ui/button'

const quickLinks = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
] as const

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t-2 border-border bg-secondary-background px-4 py-12 text-background"
    >
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-heading uppercase tracking-wider">
            {t('footer.quickLinks')}
          </h3>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    document
                      .getElementById(l.href.slice(1))
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-block border-2 border-transparent px-2 py-0.5 transition-all duration-200 hover:border-border hover:bg-highlight hover:text-main-foreground"
                >
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="-rotate-1">
          <h2 className="text-2xl font-heading">{t('footer.title')} ✉️</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:h21816595@gmail.com">
                <Mail /> {t('footer.email')}
              </a>
            </Button>
            <Button variant="neutral" asChild>
              <a
                href="https://github.com/keon981"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub /> GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-3 border-t-2 border-background/30 pt-6 md:flex-row">
        <p className="text-xs opacity-70">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
        <p className="bg-background px-3 py-1 font-mono text-xs text-foreground">
          {'</>'} with React + Vite + shadcn/ui
        </p>
      </div>
    </footer>
  )
}
