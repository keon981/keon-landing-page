# Landing Page Phase 2 — 參考站對齊強化 設計文件

日期：2026-07-13
狀態：待使用者核准
前置：Phase 1 已完成合併至 develop（f219b4e + c9a54f8）。本文件源自對 `ronitjadhav/ronit.io` 原始碼的逐檔分析（page.tsx、loadingScreen.tsx、Navbar.tsx、HeroSection.tsx、projects.tsx、footer.tsx、site-config.ts、layout.tsx），使用者選定 7 項全部實作。

## 1. 範圍

| # | 項目 | 參考來源 |
|---|---|---|
| 1 | Loading 畫面 + 內容淡入 | `loadingScreen.tsx` + `page.tsx` 載入編排 |
| 2 | 整頁畫框容器 + 等高線背景 | `page.tsx` 外層結構 |
| 3 | Navbar 升級（捲動隱藏/進場/hover 微動效/手機漢堡選單） | `Navbar.tsx` |
| 4 | Hero stagger 進場編排 + 社群 icon 動效 | `HeroSection.tsx` variants |
| 5 | Hero 滿版視窗高 + 跑馬燈釘於 hero 底部（結構調整） | `HeroSection.tsx` 版面 |
| 6 | Projects 卡片 hover 動效 | `projects.tsx` |
| 7 | SEO 進階（JSON-LD/og:image/Twitter card）+ Footer 升級（三欄/自動年份/tech badge） | `layout.tsx`、`footer.tsx` |

**照舊範圍外**：互動地圖、聯絡表單 dialog、Chatbot、Blogs、prefers-reduced-motion（未選）。

## 2. 各項設計

### 2.1 Loading 畫面 + 內容淡入

- 新元件 `src/components/LoadingScreen.tsx`：全螢幕 `fixed inset-0`，配色 C 化（底 `bg-main`、深色模式底色跟隨 token）：中央旋轉 2° 的「LOADING」字卡（`bg-surface` 粗框硬陰影）、四顆 `animate-bounce` 依序延遲的圓點（`bg-foreground`）、裝飾元素（`bg-accent` 圓形 `animate-spin` 慢速、`bg-highlight` 旋轉 45° 方塊、脈動小方塊）——結構仿 ronit 版，色票全部走我們的 CSS 變數。
- `App.tsx` 載入編排（仿 `page.tsx`）：`useState({ isLoading: true, isContentVisible: false })`；`useEffect` 中等待「視窗內 img 元素載入完成」（`document.images` 過濾 `getBoundingClientRect().top < innerHeight` 且 `!complete`，onload/onerror 都 resolve）+ 最少 300ms 並行；完成後關 loading、內容容器 `opacity-0 → opacity-100 transition-opacity duration-300` 淡入。
- 自訂 `animate-spin-slow`（3s）加入 index.css `@theme`（`--animate-spin-slow`）。
- **附帶修正**：`index.html` 加 inline theme script（讀 localStorage `theme` / `prefers-color-scheme`，首繪前設定 `html.dark`）——消除深色模式使用者看到 loading 畫面前的亮色閃爍（同時解掉 Phase 1 最終 review 的 Minor #4）。`useTheme` 邏輯不變（script 只負責首繪前的 class）。

### 2.2 整頁畫框容器 + 等高線背景

- `App.tsx` 結構改為：
  ```
  <div className="relative min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">   ← 頁面外層，透明露出 body 背景
    <div 等高線背景層: fixed inset-0 z-0, SVG 圖樣, aria-hidden />
    <div className="relative z-10 mx-auto max-w-6xl bg-background border-2 md:border-4 border-border
                    shadow-[8px_8px_0_0_var(--border)] md:shadow-[12px_12px_0_0_var(--border)]
                    min-h-[calc(100vh-4rem)] overflow-hidden {淡入 class}">
      <Navbar /> <main>…sections…</main> <Footer />
    </div>
  </div>
  ```
- **背景分層調整**：等高線圖樣移到 body 層（`index.css` 的 body 背景改為等高線），格紋圖樣移入畫框容器內（原 body 的 grid `background-image` 搬到框內元素）。深色模式兩者以 `--grid-line` 同款變數調亮度。
- 等高線素材：自製 `public/contours.svg`（手繪數條封閉曲線 path、stroke 用中性色、透明底），亮/暗模式用 CSS `opacity` 或 `filter` 微調；不用外部圖庫。
- Navbar 的 sticky 基準與框內 scroll 相容（框不設 overflow-y，維持 window scroll，`overflow-hidden` 僅裁 x 向裝飾）。

### 2.3 Navbar 升級

- **捲動行為**（仿 ronit）：`useState(showNav, lastScrollY)` + scroll listener——往下捲且 `scrollY > 100` 時 `-translate-y-[calc(100%+40px)]` 隱藏，往上捲或近頂時出現；`transition-transform duration-300`。
- **進場動畫**：motion variants `hidden: { y: '-120%' } → visible: { y: 0 }`（duration 0.5, delay 0.2）。
- **hover 微動效**：桌面連結 `hover:-translate-y-1 hover:rotate-2 transition-all`；logo「K.」`-rotate-2 hover:rotate-0`。
- **手機漢堡選單**：`isOpen` state；漢堡鈕（三條線，neobrutalism 小方塊樣式）；展開為框下方 fixed 面板（粗框硬陰影、直列連結各自帶框），點連結或點擊面板外（`mousedown` listener + ref.contains）關閉。選單文字沿用 `nav.*` i18n key；面板內含 LangToggle/ThemeToggle 已在列上的不重複。
- 錨點點擊改 `scrollIntoView({ behavior: 'smooth' })`（現有 CSS scroll-behavior 保留為 fallback）。

### 2.4 Hero stagger 編排 + 2.5 滿版結構

- `HeroSection` 改滿版：`min-h-[500px] sm:min-h-[600px] max-h-[900px] h-[calc(100vh-6rem)]`（扣掉框 padding 與 navbar 高度的近似值，實作時微調）、`relative flex flex-col justify-center overflow-hidden`。
- **SkillsMarquee 移入 Hero 底部**：`absolute bottom-0 left-0 w-full`，以 motion variants `{ y: 100, opacity: 0 } → { y: 0, opacity: 1 }`（spring, delay 1.2s）滑入。`#skills` 錨點 id 保留在 marquee 的 section 元素上（nav 連結不變）；`App.tsx` 不再單獨 render `<SkillsMarquee />`。
- **stagger 編排**（仿 ronit variants）：外層 `containerVariants`（staggerChildren 0.2、delayChildren 0.3）；文字項 `itemVariants`（y:20→0 淡入）；社群 icon `socialIconVariants`（scale 0→1 spring；hover: scale 1.1 + rotate [0,-10,10,-10,0] 搖擺）；CTA `buttonVariants`（scale 0→1 spring，delay 1.5s，whileTap 0.95）。
- Hero 區內部格紋 + radial mask 淡出（`[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]` 疊層，色用 `--grid-line`）——框內其他區域維持一般格紋。
- 打字動畫維持職稱輪播（既定設計，不改成多語問候）。

### 2.6 Projects hover 動效

- 卡片：`transform transition-transform hover:scale-105` + `group`；圖片區 `overflow-hidden`、色塊/圖 `transition-transform group-hover:scale-110`。
- 標題框：`hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--border)] transition-all`（仿 ronit 標題卡）。
- Experience 的標題框同樣套用（一致性）。

### 2.7 SEO 進階 + Footer 升級

- `index.html`：
  - JSON-LD `Person` schema（`<script type="application/ld+json">`）：name（柯均翰/Keon Ko）、jobTitle、description（同 meta）、knowsAbout（12 技能）、sameAs（GitHub）。中文為主。
  - `og:image` / `twitter:card summary_large_image` / `twitter:image`：圖用 GitHub avatar 絕對網址 `https://github.com/keon981.png`（部署與正式 OG 圖確定後再換）。
  - `robots` meta（index, follow）。
- `Footer` 改**兩欄 + 底列**（YAGNI，不做參考站的第三欄）：左欄 Quick Links（沿用 `nav.*` key + scrollIntoView）、右欄 Get in Touch（現有按鈕群，標題加裝飾 `-rotate-1`）；底列：左版權、右 `</> with React + Vite + shadcn/ui` 黑底 mono badge。i18n 新增 `footer.quickLinks` key（兩份字典）。
- **年份自動化**：字典 `footer.copyright` 改帶 `{{year}}` 插值（`© {{year}} 柯均翰 …`），元件 `t('footer.copyright', { year: new Date().getFullYear() })`；兩份字典同步改。

## 3. 測試影響

- 既有 20 測試維持綠：App 整合測試需配合「淡入/loading」——jsdom 中 `document.images` 為空 → Promise.all 立即 resolve，僅剩 300ms timer；**統一用 async `findBy*` / `waitFor` 等待內容出現**（不用 fakeTimers，避免與 motion 內部計時器耦合）。
- 新增：LoadingScreen render smoke、Navbar 捲動顯隱（模擬 scroll 事件）、漢堡選單開合、Footer 年份 = 當年、Hero 內含 marquee（`#skills` 存在）。
- 完成後跑真瀏覽器 smoke（agent-browser：dev + build 各一次，六區塊渲染 + console 零錯誤）——Phase 1 的教訓固定為驗收步驟。

## 4. 風險與備註

- Hero 滿版在小螢幕的高度計算需實測微調（min/max 已設保護）。
- 等高線 SVG 為自製素材，美感以「線條稀疏、低對比」為準，可後續替換。
- `App.test` 與 `Navbar.test` 會需要小改（loading 編排、選單），屬預期內變動。
- og:image 用 GitHub avatar 是過渡方案，部署定案後換正式 OG 圖（1200×630）。
