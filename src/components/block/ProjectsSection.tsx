import { useTranslation } from 'react-i18next'
import { SiGithub } from 'react-icons/si'

import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

import { projects } from '@/assets/data/projects'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/Card'

import type { ProjectImage } from '@/assets/data/projects'

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
              <Card className="group h-full gap-4 overflow-hidden p-3 pb-6 transition-transform duration-300 hover:scale-105 sm:hover:scale-103 lg:hover:scale-105">
                <div
                  className={`flex h-36 sm:h-44 md:h-48 items-center justify-center  border-border border-2 rounded overflow-hidden text-4xl ${toneClass[p.tone]}  transition-transform duration-300`}
                  aria-hidden
                >
                  <ProjectPicture image={p.image} />
                </div>
                <CardContent className="space-y-2 px-0">
                  <CardTitle className="text-lg">
                    {t(`projects.items.${p.i18nKey}.title`)}
                  </CardTitle>
                  <CardDescription>
                    {t(`projects.items.${p.i18nKey}.desc`)}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map(tag => (
                      <Badge key={tag} variant="highlight">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <ProjectCardFooter codeUrl={p.codeUrl} demoUrl={p.demoUrl} />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProjectPictureProps {
  image: ProjectImage | null
}

function ProjectPicture({ image }: ProjectPictureProps) {
  if (!image) return '🖼️'

  return (
    <picture className="size-full">
      <source srcSet={image.avif} type="image/avif" />
      <source srcSet={image.webp} type="image/webp" />
      <img
        src={image.fallback}
        alt=""
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    </picture>
  )
}

interface ProjectCardFooterProps {
  codeUrl: string | null
  demoUrl: string | null
}

function ProjectCardFooter({ codeUrl, demoUrl }: ProjectCardFooterProps) {
  const { t } = useTranslation()
  return (
    <CardFooter className="mt-auto gap-2 px-0">
      {codeUrl
        ? (
            <Button variant="neutral" size="sm" asChild>
              <a href={codeUrl} target="_blank" rel="noopener noreferrer">
                <SiGithub /> {t('projects.code')}
              </a>
            </Button>
          )
        : (
            <Button variant="neutral" size="sm" disabled>
              <SiGithub /> {t('projects.code')}
            </Button>
          )}
      {demoUrl
        ? (
            <Button size="sm" asChild>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> {t('projects.demo')}
              </a>
            </Button>
          )
        : (
            <Button size="sm" disabled>
              <ExternalLink /> {t('projects.demo')}
            </Button>
          )}
    </CardFooter>
  )
}
