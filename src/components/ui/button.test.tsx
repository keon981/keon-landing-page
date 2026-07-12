import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('default variant uses main color and hard shadow', () => {
  render(<Button>Hi</Button>)
  const btn = screen.getByRole('button', { name: 'Hi' })
  expect(btn.className).toContain('bg-main')
  expect(btn.className).toContain('shadow-shadow')
})

test('accent variant uses accent color', () => {
  render(<Button variant="accent">Go</Button>)
  expect(screen.getByRole('button', { name: 'Go' }).className).toContain('bg-accent')
})
