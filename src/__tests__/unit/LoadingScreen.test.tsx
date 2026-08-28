import { render, screen } from '@testing-library/react'

import { LoadingScreen } from '@/components/ui/LoadingScreen'

it('renders loading status with brutalist card', () => {
  render(<LoadingScreen />)
  expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument()
  expect(screen.getByText('LOADING')).toBeInTheDocument()
})
