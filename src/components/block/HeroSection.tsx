import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { SiGithub } from 'react-icons/si'
import { TypeAnimation } from 'react-type-animation'

import { motion } from 'motion/react'

import { SkillsMarquee } from '@/components/block/SkillsMarquee'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

import type { Variants } from 'motion/react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const socialIconVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.4 },
  },
}

const ctaVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 1.5 },
  },
  tap: { scale: 0.95 },
}

const marqueeVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20, delay: 1.2 },
  },
}

function Avatar() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative mx-auto flex h-64 w-56 items-end justify-center overflow-hidden rounded-t-full rounded-b-base border-2 border-border bg-main shadow-shadow">
      {failed
        ? (
            <span className="pb-6 text-7xl" role="img" aria-label="avatar placeholder">
              🧑‍💻
            </span>
          )
        : (
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
  const sequence = roles.flatMap(r => [r, 1800])

  return (
    <section
      id="about"
      className="relative flex scroll-mt-24 flex-col overflow-hidden md:h-[calc(100vh-8rem)] md:max-h-[900px] md:min-h-[600px]"
    >
      <div
        aria-hidden
        className="paper-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />
      <motion.div
        className="relative z-10 mx-auto grid max-w-5xl flex-1 items-center gap-10 px-4 pb-10 pt-10 md:grid-cols-[3fr_2fr] md:pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.p variants={itemVariants} className="font-heading text-main-foreground">
            <span className="rounded-base border-2 border-border bg-main px-2 py-0.5">
              {t('hero.greeting')}
            </span>
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-4 text-4xl font-heading md:text-5xl"
          >
            {t('hero.name')} 👋
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-3 inline-block rounded-base border-2 border-border bg-highlight px-2 py-1 font-mono text-lg font-heading text-main-foreground"
          >
            <TypeAnimation key={i18n.language} sequence={sequence} repeat={Infinity} cursor />
          </motion.p>
          <motion.p variants={itemVariants} className="mt-5 max-w-xl leading-relaxed">
            {t('hero.intro')}
          </motion.p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.div variants={socialIconVariants} whileHover="hover">
              <Button variant="neutral" size="icon" asChild>
                <a
                  href="https://github.com/keon981"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <SiGithub />
                </a>
              </Button>
            </motion.div>
            <motion.div variants={ctaVariants} whileTap="tap">
              <Button variant="accent" size="lg" asChild>
                <a href="#contact">{t('hero.cta')}</a>
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div className="relative" variants={itemVariants}>
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
      </motion.div>

      <motion.div
        className="z-10 w-full md:absolute md:bottom-0 md:left-0"
        variants={marqueeVariants}
        initial="hidden"
        animate="visible"
      >
        <SkillsMarquee />
      </motion.div>
    </section>
  )
}
