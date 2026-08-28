import { render, screen } from '@testing-library/react'

import { HeroSection } from '@/components/block/HeroSection'
import i18n from '@/lib/i18n'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

it('renders name, intro and github link', () => {
  render(<HeroSection />)
  // h1 內含 emoji，用 regex 部分比對
  expect(screen.getByText(/我是柯均翰/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keon981',
  )
})

it('switches name on language change', async () => {
  await i18n.changeLanguage('en')
  render(<HeroSection />)
  expect(screen.getByText(/I'm Keon Ko/)).toBeInTheDocument()
})

it('contains the skills marquee pinned inside the hero', () => {
  const { container } = render(<HeroSection />)
  expect(container.querySelector('#skills')).toBeInTheDocument()
})
