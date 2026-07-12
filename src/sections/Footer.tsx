import { Mail } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t-2 border-border bg-secondary-background px-4 py-12 text-background"
    >
      <div className="mx-auto max-w-5xl">
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
        <p className="mt-8 text-xs opacity-70">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
