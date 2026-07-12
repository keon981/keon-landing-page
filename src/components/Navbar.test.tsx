import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { Navbar } from '@/components/Navbar'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders anchor links to all sections', () => {
  render(<Navbar />)
  expect(screen.getByRole('link', { name: '關於' })).toHaveAttribute('href', '#about')
  expect(screen.getByRole('link', { name: '技能' })).toHaveAttribute('href', '#skills')
  expect(screen.getByRole('link', { name: '經歷' })).toHaveAttribute('href', '#experience')
  expect(screen.getByRole('link', { name: '專案' })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: '聯絡我' })).toHaveAttribute('href', '#contact')
})

test('renders logo and toggles', () => {
  render(<Navbar />)
  expect(screen.getByText('K.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle theme' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle language' })).toBeInTheDocument()
})
