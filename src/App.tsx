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
