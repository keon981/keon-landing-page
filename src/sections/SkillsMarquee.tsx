import MarqueePkg from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'
import { skills } from '@/data/skills'

// react-fast-marquee 是純 CJS 套件，rolldown（Vite 8 引擎）預打包時未解開
// exports.default（vitejs/vite#22227），default import 會拿到整個 exports 物件；
// 此解包對正常 interop（Vitest、未來上游修復）與未解包兩種形態都相容
const Marquee = ((MarqueePkg as { default?: unknown }).default ??
  MarqueePkg) as typeof MarqueePkg

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
