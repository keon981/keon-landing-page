import { fireEvent, render, screen, within } from '@testing-library/react'

import { Navbar } from '@/components/layout/Navbar'
import i18n from '@/lib/i18n'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

it('renders anchor links to all sections', () => {
  render(<Navbar />)
  expect(screen.getByRole('link', { name: '關於' })).toHaveAttribute('href', '#about')
  expect(screen.getByRole('link', { name: '技能' })).toHaveAttribute('href', '#skills')
  expect(screen.getByRole('link', { name: '經歷' })).toHaveAttribute('href', '#experience')
  expect(screen.getByRole('link', { name: '專案' })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: '聯絡我' })).toHaveAttribute('href', '#contact')
})

it('renders logo and toggles', () => {
  render(<Navbar />)
  expect(screen.getByText('K.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle theme' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'toggle language' })).toBeInTheDocument()
})

it('hamburger opens and closes the mobile menu', () => {
  render(<Navbar />)
  const burger = screen.getByRole('button', { name: '開啟選單' })
  expect(burger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(burger)
  expect(burger).toHaveAttribute('aria-expanded', 'true')
  const menu = screen.getByTestId('mobile-menu')
  expect(within(menu).getByRole('link', { name: '經歷' })).toHaveAttribute(
    'href',
    '#experience',
  )
  fireEvent.mouseDown(document.body)
  expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
})

it('hides on scroll down and shows on scroll up', () => {
  render(<Navbar />)
  const bar = screen.getByTestId('navbar-inner')
  Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
  fireEvent.scroll(window)
  expect(bar.className).toContain('-translate-y-')
  Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
  fireEvent.scroll(window)
  expect(bar.className).toContain('translate-y-0')
})
