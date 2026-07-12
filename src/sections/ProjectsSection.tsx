import { ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { projects } from '@/data/projects'

const toneClass = {
  main: 'bg-main',
  highlight: 'bg-highlight',
  accent: 'bg-accent',
} as const

export function ProjectsSection() {
  const { t } = useTranslation()
  return (
    <section
      id="projects"
      className="scroll-mt-24 border-t-2 border-border bg-main/10 py-16"
    >
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-8 inline-block rounded-base border-2 border-border bg-surface px-4 py-2 text-2xl font-heading shadow-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--border)]">
          {t('projects.title')} 🚀
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card className="group h-full gap-4 overflow-hidden py-0 pb-6 transition-transform duration-300 hover:scale-105">
                <div
                  className={`flex h-28 items-center justify-center border-b-2 border-border text-4xl ${toneClass[p.tone]} transition-transform duration-300 group-hover:scale-110`}
                  aria-hidden
                >
                  🖼️
                </div>
                <CardContent className="space-y-2">
                  <CardTitle className="text-lg">
                    {t(`projects.items.${p.i18nKey}.title`)}
                  </CardTitle>
                  <CardDescription>
                    {t(`projects.items.${p.i18nKey}.desc`)}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((tag) => (
                      <Badge key={tag} variant="highlight">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  {p.codeUrl ? (
                    <Button variant="neutral" size="sm" asChild>
                      <a href={p.codeUrl} target="_blank" rel="noopener noreferrer">
                        <SiGithub /> {t('projects.code')}
                      </a>
                    </Button>
                  ) : (
                    <Button variant="neutral" size="sm" disabled>
                      <SiGithub /> {t('projects.code')}
                    </Button>
                  )}
                  {p.demoUrl ? (
                    <Button size="sm" asChild>
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink /> {t('projects.demo')}
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      <ExternalLink /> {t('projects.demo')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
