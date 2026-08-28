import project1Avif from '@/assets/images/project-1.avif'
import project1Jpg from '@/assets/images/project-1.jpg'
import project1Webp from '@/assets/images/project-1.webp'

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
    tags: ['React', 'Vite', 'TypeScript'],
    codeUrl: null,
    demoUrl: null,
    tone: 'highlight',
    image: null,
  },
  {
    id: 'p3',
    i18nKey: 'p3',
    tags: ['Next.js'],
    codeUrl: null,
    demoUrl: null,
    tone: 'accent',
    image: null,
  },
]
