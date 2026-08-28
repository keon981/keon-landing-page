import { render, screen } from '@testing-library/react'

import { ProjectsSection } from '@/components/block/ProjectsSection'
import i18n from '@/lib/i18n'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

it('renders 3 placeholder cards with disabled buttons', () => {
  render(<ProjectsSection />)
  expect(screen.getByText('專案一')).toBeInTheDocument()
  expect(screen.getByText('專案二')).toBeInTheDocument()
  expect(screen.getByText('專案三')).toBeInTheDocument()
  const codeButtons = screen.getAllByRole('button', { name: '程式碼' })
  expect(codeButtons).toHaveLength(3)
  expect(codeButtons[0]).toBeDisabled()
})
