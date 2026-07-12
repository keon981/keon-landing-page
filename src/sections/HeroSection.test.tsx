import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { HeroSection } from '@/sections/HeroSection'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders name, intro and github link', () => {
  render(<HeroSection />)
  // h1 內含 emoji，用 regex 部分比對
  expect(screen.getByText(/我是柯均翰/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keon981',
  )
})

test('switches name on language change', async () => {
  await i18n.changeLanguage('en')
  render(<HeroSection />)
  expect(screen.getByText(/I'm Keon Ko/)).toBeInTheDocument()
})
