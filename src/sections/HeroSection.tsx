import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { TypeAnimation } from 'react-type-animation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function Avatar() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative mx-auto flex h-64 w-56 items-end justify-center overflow-hidden rounded-t-full rounded-b-base border-2 border-border bg-main shadow-shadow">
      {failed ? (
        <span className="pb-6 text-7xl" role="img" aria-label="avatar placeholder">
          🧑‍💻
        </span>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}avatar.png`}
          alt="柯均翰"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export function HeroSection() {
  const { t, i18n } = useTranslation()
  const roles = t('hero.roles', { returnObjects: true }) as string[]
  const sequence = roles.flatMap((r) => [r, 1800])

  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16">
      <div className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-heading text-main-foreground">
            <span className="rounded-base border-2 border-border bg-main px-2 py-0.5">
              {t('hero.greeting')}
            </span>
          </p>
          <h1 className="mt-4 text-4xl font-heading md:text-5xl">
            {t('hero.name')} 👋
          </h1>
          <p className="mt-3 inline-block rounded-base border-2 border-border bg-highlight px-2 py-1 font-mono text-lg font-heading text-main-foreground">
            <TypeAnimation
              key={i18n.language}
              sequence={sequence}
              repeat={Infinity}
              cursor
            />
          </p>
          <p className="mt-5 max-w-xl leading-relaxed">{t('hero.intro')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="neutral" size="icon" asChild>
              <a
                href="https://github.com/keon981"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <ExternalLink />
              </a>
            </Button>
            <Button variant="accent" size="lg" asChild>
              <a href="#contact">{t('hero.cta')}</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Avatar />
          <Badge
            variant="highlight"
            className="absolute -top-2 right-4 rotate-6 font-mono font-heading"
          >
            {t('hero.badgeRole')}
          </Badge>
          <Badge
            variant="accent"
            className="absolute bottom-4 left-2 -rotate-6 font-heading"
          >
            {t('hero.badgeYears')}
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}
