import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'
import { skills } from '@/data/skills'

export function SkillsMarquee() {
  const { t } = useTranslation()
  return (
    <section
      id="skills"
      aria-label={t('skills.title')}
      className="scroll-mt-24 border-y-2 border-border bg-surface py-4"
    >
      <Marquee autoFill pauseOnHover speed={40}>
        {skills.map((s) => (
          <span
            key={s.name}
            className="mx-6 inline-flex items-center gap-2 text-lg font-heading [&_svg]:size-5"
          >
            {s.icon}
            {s.name}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
