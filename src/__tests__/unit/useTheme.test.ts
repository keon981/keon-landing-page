import { act, renderHook } from '@testing-library/react'

import { useTheme } from '@/hooks/useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

it('defaults to light when no preference', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
  expect(document.documentElement.classList.contains('dark')).toBe(false)
})

it('toggle switches to dark, sets class and persists', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggle())
  expect(result.current.theme).toBe('dark')
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(localStorage.getItem('theme')).toBe('dark')
})

it('respects stored theme', () => {
  localStorage.setItem('theme', 'dark')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
})
