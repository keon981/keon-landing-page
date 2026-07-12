# Keon Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立柯均翰的單頁式 Neobrutalism 個人 landing page（六區塊、中英雙語、深色模式），依 `docs/superpowers/specs/2026-07-12-keon-landing-page-design.md`。

**Architecture:** Vite SPA、單頁六個 section 依序組裝於 `App.tsx`。樣式走 neobrutalism token 慣例（CSS 變數 + Tailwind v4 `@theme` 映射），元件以 shadcn/ui 手動安裝路徑（自寫 `components.json` + 貼上 neobrutalism 變體元件）。內容與結構分離：結構性資料在 `src/data/`，全部顯示文字在 `src/i18n/locales/`。

**Tech Stack:** Vite 8 + React 19 + TypeScript、Tailwind CSS 4.3（`@tailwindcss/vite`）、shadcn/ui（manual install）、motion 12（`motion/react`）、react-type-animation 3、react-fast-marquee 1.6、react-i18next 17 / i18next 26、Vitest 4 + @testing-library/react 16 + jsdom、react-icons 5 + lucide-react。

## Global Constraints

- 套件一律裝當日 latest（2026-07-12 查證的 major：vite 8、tailwindcss 4、motion 12、react-i18next 17、i18next 26、vitest 4、@testing-library/react 16、react-icons 5、react-type-animation 3、react-fast-marquee 1）；若安裝時 major 跳號，停下回報而不是直接升。
- 配色 C token（亮色）：`--background: #FFF9F2`、`--main: #52E5C4`、`--accent: #FF7BA9`、`--highlight: #FFE156`、`--border: #000000`、shadow `4px 4px 0px 0px var(--border)`。深色：`--background: #1E1E1E`、`--surface: #2A2A2A`、`--foreground: #F5F5F5`，main/accent/highlight/border 不變。
- token 命名遵循 neobrutalism.dev 慣例（`--main`、`--secondary-background`…），自訂擴充僅 `--accent`、`--highlight`、`--surface`、`--grid-line`。
- 所有顯示文字經 react-i18next（預設 `zh-TW`，fallback `zh-TW`）；元件內禁止 hardcode 文案。技能名稱與公司品牌名除外（brand names 不翻譯，放 `src/data/`）。
- `vite.config.ts` 的 `base: './'`（部署未定，GitHub Pages / Vercel 都相容）。
- 外部連結一律 `target="_blank" rel="noopener noreferrer"`。
- Commit 訊息用 conventional commits，結尾加 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 測試指令：`npm test`（= `vitest run`）。每個 task 結束時全部測試必須綠。

---

### Task 1: Vite 專案 scaffold + Tailwind v4 + Vitest 基礎

**Files:**
- Create: 整個 Vite react-ts 模板（`package.json`、`index.html`、`src/main.tsx`、`src/App.tsx`、`vite.config.ts`、`tsconfig*.json`）
- Create: `vitest.config.ts`、`src/test/setup.ts`、`src/App.test.tsx`
- Modify: `.gitignore`、`src/index.css`、`tsconfig.json`、`tsconfig.app.json`

**Interfaces:**
- Produces: alias `@/* → src/*`；`npm test` 可跑；`src/index.css` 含 `@import "tailwindcss"`；後續 task 直接在此結構上疊加。

- [ ] **Step 1: Scaffold 到暫存資料夾再搬進 repo root**（root 已有 `.git`、`docs/`，不能直接 create）

```bash
cd /Users/keon/Documents/dev/keon-landing-page
npm create vite@latest scaffold-tmp -- --template react-ts
rsync -a --exclude .gitignore scaffold-tmp/ ./
rm -rf scaffold-tmp
printf '*.tsbuildinfo\ncoverage/\n' >> .gitignore
npm install
```

- [ ] **Step 2: 安裝 Tailwind v4 與測試依賴**

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: 覆寫 `vite.config.ts`**

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 4: 建立 `vitest.config.ts`（merge vite config，jsdom 環境）**

```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  }),
)
```

- [ ] **Step 5: 建立 `src/test/setup.ts`**（jest-dom matchers + jsdom 缺的 `matchMedia` mock，`useTheme` 會用到）

```ts
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

- [ ] **Step 6: `tsconfig.json` 與 `tsconfig.app.json` 加 alias 與 vitest 型別**（兩個檔案的 `compilerOptions` 都要加 alias；`tsconfig.json` 若只有 `references` 就補上 `compilerOptions`。`types` 只加在 `tsconfig.app.json`——`globals: true` 的 test/expect 全域需要它，否則 `tsc -b` 會報錯）

```json
// tsconfig.json 與 tsconfig.app.json 皆加：
"compilerOptions": {
  "baseUrl": ".",
  "paths": { "@/*": ["./src/*"] }
}
```

```json
// 僅 tsconfig.app.json 的 compilerOptions 另加：
"types": ["vite/client", "vitest/globals"]
```

- [ ] **Step 7: 清空模板雜訊**：刪除 `src/App.css`、`src/assets/react.svg`、`public/vite.svg`；`src/index.css` 全部內容換成一行 `@import "tailwindcss";`；`src/App.tsx` 換成：

```tsx
function App() {
  return <main className="min-h-screen">keon landing page</main>
}

export default App
```

`src/main.tsx` 確認為（模板預設即此，若有 `App.css` import 要移除）：

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: 寫 smoke test `src/App.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app shell', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
```

- [ ] **Step 9: `package.json` scripts 加測試指令**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 10: 驗證**

Run: `npm test` → 預期 1 test PASS
Run: `npm run build` → 預期 build 成功（`dist/` 產出，assets 路徑為相對路徑 `./`）

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TS with Tailwind v4 and Vitest"
```

---

### Task 2: Neobrutalism 主題層（配色 C tokens + shadcn 手動安裝 + Button/Card/Badge）

**Files:**
- Create: `components.json`、`src/lib/utils.ts`、`src/components/ui/button.tsx`、`src/components/ui/card.tsx`、`src/components/ui/badge.tsx`
- Create: `src/components/ui/button.test.tsx`
- Modify: `src/index.css`（完整主題）、`index.html`（Space Grotesk 字型）

**Interfaces:**
- Produces:
  - `cn(...inputs: ClassValue[]): string`（`@/lib/utils`）
  - `<Button variant="default"|"accent"|"neutral"|"noShadow"|"reverse" size="default"|"sm"|"lg"|"icon" asChild?>`（`@/components/ui/button`）
  - `<Card>` `<CardHeader>` `<CardTitle>` `<CardDescription>` `<CardContent>` `<CardFooter>` `<CardAction>`（`@/components/ui/card`）
  - `<Badge variant="default"|"accent"|"highlight"|"neutral" asChild?>`（`@/components/ui/badge`）
  - Tailwind utility：`bg-main` `bg-accent` `bg-highlight` `bg-surface` `bg-secondary-background` `text-foreground` `text-main-foreground` `border-border` `shadow-shadow` `rounded-base` `font-base` `font-heading` `translate-x-boxShadowX` 等

- [ ] **Step 1: 安裝 shadcn 手動路徑依賴**

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-slot tw-animate-css
```

- [ ] **Step 2: 建立 `components.json`**（啟用日後 `npx shadcn@latest add` 官方 CLI）

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: 建立 `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: `src/index.css` 全文替換為主題**（token 結構取自 neobrutalism.dev registry，色值換為配色 C）

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: #fff9f2;
  --secondary-background: #111111;
  --surface: #ffffff;
  --main: #52e5c4;
  --accent: #ff7ba9;
  --highlight: #ffe156;
  --foreground: #111111;
  --main-foreground: #111111;
  --border: #000000;
  --ring: #000000;
  --overlay: rgba(0, 0, 0, 0.8);
  --shadow: 4px 4px 0px 0px var(--border);
  --grid-line: rgba(0, 0, 0, 0.05);
}

.dark {
  --background: #1e1e1e;
  --secondary-background: #fff9f2;
  --surface: #2a2a2a;
  --foreground: #f5f5f5;
  --ring: #ffffff;
  --grid-line: rgba(255, 255, 255, 0.06);
}

@theme inline {
  --color-main: var(--main);
  --color-accent: var(--accent);
  --color-highlight: var(--highlight);
  --color-surface: var(--surface);
  --color-background: var(--background);
  --color-secondary-background: var(--secondary-background);
  --color-foreground: var(--foreground);
  --color-main-foreground: var(--main-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-overlay: var(--overlay);
  --spacing-boxShadowX: 4px;
  --spacing-boxShadowY: 4px;
  --spacing-reverseBoxShadowX: -4px;
  --spacing-reverseBoxShadowY: -4px;
  --radius-base: 8px;
  --font-weight-base: 500;
  --font-weight-heading: 800;
  --shadow-shadow: var(--shadow);
  --font-sans: "Space Grotesk", "PingFang TC", "Noto Sans TC", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
  font-family: var(--font-sans);
}
```

- [ ] **Step 5: `index.html` `<head>` 加 Space Grotesk**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 6: 寫失敗測試 `src/components/ui/button.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('default variant uses main color and hard shadow', () => {
  render(<Button>Hi</Button>)
  const btn = screen.getByRole('button', { name: 'Hi' })
  expect(btn.className).toContain('bg-main')
  expect(btn.className).toContain('shadow-shadow')
})

test('accent variant uses accent color', () => {
  render(<Button variant="accent">Go</Button>)
  expect(screen.getByRole('button', { name: 'Go' }).className).toContain('bg-accent')
})
```

- [ ] **Step 7: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/components/ui/button'`（或同義錯誤）

- [ ] **Step 8: 建立 `src/components/ui/button.tsx`**（neobrutalism.dev button 原始碼 + 新增 `accent` 變體、`neutral` 改用 surface）

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-main-foreground bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        accent:
          'text-main-foreground bg-accent border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        noShadow: 'text-main-foreground bg-main border-2 border-border',
        neutral:
          'bg-surface text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        reverse:
          'text-main-foreground bg-main border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 9: 建立 `src/components/ui/card.tsx`**（neobrutalism.dev card 原始碼，卡面改 `bg-surface`）

```tsx
import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-base flex flex-col shadow-shadow border-2 gap-6 py-6 border-border bg-surface text-foreground font-base',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-heading leading-none', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm font-base', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-content" className={cn('px-6', className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
}
```

- [ ] **Step 10: 建立 `src/components/ui/badge.tsx`**（neobrutalism.dev badge + `accent`/`highlight` 變體）

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-main text-main-foreground',
        accent: 'bg-accent text-main-foreground',
        highlight: 'bg-highlight text-main-foreground',
        neutral: 'bg-surface text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 11: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS（App smoke + button 2 tests）

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add neobrutalism theme tokens (palette C) and ui primitives"
```

---

### Task 3: i18n（react-i18next + zh-TW / en 雙字典）

**Files:**
- Create: `src/i18n/index.ts`、`src/i18n/locales/zh-TW.json`、`src/i18n/locales/en.json`、`src/i18n/i18n.test.ts`
- Modify: `src/main.tsx`（import i18n）、`tsconfig.app.json`（確認 `resolveJsonModule`，Vite 模板預設已開）

**Interfaces:**
- Consumes: 無
- Produces:
  - `@/i18n` default export：已初始化的 `i18n` 實例（`i18n.t`、`i18n.changeLanguage('en' | 'zh-TW')`）
  - 元件端用法：`const { t, i18n } = useTranslation()`
  - 字典 key 全表（後續 task 依此取字）：`nav.about/skills/experience/projects/cta`、`hero.greeting/name/roles(陣列)/intro/cta`、`skills.title`、`experience.title/present/changtien.role/changtien.company/changtien.bullets(6 元素陣列)`、`projects.title/code/demo/items.p1|p2|p3.title|desc`、`footer.title/email/copyright`
  - 語言切換副作用：localStorage `lang`、`<html lang>` 同步（en ↔ zh-Hant）

- [ ] **Step 1: 安裝**

```bash
npm install i18next react-i18next
```

- [ ] **Step 2: 寫失敗測試 `src/i18n/i18n.test.ts`**

```ts
import i18n from '@/i18n'

test('defaults to zh-TW', () => {
  expect(i18n.t('hero.name')).toBe('我是柯均翰')
})

test('switches to English and syncs html lang', async () => {
  await i18n.changeLanguage('en')
  expect(i18n.t('hero.name')).toBe("I'm Keon Ko")
  expect(document.documentElement.lang).toBe('en')
  await i18n.changeLanguage('zh-TW')
  expect(document.documentElement.lang).toBe('zh-Hant')
})

test('experience bullets has 6 items in both languages', () => {
  const zh = i18n.getResource('zh-TW', 'translation', 'experience.changtien.bullets')
  const en = i18n.getResource('en', 'translation', 'experience.changtien.bullets')
  expect(zh).toHaveLength(6)
  expect(en).toHaveLength(6)
})
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/i18n'`

- [ ] **Step 4: 建立 `src/i18n/locales/zh-TW.json`**（內容取自 spec §7 的 Cake 快照）

```json
{
  "nav": {
    "about": "關於",
    "skills": "技能",
    "experience": "經歷",
    "projects": "專案",
    "cta": "聯絡我"
  },
  "hero": {
    "greeting": "你好！",
    "name": "我是柯均翰",
    "roles": ["網頁前端工程師", "React 開發者", "醫療影像系統前端"],
    "intro": "3 年前端開發經驗，能獨立負責從規劃到落地的完整專案。以 React、Vite、TypeScript、Next.js 開發高效能、易維護的後台系統，用 Figma 銜接產品需求與開發實務，熟悉 RESTful API 串接與文件撰寫，並善用 Claude Code、GitHub Copilot 等 AI 工具輔助開發。",
    "badgeRole": "Frontend Dev",
    "badgeYears": "3+ yrs ✦",
    "cta": "聯絡我"
  },
  "skills": {
    "title": "技能"
  },
  "experience": {
    "title": "工作經歷",
    "present": "現在",
    "changtien": {
      "role": "前端工程師",
      "company": "長佳智能股份有限公司",
      "bullets": [
        "獨立主導前端開發與維護（框架選型、模組化規劃），從 0 到 1 建立或重構前端系統",
        "與 UI/UX、AI 團隊及醫療專業人員跨部門協作，迭代開發多項醫療軟體產品介面",
        "維護與迭代 DICOM 醫療影像系統：顯示、處理、儲存、傳輸，含篩選、數位操作與量測功能",
        "與後端工程師協作 API 串接與文檔撰寫",
        "撰寫並維護軟體設計與開發文件，參與技術可行性評估",
        "建立並持續優化前端技術架構與元件系統，跨產品複用"
      ]
    }
  },
  "projects": {
    "title": "專案作品",
    "code": "程式碼",
    "demo": "展示",
    "items": {
      "p1": { "title": "專案一", "desc": "作品整理中，敬請期待。" },
      "p2": { "title": "專案二", "desc": "作品整理中，敬請期待。" },
      "p3": { "title": "專案三", "desc": "作品整理中，敬請期待。" }
    }
  },
  "footer": {
    "title": "一起做點什麼吧！",
    "email": "寫信給我",
    "copyright": "© 2026 柯均翰 · Built with React + Vite + shadcn/ui"
  }
}
```

- [ ] **Step 5: 建立 `src/i18n/locales/en.json`**（英文為草擬翻譯，執行完成後請使用者審閱）

```json
{
  "nav": {
    "about": "About",
    "skills": "Skills",
    "experience": "Experience",
    "projects": "Projects",
    "cta": "Get in Touch"
  },
  "hero": {
    "greeting": "Hello!",
    "name": "I'm Keon Ko",
    "roles": ["Front-End Engineer", "React Developer", "Medical Imaging UI Dev"],
    "intro": "Front-end developer with 3 years of experience owning projects from planning to launch. I build fast, maintainable admin systems with React, Vite, TypeScript and Next.js, bridge product and engineering with Figma, work fluently with RESTful APIs, and use AI tools like Claude Code and GitHub Copilot in my daily workflow.",
    "badgeRole": "Frontend Dev",
    "badgeYears": "3+ yrs ✦",
    "cta": "Get in Touch!"
  },
  "skills": {
    "title": "Skills"
  },
  "experience": {
    "title": "Work Experience",
    "present": "Present",
    "changtien": {
      "role": "Front-End Engineer",
      "company": "Ever Fortune.AI Co., Ltd.",
      "bullets": [
        "Independently lead front-end development and maintenance — framework selection and modular architecture — building and refactoring systems from 0 to 1",
        "Collaborate with UI/UX, AI teams and medical professionals to iterate on multiple medical software product interfaces",
        "Maintain and evolve a DICOM medical imaging system: display, processing, storage and transfer, with filtering, manipulation and measurement tools",
        "Work with back-end engineers on API integration and documentation",
        "Write and maintain software design documents and participate in technical feasibility reviews",
        "Build and continuously refine a shared front-end architecture and component system reused across products"
      ]
    }
  },
  "projects": {
    "title": "Projects",
    "code": "Code",
    "demo": "Live Demo",
    "items": {
      "p1": { "title": "Project One", "desc": "Coming soon — stay tuned." },
      "p2": { "title": "Project Two", "desc": "Coming soon — stay tuned." },
      "p3": { "title": "Project Three", "desc": "Coming soon — stay tuned." }
    }
  },
  "footer": {
    "title": "Let's build something together!",
    "email": "Email Me",
    "copyright": "© 2026 Keon Ko · Built with React + Vite + shadcn/ui"
  }
}
```

（註：長佳智能官方英文名以 Cake 頁面為準查不到，先用「Ever Fortune.AI」慣用譯名，交使用者審閱時一併確認。）

- [ ] **Step 6: 建立 `src/i18n/index.ts`**

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

const stored = localStorage.getItem('lang')

function syncHtmlLang(lng: string) {
  document.documentElement.lang = lng === 'en' ? 'en' : 'zh-Hant'
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: zhTW },
    en: { translation: en },
  },
  lng: stored === 'en' || stored === 'zh-TW' ? stored : 'zh-TW',
  fallbackLng: 'zh-TW',
  interpolation: { escapeValue: false },
})

syncHtmlLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
  syncHtmlLang(lng)
})

export default i18n
```

- [ ] **Step 7: `src/main.tsx` 第一個 import 加 `import '@/i18n'`**

```tsx
import '@/i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add react-i18next with zh-TW/en dictionaries"
```

---

### Task 4: useTheme hook + ThemeToggle / LangToggle

**Files:**
- Create: `src/hooks/useTheme.ts`、`src/hooks/useTheme.test.ts`
- Create: `src/components/ThemeToggle.tsx`、`src/components/LangToggle.tsx`、`src/components/toggles.test.tsx`

**Interfaces:**
- Consumes: `Button`（Task 2）、`@/i18n`（Task 3）
- Produces:
  - `useTheme(): { theme: 'light' | 'dark'; toggle: () => void }`（`@/hooks/useTheme`）
  - `<ThemeToggle />`：icon 按鈕（Sun/Moon），`aria-label="toggle theme"`
  - `<LangToggle />`：文字按鈕，顯示「EN」（目前中文時）或「中」（目前英文時），`aria-label="toggle language"`

- [ ] **Step 1: 寫失敗測試 `src/hooks/useTheme.test.ts`**

```ts
import { act, renderHook } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('defaults to light when no preference', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
  expect(document.documentElement.classList.contains('dark')).toBe(false)
})

test('toggle switches to dark, sets class and persists', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggle())
  expect(result.current.theme).toBe('dark')
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('respects stored theme', () => {
  localStorage.setItem('theme', 'dark')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/hooks/useTheme'`

- [ ] **Step 3: 建立 `src/hooks/useTheme.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    [],
  )

  return { theme, toggle }
}
```

- [ ] **Step 4: 跑 useTheme 測試確認通過**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: 寫失敗測試 `src/components/toggles.test.tsx`**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

beforeEach(async () => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  await i18n.changeLanguage('zh-TW')
})

test('ThemeToggle toggles dark class', () => {
  render(<ThemeToggle />)
  fireEvent.click(screen.getByRole('button', { name: 'toggle theme' }))
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})

test('LangToggle switches language', async () => {
  render(<LangToggle />)
  const btn = screen.getByRole('button', { name: 'toggle language' })
  expect(btn).toHaveTextContent('EN')
  fireEvent.click(btn)
  // changeLanguage 為非同步，等 re-render 後的文字
  expect(await screen.findByText('中')).toBeInTheDocument()
  expect(i18n.language).toBe('en')
})
```

- [ ] **Step 6: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/components/ThemeToggle'`

- [ ] **Step 7: 建立 `src/components/ThemeToggle.tsx` 與 `src/components/LangToggle.tsx`**

```tsx
// src/components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <Button
      variant="neutral"
      size="icon"
      aria-label="toggle theme"
      onClick={toggle}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}
```

```tsx
// src/components/LangToggle.tsx
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function LangToggle() {
  const { i18n } = useTranslation()
  const isZh = i18n.language !== 'en'
  return (
    <Button
      variant="neutral"
      size="sm"
      aria-label="toggle language"
      onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh-TW')}
    >
      {isZh ? 'EN' : '中'}
    </Button>
  )
}
```

- [ ] **Step 8: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add theme hook and theme/language toggles"
```

---

### Task 5: Navbar

**Files:**
- Create: `src/components/Navbar.tsx`、`src/components/Navbar.test.tsx`

**Interfaces:**
- Consumes: `Button`、`ThemeToggle`、`LangToggle`、`useTranslation`
- Produces: `<Navbar />`：sticky 頂欄；錨點連結 `#about` `#skills` `#experience` `#projects`；CTA 連到 `#contact`

- [ ] **Step 1: 寫失敗測試 `src/components/Navbar.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { Navbar } from '@/components/Navbar'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders anchor links to all sections', () => {
  render(<Navbar />)
  expect(screen.getByRole('link', { name: '關於' })).toHaveAttribute('href', '#about')
  expect(screen.getByRole('link', { name: '技能' })).toHaveAttribute('href', '#skills')
  expect(screen.getByRole('link', { name: '經歷' })).toHaveAttribute('href', '#experience')
  expect(screen.getByRole('link', { name: '專案' })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: '聯絡我' })).toHaveAttribute('href', '#contact')
})

test('renders logo and toggles', () => {
  render(<Navbar />)
  expect(screen.getByText('K.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle theme' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle language' })).toBeInTheDocument()
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/components/Navbar'`

- [ ] **Step 3: 建立 `src/components/Navbar.tsx`**（行動版隱藏錨點列，只留 logo + toggles + CTA）

```tsx
import { useTranslation } from 'react-i18next'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

const links = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
] as const

export function Navbar() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 rounded-base border-2 border-border bg-main px-4 py-2 shadow-shadow">
        <a href="#about" className="font-mono text-xl font-heading" aria-label="home">
          K.
        </a>
        <div className="hidden flex-1 items-center gap-4 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-heading hover:underline">
              {t(l.key)}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LangToggle />
          <ThemeToggle />
          <Button variant="accent" size="sm" asChild>
            <a href="#contact">{t('nav.cta')}</a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sticky neobrutalism navbar"
```

---

### Task 6: Hero section

**Files:**
- Create: `src/sections/HeroSection.tsx`、`src/sections/HeroSection.test.tsx`

**Interfaces:**
- Consumes: `Button`、`Badge`、`useTranslation`、`motion/react`、`react-type-animation`
- Produces: `<HeroSection />`：`<section id="about">`；GitHub 連結 `https://github.com/keon981`；CTA 連 `#contact`；頭像預設 `${import.meta.env.BASE_URL}avatar.png`，載入失敗 fallback 🧑‍💻 emoji（之後把真實照片放到 `public/avatar.png` 即自動顯示）

- [ ] **Step 1: 安裝**

```bash
npm install motion react-type-animation
```

- [ ] **Step 2: 寫失敗測試 `src/sections/HeroSection.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { HeroSection } from '@/sections/HeroSection'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders name, intro and github link', () => {
  render(<HeroSection />)
  // h1 內含 emoji，用 regex 部分比對
  expect(screen.getByText(/我是柯均翰/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keon981',
  )
})

test('switches name on language change', async () => {
  await i18n.changeLanguage('en')
  render(<HeroSection />)
  expect(screen.getByText(/I'm Keon Ko/)).toBeInTheDocument()
})
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/sections/HeroSection'`

- [ ] **Step 4: 建立 `src/sections/HeroSection.tsx`**

```tsx
import { useState } from 'react'
import { Github } from 'lucide-react'
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
                <Github />
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
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add hero section with type animation and motion entrance"
```

---

### Task 7: Skills 跑馬燈

**Files:**
- Create: `src/data/skills.tsx`、`src/sections/SkillsMarquee.tsx`、`src/sections/SkillsMarquee.test.tsx`

**Interfaces:**
- Consumes: `useTranslation`（僅 `skills.title` 供無障礙標題）、`react-fast-marquee`、`react-icons/si`、`lucide-react`
- Produces:
  - `skills: { name: string; icon: ReactNode }[]`（`@/data/skills`，12 項，brand name 不進 i18n）
  - `<SkillsMarquee />`：`<section id="skills">`，上下 2px 黑框白底（`bg-surface`）橫幅

- [ ] **Step 1: 安裝**

```bash
npm install react-fast-marquee react-icons
```

- [ ] **Step 2: 寫失敗測試 `src/sections/SkillsMarquee.test.tsx`**（Marquee `autoFill` 會複製項目，用 `getAllByText` 斷言至少一次）

```tsx
import { render, screen } from '@testing-library/react'
import { skills } from '@/data/skills'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

test('has 12 skills', () => {
  expect(skills).toHaveLength(12)
})

test('renders every skill name', () => {
  render(<SkillsMarquee />)
  for (const s of skills) {
    expect(screen.getAllByText(s.name).length).toBeGreaterThanOrEqual(1)
  }
})
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/data/skills'`

- [ ] **Step 4: 建立 `src/data/skills.tsx`**（Cornerstone.js 與 RESTful API 無品牌 icon，用 lucide 語意圖示）

```tsx
import type { ReactNode } from 'react'
import { Cable, ScanLine } from 'lucide-react'
import {
  SiFastapi,
  SiFigma,
  SiGithub,
  SiGitlab,
  SiNextdotjs,
  SiReact,
  SiStorybook,
  SiTypescript,
  SiVite,
  SiVitest,
} from 'react-icons/si'

export type Skill = { name: string; icon: ReactNode }

export const skills: Skill[] = [
  { name: 'React', icon: <SiReact /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'Vite', icon: <SiVite /> },
  { name: 'Next.js', icon: <SiNextdotjs /> },
  { name: 'Figma', icon: <SiFigma /> },
  { name: 'Storybook', icon: <SiStorybook /> },
  { name: 'Vitest', icon: <SiVitest /> },
  { name: 'GitHub', icon: <SiGithub /> },
  { name: 'GitLab', icon: <SiGitlab /> },
  { name: 'Cornerstone.js', icon: <ScanLine /> },
  { name: 'FastAPI', icon: <SiFastapi /> },
  { name: 'RESTful API', icon: <Cable /> },
]
```

- [ ] **Step 5: 建立 `src/sections/SkillsMarquee.tsx`**

```tsx
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
```

- [ ] **Step 6: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add skills marquee section"
```

---

### Task 8: Experience 時間軸

**Files:**
- Create: `src/data/experience.ts`、`src/sections/ExperienceTimeline.tsx`、`src/sections/ExperienceTimeline.test.tsx`

**Interfaces:**
- Consumes: `Card` 系列、`Badge`、`useTranslation`、`motion/react`
- Produces:
  - `experiences: { id: string; i18nKey: string; from: string; to: string | null }[]`（`@/data/experience`；`to: null` 顯示 `experience.present`；未來新經歷 push 一筆 + 補兩份字典即可）
  - `<ExperienceTimeline />`：`<section id="experience">`，垂直時間軸（薄荷綠圓點 + 黑線）+ 經歷卡片

- [ ] **Step 1: 寫失敗測試 `src/sections/ExperienceTimeline.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { ExperienceTimeline } from '@/sections/ExperienceTimeline'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders role, company, period and bullets', () => {
  render(<ExperienceTimeline />)
  expect(screen.getByText('前端工程師')).toBeInTheDocument()
  expect(screen.getByText('長佳智能股份有限公司')).toBeInTheDocument()
  expect(screen.getByText('2023.04 – 現在')).toBeInTheDocument()
  // bullets 共 6 條（數量由 Task 3 的 i18n 測試把關），這裡斷言首尾兩條有渲染
  expect(screen.getByText(/獨立主導前端開發與維護/)).toBeInTheDocument()
  expect(screen.getByText(/跨產品複用/)).toBeInTheDocument()
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/sections/ExperienceTimeline'`

- [ ] **Step 3: 建立 `src/data/experience.ts`**

```ts
export type Experience = {
  id: string
  i18nKey: string // experience.<i18nKey>.role / .company / .bullets
  from: string // 'YYYY.MM'
  to: string | null // null = present
}

export const experiences: Experience[] = [
  { id: 'changtien', i18nKey: 'changtien', from: '2023.04', to: null },
]
```

- [ ] **Step 4: 建立 `src/sections/ExperienceTimeline.tsx`**

```tsx
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { experiences } from '@/data/experience'

export function ExperienceTimeline() {
  const { t } = useTranslation()
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16">
      <h2 className="mb-8 inline-block rounded-base border-2 border-border bg-surface px-4 py-2 text-2xl font-heading shadow-shadow">
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
                    {bullets.map((b) => (
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
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add work experience timeline section"
```

---

### Task 9: Projects placeholder 卡片

**Files:**
- Create: `src/data/projects.ts`、`src/sections/ProjectsSection.tsx`、`src/sections/ProjectsSection.test.tsx`

**Interfaces:**
- Consumes: `Card` 系列、`Badge`、`Button`、`useTranslation`、`motion/react`
- Produces:
  - `projects: { id: string; i18nKey: string; tags: string[]; codeUrl: string | null; demoUrl: string | null; tone: 'main' | 'highlight' | 'accent' }[]`（`@/data/projects`；之後換真專案改此檔 + 兩份字典）
  - `<ProjectsSection />`：`<section id="projects">`，三欄卡片（行動版直排），無連結時按鈕 disabled

- [ ] **Step 1: 寫失敗測試 `src/sections/ProjectsSection.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { ProjectsSection } from '@/sections/ProjectsSection'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders 3 placeholder cards with disabled buttons', () => {
  render(<ProjectsSection />)
  expect(screen.getByText('專案一')).toBeInTheDocument()
  expect(screen.getByText('專案二')).toBeInTheDocument()
  expect(screen.getByText('專案三')).toBeInTheDocument()
  const codeButtons = screen.getAllByRole('button', { name: '程式碼' })
  expect(codeButtons).toHaveLength(3)
  expect(codeButtons[0]).toBeDisabled()
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/sections/ProjectsSection'`

- [ ] **Step 3: 建立 `src/data/projects.ts`**

```ts
export type Project = {
  id: string
  i18nKey: string // projects.items.<i18nKey>.title / .desc
  tags: string[]
  codeUrl: string | null
  demoUrl: string | null
  tone: 'main' | 'highlight' | 'accent'
}

export const projects: Project[] = [
  { id: 'p1', i18nKey: 'p1', tags: ['React', 'TypeScript'], codeUrl: null, demoUrl: null, tone: 'main' },
  { id: 'p2', i18nKey: 'p2', tags: ['Vite'], codeUrl: null, demoUrl: null, tone: 'highlight' },
  { id: 'p3', i18nKey: 'p3', tags: ['Next.js'], codeUrl: null, demoUrl: null, tone: 'accent' },
]
```

- [ ] **Step 4: 建立 `src/sections/ProjectsSection.tsx`**

```tsx
import { ExternalLink, Github } from 'lucide-react'
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
        <h2 className="mb-8 inline-block rounded-base border-2 border-border bg-surface px-4 py-2 text-2xl font-heading shadow-shadow">
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
              <Card className="h-full gap-4 overflow-hidden py-0 pb-6">
                <div
                  className={`flex h-28 items-center justify-center border-b-2 border-border text-4xl ${toneClass[p.tone]}`}
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
                        <Github /> {t('projects.code')}
                      </a>
                    </Button>
                  ) : (
                    <Button variant="neutral" size="sm" disabled>
                      <Github /> {t('projects.code')}
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
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add projects section with placeholder cards"
```

---

### Task 10: Footer + App 組裝 + SEO meta + 最終驗證

**Files:**
- Create: `src/sections/Footer.tsx`、`src/sections/Footer.test.tsx`
- Modify: `src/App.tsx`、`src/App.test.tsx`、`index.html`

**Interfaces:**
- Consumes: 全部 sections、`Button`、`useTranslation`
- Produces: `<Footer />`：`<section id="contact">` 深色底（`bg-secondary-background`）；Email 按鈕 `mailto:h21816595@gmail.com`；GitHub 按鈕；完整組裝的 `App`

- [ ] **Step 1: 寫失敗測試 `src/sections/Footer.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { Footer } from '@/sections/Footer'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders mailto and github links', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /寫信給我/ })).toHaveAttribute(
    'href',
    'mailto:h21816595@gmail.com',
  )
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keon981',
  )
})
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL —— `Cannot find module '@/sections/Footer'`

- [ ] **Step 3: 建立 `src/sections/Footer.tsx`**（深色底區域文字色與 foreground 脫鉤，直接用背景對比色）

```tsx
import { Github, Mail } from 'lucide-react'
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
              <Github /> GitHub
            </a>
          </Button>
        </div>
        <p className="mt-8 text-xs opacity-70">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: 組裝 `src/App.tsx`**

```tsx
import { Navbar } from '@/components/Navbar'
import { ExperienceTimeline } from '@/sections/ExperienceTimeline'
import { Footer } from '@/sections/Footer'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <SkillsMarquee />
        <ExperienceTimeline />
        <ProjectsSection />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 5: 更新 `src/App.test.tsx` 為整頁 smoke test**

```tsx
import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import App from './App'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders all six blocks', () => {
  render(<App />)
  expect(screen.getByRole('navigation')).toBeInTheDocument()
  expect(document.querySelector('#about')).toBeInTheDocument()
  expect(document.querySelector('#skills')).toBeInTheDocument()
  expect(document.querySelector('#experience')).toBeInTheDocument()
  expect(document.querySelector('#projects')).toBeInTheDocument()
  expect(document.querySelector('#contact')).toBeInTheDocument()
})
```

- [ ] **Step 6: `index.html` SEO meta 全文替換 `<head>` 內容**（保留 Task 2 的字型 link 與模板的 script tag 結構）

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>柯均翰 Keon Ko｜網頁前端工程師</title>
    <meta name="description" content="柯均翰（Keon Ko）— 網頁前端工程師。3 年 React / TypeScript / Vite 經驗，專注醫療影像系統與高效能後台介面。" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="柯均翰 Keon Ko｜網頁前端工程師" />
    <meta property="og:description" content="3 年 React / TypeScript / Vite 經驗，專注醫療影像系統與高效能後台介面。" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧑‍💻</text></svg>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 最終驗證**

Run: `npm test` → 預期全部 PASS
Run: `npm run build` → 預期成功
Run: `npm run preview` 後以瀏覽器（或 `curl -s http://localhost:4173/ | head`）確認頁面可載入，然後手動確認：亮/暗切換、中英切換、跑馬燈滾動、錨點捲動

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: assemble landing page with footer and SEO meta"
```

---

## 完成後提醒（給執行者）

1. 英文字典（`en.json`）為草擬翻譯，包含「長佳智能」英文名（暫用 Ever Fortune.AI）——完成後提請使用者審閱。
2. 真實頭像：使用者提供後放 `public/avatar.png` 即自動生效。
3. 專案內容：使用者提供後改 `src/data/projects.ts` + 兩份字典的 `projects.items`。
4. 部署未定：`base: './'` 已相容 GitHub Pages 與 Vercel，之後補 CI 即可。
