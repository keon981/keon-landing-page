import { render, screen } from '@testing-library/react'

import { ExperienceTimeline } from '@/components/block/ExperienceTimeline'
import i18n from '@/lib/i18n'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

it('renders role, company, period and bullets', () => {
  render(<ExperienceTimeline />)
  expect(screen.getByText('前端工程師')).toBeInTheDocument()
  expect(screen.getByText('長佳智能股份有限公司')).toBeInTheDocument()
  expect(screen.getByText('2023.04 – 現在')).toBeInTheDocument()
  // bullets 共 6 條（數量由 Task 3 的 i18n 測試把關），這裡斷言首尾兩條有渲染
  expect(screen.getByText(/獨立主導前端開發與維護/)).toBeInTheDocument()
  expect(screen.getByText(/跨產品複用/)).toBeInTheDocument()
})
