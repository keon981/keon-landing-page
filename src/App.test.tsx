import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import App from './App'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('renders all six blocks', () => {
  render(<App />)
  expect(screen.getByRole('navigation')).toBeInTheDocument()
  expect(document.querySelector('#about')).toBeInTheDocument()
  expect(document.querySelector('#skills')).toBeInTheDocument()
  expect(document.querySelector('#experience')).toBeInTheDocument()
  expect(document.querySelector('#projects')).toBeInTheDocument()
  expect(document.querySelector('#contact')).toBeInTheDocument()
})

test('wraps content in the neobrutalism page frame', () => {
  render(<App />)
  const frame = screen.getByTestId('page-frame')
  expect(frame.className).toContain('border-border')
  expect(frame.querySelector('main')).toBeInTheDocument()
})
