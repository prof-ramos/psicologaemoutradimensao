import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renderiza children', () => {
    render(<Badge>psicologia</Badge>)
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })

  it('aplica variant blue', () => {
    render(<Badge variant="blue">cosmos</Badge>)
    expect(screen.getByText('cosmos').closest('div')).toHaveClass('bg-cosmic-blue')
  })
})
