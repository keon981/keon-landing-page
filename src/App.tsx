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
