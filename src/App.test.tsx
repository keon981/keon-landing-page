import { render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import App from './App'

beforeEach(async () => {
  await i18n.changeLanguage('zh-TW')
})

test('shows loading screen first, then renders all six blocks', async () => {
  render(<App />)
  expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument()
  expect(
    await screen.findByRole('navigation', {}, { timeout: 3000 }),
  ).toBeInTheDocument()
  for (const id of ['about', 'skills', 'experience', 'projects', 'contact']) {
    expect(document.querySelector(`#${id}`)).toBeInTheDocument()
  }
})

test('wraps content in the neobrutalism page frame', async () => {
  render(<App />)
  const frame = await screen.findByTestId('page-frame', {}, { timeout: 3000 })
  expect(frame.className).toContain('border-border')
  expect(frame.querySelector('main')).toBeInTheDocument()
})
