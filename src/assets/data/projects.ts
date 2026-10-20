import project1Avif from '@/assets/images/project-1.avif'
import project1Jpg from '@/assets/images/project-1.jpg'
import project1Webp from '@/assets/images/project-1.webp'
import project2Avif from '@/assets/images/project-2.avif'
import project2Jpg from '@/assets/images/project-2.jpg'
import project2Webp from '@/assets/images/project-2.webp'
import project3Avif from '@/assets/images/project-3.avif'
import project3Jpg from '@/assets/images/project-3.jpg'
import project3Webp from '@/assets/images/project-3.webp'

export interface ProjectImage {
  avif: string
  webp: string
  fallback: string
  width: number
  height: number
}

export interface Project {
  id: string
  i18nKey: string // projects.items.<i18nKey>.title / .desc
  tags: string[]
  codeUrl: string | null
  demoUrl: string | null
  tone: 'main' | 'highlight' | 'accent'
  image: ProjectImage | null
}

export const projects: Project[] = [
  {
    id: 'p1',
    i18nKey: 'p1',
    tags: ['React', 'Vite', 'TypeScript'],
    codeUrl: null,
    demoUrl: 'https://medical.everfortuneai.com.tw/oncology-radiotherapy-ai',
    tone: 'main',
    image: {
      avif: project1Avif,
      webp: project1Webp,
      fallback: project1Jpg,
      width: 512,
      height: 341,
    },
  },
  {
    id: 'p2',
    i18nKey: 'p2',
    tags: ['Next.js', 'TypeScript', 'TanStack Query', 'GitHub API'],
    codeUrl: 'https://github.com/keon981/kreads-app',
    demoUrl: 'https://kreads-app-virid.vercel.app/',
    tone: 'highlight',
    image: {
      avif: project2Avif,
      webp: project2Webp,
      fallback: project2Jpg,
      width: 512,
      height: 341,
    },
  },
  {
    id: 'p3',
    i18nKey: 'p3',
    tags: ['Next.js', 'Drizzle ORM', 'TanStack Table', 'Recharts'],
    codeUrl: 'https://github.com/keon981/kreads-app',
    demoUrl: 'https://kreads-dashboard-app.vercel.app/',
    tone: 'accent',
    image: {
      avif: project3Avif,
      webp: project3Webp,
      fallback: project3Jpg,
      width: 512,
      height: 341,
    },
  },
]
