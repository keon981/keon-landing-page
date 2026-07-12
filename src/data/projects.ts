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
