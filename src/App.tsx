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
    // 內容尚未掛載，等待圖片無意義（document.images 必為空）；
    // 改等字型就緒（避免淡入後字型閃換）+ 300ms 最短展示
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    Promise.all([
      fontsReady,
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
