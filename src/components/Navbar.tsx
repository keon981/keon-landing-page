import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
] as const

function scrollToHash(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function anchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith('#')) {
    e.preventDefault()
    scrollToHash(href.slice(1))
  }
}

export function Navbar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const lastY = useRef(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setIsOpen(false)
      const y = window.scrollY
      setShowNav(y < lastY.current || y <= 100)
      lastY.current = y
    }
    // 排除漢堡鈕本身，否則 mousedown 先關、click 再開，按鈕永遠關不掉選單
    // （參考站原始碼有同樣問題，這裡不照抄）
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !burgerRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <motion.header
      className="sticky top-0 z-50 px-4 pt-4"
      initial={{ y: '-120%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <nav
        data-testid="navbar-inner"
        className={cn(
          'mx-auto flex max-w-5xl items-center gap-4 rounded-base border-2 border-border bg-main px-4 py-2 text-main-foreground shadow-shadow transition-transform duration-300 ease-in-out',
          showNav ? 'translate-y-0' : '-translate-y-[calc(100%+40px)]',
        )}
      >
        <a
          href="#about"
          aria-label="home"
          onClick={(e) => anchorClick(e, '#about')}
          className="-rotate-2 font-mono text-xl font-heading transition-transform duration-300 hover:rotate-0"
        >
          K.
        </a>
        <div className="hidden flex-1 items-center gap-4 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => anchorClick(e, l.href)}
              className="text-sm font-heading transition-all duration-200 hover:-translate-y-1 hover:rotate-2"
            >
              {t(l.key)}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LangToggle />
          <ThemeToggle />
          <Button variant="accent" size="sm" asChild className="hidden md:inline-flex">
            <a href="#contact" onClick={(e) => anchorClick(e, '#contact')}>
              {t('nav.cta')}
            </a>
          </Button>
          <Button
            ref={burgerRef}
            variant="neutral"
            size="icon"
            className="md:hidden"
            aria-label={t('nav.openMenu')}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((o) => !o)}
          >
            <Menu />
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div
          ref={menuRef}
          data-testid="mobile-menu"
          className="absolute inset-x-4 top-full z-50 mt-2 md:hidden"
        >
          <div className="flex flex-col gap-3 rounded-base border-2 border-border bg-surface p-4 shadow-[8px_8px_0_0_var(--border)]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  anchorClick(e, l.href)
                  setIsOpen(false)
                }}
                className="rounded-base border-2 border-border bg-main p-2 text-center font-heading text-main-foreground shadow-shadow transition-transform hover:rotate-2"
              >
                {t(l.key)}
              </a>
            ))}
            <Button variant="accent" asChild>
              <a
                href="#contact"
                onClick={(e) => {
                  anchorClick(e, '#contact')
                  setIsOpen(false)
                }}
              >
                {t('nav.cta')}
              </a>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  )
}
