import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { Footer } from '@/sections/Footer'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders mailto and github links', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /寫信給我/ })).toHaveAttribute(
    'href',
    'mailto:h21816595@gmail.com',
  )
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/keon981',
  )
})

test('shows current year and quick links', () => {
  render(<Footer />)
  const year = String(new Date().getFullYear())
  expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  expect(screen.getByText('快速連結')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '經歷' })).toHaveAttribute('href', '#experience')
})
