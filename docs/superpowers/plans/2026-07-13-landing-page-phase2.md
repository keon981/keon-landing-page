# Landing Page Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依 `docs/superpowers/specs/2026-07-13-landing-page-phase2-design.md` 實作 7 項參考站對齊強化（loading 畫面、整頁畫框、Navbar 行為、Hero 編排、卡片動效、SEO、Footer）。

**Architecture:** 全部在現有 Vite SPA 上疊加：`App.tsx` 改為「載入編排 + 畫框容器」外殼；Navbar/Hero 改寫為 motion 編排版；SkillsMarquee 移入 Hero 底部；SEO 純 `index.html` 靜態改動。內容仍走 data/ + i18n 雙字典。

**Tech Stack:** 既有依賴不變（motion 12、react-type-animation、react-fast-marquee、react-i18next 17、Tailwind v4、Vitest 4）。**不新增任何依賴。**

## Global Constraints

- 顏色只能用既有 token（`bg-main`/`bg-accent`/`bg-highlight`/`bg-surface`/`bg-background`/`text-foreground`/`border-border`/`shadow-shadow`/`var(--border)`/`var(--grid-line)`），禁止硬編碼 hex。
- 所有顯示文字經 i18n；aria-label 沿用既有英文慣例（`toggle theme` 等既有值不動）。
- react-fast-marquee 的解包 shim（SkillsMarquee.tsx 頂部）**必須原樣保留**。
- 外部連結 `target="_blank" rel="noopener noreferrer"`。
- Commit 訊息 conventional commits，結尾 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 每個 task 結束 `npm test` 全綠；最終 task 加 `npm run build` + agent-browser 真瀏覽器驗收。
- 測試等待內容一律用 async `findBy*`/`waitFor`，禁用 fakeTimers。

---

### Task 1: 整頁畫框容器 + 等高線背景

**Files:**
- Create: `public/contours.svg`
- Modify: `src/index.css`（body 背景改等高線、新增 `.paper-grid`/`.contour-bg`）、`src/App.tsx`
- Test: `src/App.test.tsx`（沿用，加畫框斷言）

**Interfaces:**
- Consumes: 全部既有 sections
- Produces: `App` 外殼結構——外層 padding 容器 + `.contour-bg` 固定背景層 + `.paper-grid` 畫框容器（後續 task 的 loading 淡入 class 掛在畫框容器上）

- [ ] **Step 1: 建立 `public/contours.svg`**（自製等高線，低對比、可平鋪）

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720" fill="none">
  <g stroke="#5fbfae" stroke-width="1.5" opacity="0.28">
    <path d="M150 210 C 90 150, 130 60, 240 70 C 350 80, 400 160, 350 230 C 300 300, 210 270, 150 210 Z"/>
    <path d="M165 200 C 120 155, 150 95, 235 103 C 320 111, 360 170, 322 220 C 284 270, 210 245, 165 200 Z"/>
    <path d="M182 190 C 150 158, 172 122, 232 128 C 292 134, 320 176, 293 210 C 266 244, 214 222, 182 190 Z"/>
    <path d="M560 520 C 480 470, 500 350, 610 340 C 700 332, 730 430, 680 500 C 640 556, 620 558, 560 520 Z"/>
    <path d="M572 505 C 510 465, 528 372, 612 365 C 680 359, 702 434, 663 486 C 632 528, 618 535, 572 505 Z"/>
    <path d="M585 490 C 540 460, 555 395, 615 390 C 662 386, 678 438, 648 474 C 622 505, 612 508, 585 490 Z"/>
    <path d="M120 560 C 60 520, 80 440, 170 445 C 240 449, 265 505, 225 550 C 190 590, 165 590, 120 560 Z"/>
    <path d="M135 548 C 92 518, 108 462, 172 466 C 222 469, 240 510, 210 542 C 184 570, 168 570, 135 548 Z"/>
    <path d="M540 130 C 490 100, 505 40, 580 45 C 645 50, 665 100, 630 130 C 600 156, 580 154, 540 130 Z"/>
    <path d="M552 122 C 516 100, 528 58, 582 62 C 628 66, 642 100, 616 122 C 594 140, 580 139, 552 122 Z"/>
  </g>
</svg>
```

- [ ] **Step 2: `src/index.css` 背景分層**——把現有 `body` 區塊的 `background-image`/`background-size` 兩行移除，`html`/`body` 之後新增兩個 class：

```css
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}

.contour-bg {
  background-image: url('/contours.svg');
  background-size: 640px;
  opacity: 0.9;
}

.dark .contour-bg {
  opacity: 0.35;
}

.paper-grid {
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

- [ ] **Step 3: 改 `src/App.tsx` 為畫框結構**

```tsx
import { Navbar } from '@/components/Navbar'
import { ExperienceTimeline } from '@/sections/ExperienceTimeline'
import { Footer } from '@/sections/Footer'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

function App() {
  return (
    <div className="relative min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="contour-bg pointer-events-none fixed inset-0 z-0" aria-hidden />
      <div
        data-testid="page-frame"
        className="paper-grid relative z-10 mx-auto max-w-6xl border-2 border-border bg-background shadow-[8px_8px_0_0_var(--border)] md:border-4 md:shadow-[12px_12px_0_0_var(--border)]"
      >
        <Navbar />
        <main className="min-h-screen">
          <HeroSection />
          <SkillsMarquee />
          <ExperienceTimeline />
          <ProjectsSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 4: `src/App.test.tsx` 加畫框斷言**（在既有 test 後追加）

```tsx
test('wraps content in the neobrutalism page frame', () => {
  render(<App />)
  const frame = screen.getByTestId('page-frame')
  expect(frame.className).toContain('border-border')
  expect(frame.querySelector('main')).toBeInTheDocument()
})
```

- [ ] **Step 5: 驗證** — `npm test` 全綠（21）；`npm run dev` 手動不需（Task 7 統一瀏覽器驗收）
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: add page frame container and contour background"`

---

### Task 2: LoadingScreen + 載入編排 + 首繪 theme script

**Files:**
- Create: `src/components/LoadingScreen.tsx`、`src/components/LoadingScreen.test.tsx`
- Modify: `src/App.tsx`（載入編排 + 淡入）、`src/App.test.tsx`（改 async）、`src/index.css`（spin-slow 動畫）、`index.html`（theme script）

**Interfaces:**
- Consumes: Task 1 的畫框結構
- Produces: `<LoadingScreen />`（`role="status"` `aria-label="loading"`）；App 載入完成後畫框容器帶 `transition-opacity duration-300` 淡入

- [ ] **Step 1: 寫失敗測試 `src/components/LoadingScreen.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from '@/components/LoadingScreen'

test('renders loading status with brutalist card', () => {
  render(<LoadingScreen />)
  expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument()
  expect(screen.getByText('LOADING')).toBeInTheDocument()
})
```

- [ ] **Step 2: 跑測試確認失敗** — Run: `npm test` → FAIL `Cannot find module '@/components/LoadingScreen'`

- [ ] **Step 3: `src/index.css` 的 `@theme inline` 區塊內新增動畫 token**（加在 `--shadow-shadow` 之後）

```css
  --animate-spin-slow: spin-slow 3s linear infinite;

  @keyframes spin-slow {
    to {
      transform: rotate(360deg);
    }
  }
```

- [ ] **Step 4: 建立 `src/components/LoadingScreen.tsx`**（結構仿 ronit `loadingScreen.tsx`，色票全走 token）

```tsx
export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="loading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-main"
    >
      <div className="relative">
        <div className="rotate-2 border-4 border-border bg-surface p-8 font-mono text-5xl font-heading text-foreground shadow-[8px_8px_0_0_var(--border)] sm:text-6xl">
          LOADING
        </div>
        <div className="absolute -top-6 -right-6 size-14 animate-spin-slow rounded-full border-4 border-border bg-accent shadow-shadow" />
        <div className="absolute -bottom-6 -left-6 size-10 animate-pulse rounded-base border-4 border-border bg-highlight shadow-shadow" />
        <div className="absolute -top-14 -left-14 size-16 rotate-45 border-4 border-border bg-highlight shadow-[6px_6px_0_0_var(--border)]" />
        <div className="mt-8 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-4 animate-bounce rounded-full bg-foreground"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: `src/App.tsx` 加載入編排**（完整替換）

```tsx
import { useEffect, useState } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Navbar } from '@/components/Navbar'
import { ExperienceTimeline } from '@/sections/ExperienceTimeline'
import { Footer } from '@/sections/Footer'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

function App() {
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let mounted = true
    const pendingImages = Array.from(document.images)
      .filter(
        (img) =>
          img.getBoundingClientRect().top < window.innerHeight && !img.complete,
      )
      .map(
        (img) =>
          new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          }),
      )
    Promise.all([
      ...pendingImages,
      new Promise((resolve) => setTimeout(resolve, 300)),
    ]).then(() => {
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
  }, [loading])

  if (loading) return <LoadingScreen />

  return (
    <div className="relative min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="contour-bg pointer-events-none fixed inset-0 z-0" aria-hidden />
      <div
        data-testid="page-frame"
        className={`paper-grid relative z-10 mx-auto max-w-6xl border-2 border-border bg-background shadow-[8px_8px_0_0_var(--border)] transition-opacity duration-300 md:border-4 md:shadow-[12px_12px_0_0_var(--border)] ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar />
        <main className="min-h-screen">
          <HeroSection />
          <SkillsMarquee />
          <ExperienceTimeline />
          <ProjectsSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 6: `src/App.test.tsx` 全文替換為 async 版**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import App from './App'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('shows loading screen first, then renders all six blocks', async () => {
  render(<App />)
  expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument()
  expect(
    await screen.findByRole('navigation', {}, { timeout: 3000 }),
  ).toBeInTheDocument()
  for (const id of ['about', 'skills', 'experience', 'projects', 'contact']) {
    expect(document.querySelector(`#${id}`)).toBeInTheDocument()
  }
})

test('wraps content in the neobrutalism page frame', async () => {
  render(<App />)
  const frame = await screen.findByTestId('page-frame', {}, { timeout: 3000 })
  expect(frame.className).toContain('border-border')
  expect(frame.querySelector('main')).toBeInTheDocument()
})
```

- [ ] **Step 7: `index.html` `<head>` 最前面（`<meta charset>` 之後）插入首繪 theme script**

```html
<script>
  ;(function () {
    try {
      var t = localStorage.getItem('theme')
      if (
        t === 'dark' ||
        (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark')
      }
    } catch (e) {}
  })()
</script>
```

- [ ] **Step 8: 驗證** — `npm test` 全綠（22：Task 1 後的 21 + LoadingScreen 1；App.test 維持 2 個）
- [ ] **Step 9: Commit** — `git commit -m "feat: add loading screen with fade-in and pre-paint theme script"`

---

### Task 3: Navbar 升級

**Files:**
- Modify: `src/components/Navbar.tsx`（改寫）、`src/components/Navbar.test.tsx`（追加行為測試）
- Modify: `src/i18n/locales/zh-TW.json`、`src/i18n/locales/en.json`（新增 `nav.openMenu`）

**Interfaces:**
- Consumes: `Button`、`ThemeToggle`、`LangToggle`、i18n `nav.*`
- Produces: `<Navbar />`——捲動顯隱、進場動畫、手機漢堡選單（`aria-label` 用 `t('nav.openMenu')`、`aria-expanded`）；錨點 href 不變（既有測試相容）

- [ ] **Step 1: 兩份字典 `nav` 區塊各加一個 key** — zh-TW：`"openMenu": "開啟選單"`；en：`"openMenu": "Open menu"`

- [ ] **Step 2: 寫失敗測試（`src/components/Navbar.test.tsx` 追加，既有兩個測試保留不動）**

```tsx
import { fireEvent, within } from '@testing-library/react'

test('hamburger opens and closes the mobile menu', () => {
  render(<Navbar />)
  const burger = screen.getByRole('button', { name: '開啟選單' })
  expect(burger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(burger)
  expect(burger).toHaveAttribute('aria-expanded', 'true')
  const menu = screen.getByTestId('mobile-menu')
  expect(within(menu).getByRole('link', { name: '經歷' })).toHaveAttribute(
    'href',
    '#experience',
  )
  fireEvent.mouseDown(document.body)
  expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
})

test('hides on scroll down and shows on scroll up', () => {
  render(<Navbar />)
  const bar = screen.getByTestId('navbar-inner')
  Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
  fireEvent.scroll(window)
  expect(bar.className).toContain('-translate-y-')
  Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
  fireEvent.scroll(window)
  expect(bar.className).toContain('translate-y-0')
})
```

（import 行併入檔案既有 import；`render`/`screen` 已在檔內。）

- [ ] **Step 3: 跑測試確認失敗** — Run: `npm test` → FAIL（找不到 開啟選單 按鈕）

- [ ] **Step 4: 改寫 `src/components/Navbar.tsx`**

```tsx
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
```

- [ ] **Step 5: 跑測試確認通過** — `npm test` 全綠（24）。注意既有「renders logo and toggles」測試找 `K.` 文字仍通過。
- [ ] **Step 6: Commit** — `git commit -m "feat: navbar scroll behavior, entrance, micro-interactions and mobile menu"`

---

### Task 4: Hero stagger 編排 + 滿版 + 跑馬燈移入

**Files:**
- Modify: `src/sections/HeroSection.tsx`（改寫）、`src/App.tsx`（移除獨立 `<SkillsMarquee />`）、`src/sections/HeroSection.test.tsx`（追加斷言）
- 不動：`src/sections/SkillsMarquee.tsx`（含解包 shim）、`SkillsMarquee.test.tsx`

**Interfaces:**
- Consumes: `SkillsMarquee`（含 `id="skills"`）、`Badge`、`Button`、`TypeAnimation`、motion
- Produces: `<HeroSection />` 滿版（`#about`），內含底部滑入的 `<SkillsMarquee />`；App `main` 內順序變為 Hero → Experience → Projects

- [ ] **Step 1: `src/sections/HeroSection.test.tsx` 追加失敗測試**

```tsx
test('contains the skills marquee pinned inside the hero', () => {
  const { container } = render(<HeroSection />)
  expect(container.querySelector('#skills')).toBeInTheDocument()
})
```

- [ ] **Step 2: 跑測試確認失敗** — `npm test` → FAIL（hero 內無 #skills）

- [ ] **Step 3: 改寫 `src/sections/HeroSection.tsx`**

```tsx
import { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { SiGithub } from 'react-icons/si'
import { TypeAnimation } from 'react-type-animation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

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
    <section
      id="about"
      className="relative flex h-[calc(100vh-8rem)] max-h-[900px] min-h-[500px] scroll-mt-24 flex-col overflow-hidden sm:min-h-[600px]"
    >
      <div
        aria-hidden
        className="paper-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />
      <motion.div
        className="relative z-10 mx-auto grid max-w-5xl flex-1 items-center gap-10 px-4 pb-24 pt-10 md:grid-cols-[3fr_2fr]"
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
        className="absolute bottom-0 left-0 z-10 w-full"
        variants={marqueeVariants}
        initial="hidden"
        animate="visible"
      >
        <SkillsMarquee />
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: `src/App.tsx` 移除 `<SkillsMarquee />` 與其 import**（`main` 內剩 Hero → Experience → Projects；App 整合測試的 `#skills` 由 hero 內的 marquee 提供，維持綠）

- [ ] **Step 5: 跑測試確認通過** — `npm test` 全綠（25）
- [ ] **Step 6: Commit** — `git commit -m "feat: hero stagger choreography, full-viewport layout with pinned marquee"`

---

### Task 5: Projects / Experience 卡片 hover 動效

**Files:**
- Modify: `src/sections/ProjectsSection.tsx`、`src/sections/ExperienceTimeline.tsx`（僅 className 調整）

**Interfaces:**
- Consumes/Produces: 不變（純視覺）

- [ ] **Step 1: `ProjectsSection.tsx` 三處 className 修改**
  1. `<Card>`：`className` 由 `"h-full gap-4 overflow-hidden py-0 pb-6"` 改為 `"group h-full gap-4 overflow-hidden py-0 pb-6 transition-transform duration-300 hover:scale-105"`
  2. 卡頭色塊 div：在既有 class 後追加 `transition-transform duration-300 group-hover:scale-110`
  3. 區塊標題 `<h2>`：追加 `transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--border)]`

- [ ] **Step 2: `ExperienceTimeline.tsx` 標題 `<h2>` 同樣追加** `transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--border)]`

- [ ] **Step 3: 驗證** — `npm test` 全綠（快照無關、純 class 追加不影響既有斷言）
- [ ] **Step 4: Commit** — `git commit -m "feat: hover interactions for project cards and section titles"`

---

### Task 6: SEO 進階 + Footer 升級

**Files:**
- Modify: `index.html`、`src/sections/Footer.tsx`、`src/sections/Footer.test.tsx`、`src/i18n/locales/zh-TW.json`、`src/i18n/locales/en.json`

**Interfaces:**
- Produces: Footer 兩欄 + 底列；字典新 key `footer.quickLinks`；`footer.copyright` 帶 `{{year}}` 插值

- [ ] **Step 1: `index.html` `<head>` 內（description meta 之後）追加**

```html
    <meta name="robots" content="index, follow" />
    <meta property="og:image" content="https://github.com/keon981.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="柯均翰 Keon Ko｜網頁前端工程師" />
    <meta name="twitter:description" content="3 年 React / TypeScript / Vite 經驗，專注醫療影像系統與高效能後台介面。" />
    <meta name="twitter:image" content="https://github.com/keon981.png" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "柯均翰",
        "alternateName": "Keon Ko",
        "jobTitle": "網頁前端工程師",
        "description": "3 年 React / TypeScript / Vite 經驗，專注醫療影像系統與高效能後台介面。",
        "image": "https://github.com/keon981.png",
        "knowsAbout": ["React", "TypeScript", "Vite", "Next.js", "Figma", "Storybook", "Vitest", "GitHub", "GitLab", "Cornerstone.js", "FastAPI", "RESTful API"],
        "sameAs": ["https://github.com/keon981"]
      }
    </script>
```

（og:image 用 GitHub avatar 為過渡方案，部署定案後換 1200×630 正式圖。）

- [ ] **Step 2: 兩份字典 `footer` 區塊改為**

zh-TW（tech 資訊移到底列 badge，避免重複）：
```json
"footer": {
  "title": "一起做點什麼吧！",
  "quickLinks": "快速連結",
  "email": "寫信給我",
  "copyright": "© {{year}} 柯均翰"
}
```

en：
```json
"footer": {
  "title": "Let's build something together!",
  "quickLinks": "Quick Links",
  "email": "Email Me",
  "copyright": "© {{year}} Keon Ko"
}
```

（底列右側 badge `</> with React + Vite + shadcn/ui` 為技術名詞組合，比照技能名稱不進 i18n。）

- [ ] **Step 3: `Footer.test.tsx` 追加失敗測試**

```tsx
test('shows current year and quick links', () => {
  render(<Footer />)
  const year = String(new Date().getFullYear())
  expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  expect(screen.getByText('快速連結')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '經歷' })).toHaveAttribute('href', '#experience')
})
```

- [ ] **Step 4: 跑測試確認失敗** — `npm test` → FAIL（無 快速連結）

- [ ] **Step 5: 改寫 `src/sections/Footer.tsx`**

```tsx
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
```

- [ ] **Step 6: 跑測試確認通過** — `npm test` 全綠（26）；既有 Footer mailto/github 測試不受影響
- [ ] **Step 7: Commit** — `git commit -m "feat: seo json-ld and og tags, two-column footer with auto year"`

---

### Task 7: 真瀏覽器驗收 + 最終驗證

**Files:** 無新檔（驗證任務）

- [ ] **Step 1:** `npm test` → 全綠（26）
- [ ] **Step 2:** `npm run build` → 成功
- [ ] **Step 3: dev 真瀏覽器驗收**（agent-browser 已安裝於機器）

```bash
npx vite --port 5199 --strictPort &   # 背景
sleep 2
agent-browser open http://localhost:5199/
sleep 4   # 等 loading 結束與動畫
agent-browser errors                  # 預期無錯誤
agent-browser eval "JSON.stringify({sections: ['about','skills','experience','projects','contact'].map(id=>!!document.getElementById(id)), text: document.body.innerText.slice(0,80)})"
# 預期 sections 全 true、text 含導覽與名字
kill %1
```

- [ ] **Step 4: build 真瀏覽器驗收**

```bash
npx vite preview --port 4198 --strictPort &
sleep 2
agent-browser open http://localhost:4198/
sleep 4
agent-browser errors
agent-browser eval "JSON.stringify(['about','skills','experience','projects','contact'].map(id=>!!document.getElementById(id)))"
kill %1
```

- [ ] **Step 5: 深色模式驗收** — `agent-browser eval "localStorage.setItem('theme','dark'); location.reload()"` 後重複 Step 4 的 errors/eval 檢查，並 `agent-browser eval "document.documentElement.classList.contains('dark')"` 預期 true（首繪 script 生效）
- [ ] **Step 6: Commit（若驗收過程需微調樣式，一併入此 commit）** — `git commit -m "test: browser smoke verification for phase 2"`（若無變更則跳過）

---

## 完成後提醒（給執行者）

1. og:image 為 GitHub avatar 過渡方案；等高線 SVG 為自製素材——都可日後替換，位置已在 spec 註明。
2. Hero 滿版高度 `h-[calc(100vh-8rem)]` 是起始值，瀏覽器驗收時若 navbar 遮擋或底部裁切，微調該值（僅此值可調）。
3. `SkillsMarquee.tsx` 的解包 shim 不得移除。
