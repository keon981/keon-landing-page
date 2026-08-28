export interface Experience {
  id: string
  i18nKey: string // experience.<i18nKey>.role / .company / .bullets
  from: string // 'YYYY.MM'
  to: string | null // null = present
}

export const experiences: Experience[] = [
  { id: 'efai', i18nKey: 'efai', from: '2023.04', to: '2026.06' },
]
