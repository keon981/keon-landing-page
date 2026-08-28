import { useTranslation } from 'react-i18next'

import { motion } from 'motion/react'

import { experiences } from '@/assets/data/experience'
import { Badge } from '@/components/ui/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'

export function ExperienceTimeline() {
  const { t } = useTranslation()
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16">
      <h2 className="mb-8 inline-block rounded-base border-2 border-border bg-surface px-4 py-2 text-2xl font-heading shadow-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--border)]">
        {t('experience.title')} 💼
      </h2>
      <ol className="space-y-8" aria-label={t('experience.title')}>
        {experiences.map((exp) => {
          const bullets = t(`experience.${exp.i18nKey}.bullets`, {
            returnObjects: true,
          }) as string[]
          return (
            <motion.li
              key={exp.id}
              className="flex gap-4"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex flex-col items-center" aria-hidden>
                <div className="size-4 shrink-0 rounded-full border-2 border-border bg-main" />
                <div className="w-0.5 flex-1 bg-border" />
              </div>
              <Card className="flex-1 gap-3 py-4">
                <CardHeader className="gap-2">
                  <CardTitle className="text-lg">
                    {t(`experience.${exp.i18nKey}.role`)}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading">
                      {t(`experience.${exp.i18nKey}.company`)}
                    </span>
                    <Badge variant="highlight" className="font-mono">
                      {exp.from} – {exp.to ?? t('experience.present')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {bullets.map(b => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
