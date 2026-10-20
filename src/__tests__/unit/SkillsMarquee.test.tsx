import { render, screen } from '@testing-library/react'

import { skills } from '@/assets/data/skills'
import { SkillsMarquee } from '@/components/block/SkillsMarquee'
import i18n from '@/lib/i18n'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

it('has 16 skills', () => {
  expect(skills).toHaveLength(16)
})

it('renders every skill name', () => {
  render(<SkillsMarquee />)
  for (const s of skills) {
    expect(screen.getAllByText(s.name).length).toBeGreaterThanOrEqual(1)
  }
})
