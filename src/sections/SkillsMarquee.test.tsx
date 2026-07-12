import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { skills } from '@/data/skills'
import { SkillsMarquee } from '@/sections/SkillsMarquee'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('has 12 skills', () => {
  expect(skills).toHaveLength(12)
})

test('renders every skill name', () => {
  render(<SkillsMarquee />)
  for (const s of skills) {
    expect(screen.getAllByText(s.name).length).toBeGreaterThanOrEqual(1)
  }
})
