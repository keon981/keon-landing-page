import { fireEvent, render, screen } from '@testing-library/react'
import i18n from '@/i18n'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

beforeEach(async () => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  await i18n.changeLanguage('zh-TW')
})

test('ThemeToggle toggles dark class', () => {
  render(<ThemeToggle />)
  fireEvent.click(screen.getByRole('button', { name: 'toggle theme' }))
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})

test('LangToggle switches language', async () => {
  render(<LangToggle />)
  const btn = screen.getByRole('button', { name: 'toggle language' })
  expect(btn).toHaveTextContent('EN')
  fireEvent.click(btn)
  // changeLanguage 為非同步，等 re-render 後的文字
  expect(await screen.findByText('中')).toBeInTheDocument()
  expect(i18n.language).toBe('en')
})
