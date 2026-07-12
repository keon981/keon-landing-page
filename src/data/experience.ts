export type Experience = {
  id: string
  i18nKey: string // experience.<i18nKey>.role / .company / .bullets
  from: string // 'YYYY.MM'
  to: string | null // null = present
}

export const experiences: Experience[] = [
  { id: 'changtien', i18nKey: 'changtien', from: '2023.04', to: null },
]
