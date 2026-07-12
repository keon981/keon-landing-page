# Keon 個人 Landing Page — 設計文件

日期：2026-07-12
狀態：已與使用者逐節核准（版面 wireframe + 技術架構）

## 1. 目標與背景

為前端工程師柯均翰（keon981）建立單頁式個人 landing page，版面骨架參考 [ronit.io](https://ronit.io/)（開源：`ronitjadhav/ronit.io`）的 Neobrutalism 風格，配色自訂。內容以 Cake.me 個人檔案（https://www.cake.me/me/keon981 ，2026-07-12 擷取）為準。

## 2. 技術棧

| 用途 | 選擇 | 備註 |
|---|---|---|
| 建置 | Vite + React + TypeScript | 使用者日常技術棧 |
| 樣式 | Tailwind CSS v4 + shadcn/ui（最新版，`npx shadcn@latest init`） | CSS variables 模式（neobrutalism 樣式只支援此模式） |
| Neobrutalism 樣式層 | 自訂 token + 元件變體 | 參考 [neobrutalism.dev](https://www.neobrutalism.dev/docs)（已停止維護，僅作樣式參考，不直接依賴其 registry） |
| 進場/互動動畫 | motion（原 framer-motion） | |
| 打字動畫 | react-type-animation | Hero 職稱輪播 |
| 跑馬燈 | react-fast-marquee | 技能區 |
| i18n | react-i18next | zh-TW / en 雙字典 |
| 主題 | 自製 `useTheme` hook | `html.dark` class + localStorage |
| 測試 | Vitest + React Testing Library | 輕量 smoke tests |

所有套件的實際版本號於實作計畫階段逐一查證鎖定。

## 3. 版面設計（六區塊，已核准 wireframe）

單頁滾動，錨點導覽：

1. **Navbar**（sticky）：薄荷綠底、logo「K.」、錨點連結（關於/技能/經歷/專案）、中|EN 切換、🌙 主題切換、Get in Touch（蜜桃粉 CTA，捲動到 Footer）
2. **Hero**：左側問候語 + 名字 +（react-type-animation）職稱打字輪播 + 自介段落（取自 Cake description）+ GitHub 圖示 + CTA；右側大頭照拱形色塊 + 貼紙風徽章（「Frontend Dev」「3+ yrs」）。motion 進場動畫
3. **技能跑馬燈**：上下粗黑框白底橫幅，12 項技能（icon + 名稱）無限滾動
4. **工作經歷時間軸**：垂直時間軸（節點 + 黑線）+ 經歷卡片。資料為陣列，未來直接追加。**不含學歷與證照**
5. **專案作品**：3 張 placeholder 卡片（圖 + 標題 + 描述 + 技術 Badge + Code/Demo 按鈕）。真實內容之後由使用者提供，僅換 data 與字典
6. **Footer / Get in Touch**：深色底、「一起做點什麼吧！」+ Email（mailto）+ GitHub 按鈕 + 版權列。無聯絡表單

## 4. 配色（方案 C・薄荷綠 × 蜜桃粉，已核准）

亮色（起始值，實作時對齊 neobrutalism token 結構微調）：

| Token | 值 | 用途 |
|---|---|---|
| background | `#FFF9F2` | 頁面底（奶油）+ 格紋線 `rgba(0,0,0,.05)` |
| main | `#52E5C4` | 薄荷綠：Navbar、Hero 色塊、時間軸節點 |
| accent | `#FF7BA9` | 蜜桃粉：CTA、強調元素 |
| highlight | `#FFE156` | 黃：標籤、日期 chip、打字底色 |
| border/text | `#000` / `#111` | 粗框（2–3px）、硬陰影（`4px 4px 0 #000`） |

深色模式：底色轉深灰系（約 `#1a1a1a`）、卡片轉深、文字翻轉為淺色；main/accent/highlight 三主色不變（neobrutalism 慣例）；格紋線改淡白。

字型：英文標題 Space Grotesk（Google Fonts）、中文與內文 system stack（PingFang TC / Noto Sans TC fallback）、等寬處 monospace。

## 5. 檔案結構

```
src/
  components/
    ui/            # shadcn 元件（button、card、badge…）改寫為 neobrutalism 變體
    Navbar.tsx / ThemeToggle.tsx / LangToggle.tsx
  sections/        # HeroSection、SkillsMarquee、ExperienceTimeline、ProjectsSection、Footer
  data/            # experience.ts、projects.ts、skills.ts（型別化陣列，文字欄位存 i18n key）
  i18n/            # index.ts + locales/zh-TW.json、locales/en.json
  hooks/           # useTheme.ts
  lib/utils.ts     # shadcn cn()
  index.css        # neobrutalism CSS 變數（亮/暗兩套）
  App.tsx / main.tsx
```

## 6. 資料流

- **內容與結構分離**：結構性資料（經歷、專案、技能）在 `data/` 以 TS 型別定義；所有顯示文字集中於 `locales/*.json`。更新內容只動 data + 字典。
- **語言**：react-i18next，`LangToggle` 切換 zh-TW/en，localStorage 記憶，同步 `<html lang>`。英文文案由實作時翻譯草擬、交使用者審閱。
- **主題**：`useTheme` 切換 `html.dark`，CSS 變數翻轉，localStorage 記憶，初始值尊重 `prefers-color-scheme`。

## 7. 網站內容（2026-07-12 自 Cake.me 擷取）

- **姓名**：柯均翰（Keon Ko）／ headline：網頁前端工程師 ／ 求職目標：Front-End / Full Stack Web Developer
- **自介**（Hero 段落來源）：3 年前端開發經驗，能獨立負責從規劃到落地的完整專案；以 React、Vite、TypeScript、Next.js 開發高效能、易維護的後台系統；具 Figma 規劃 UI/UX 與流程圖經驗；RESTful API 文件撰寫與前後端串接；善用 AI 工具（Claude Code、GitHub Copilot）輔助開發
- **工作經歷**：前端工程師 @ 長佳智能股份有限公司（2023.04 – 現在）
  1. 獨立主導前端開發與維護（框架選型、模組化規劃），從 0 到 1 建立或重構前端系統
  2. 與 UI/UX、AI 團隊及醫療專業人員跨部門協作，迭代開發多項醫療軟體產品介面
  3. 維護與迭代 DICOM 醫療影像系統（顯示、處理、儲存、傳輸，含篩選、數位操作、量測）
  4. 與後端工程師協作 API 串接與文檔撰寫
  5. 撰寫並維護軟體設計與開發文件，參與技術可行性評估
  6. 建立並持續優化前端技術架構與元件系統，跨產品複用
- **技能（跑馬燈 12 項）**：React.js/Redux、TypeScript、Vite.js、Next.js、Figma、Storybook.js、Vitest、GitHub、GitLab、Cornerstone.js、FastAPI(Python)、RESTful API（RWD 併入敘述不進跑馬燈，順序實作時微調）
- **連結**：GitHub https://github.com/keon981 ／ Email（mailto）：h21816595@gmail.com（如要改用其他信箱再調整）

## 8. 錯誤處理與其他

- 純靜態頁、無 API。圖片 lazy loading；外部連結 `target="_blank" rel="noopener noreferrer"`。
- 部署未定：`vite.config` base 用相對路徑（`./`），GitHub Pages / Vercel 均相容；SEO meta / OG 標籤手寫於 `index.html`（中文為主）。
- RWD：手機單欄（Hero 圖文疊排、專案卡片直排），Tailwind 斷點處理。

## 9. 測試

- 各 section render 不噴錯（smoke）
- 語言切換後關鍵文字改變
- 主題切換後 `html.dark` 生效
- `data/` 型別由 TypeScript 把關

## 10. 範圍外（此版不做）

- 學歷、證照區塊
- 聯絡表單（EmailJS）
- 真實專案內容（placeholder 先行）
- 互動地圖（參考站的 Journey 地圖）
- AI chatbot（參考站的 Ask AI）
- 部落格
