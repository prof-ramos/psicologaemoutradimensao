import { Badge } from '@/components/ui/badge'
import { render, screen } from '@testing-library/react'

describe('Badge', () => {
  it('renderiza children', () => {
    render(<Badge>psicologia</Badge>)
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })

  it('aplica variant neutral', () => {
    render(<Badge variant="neutral">cosmos</Badge>)
    expect(screen.getByText('cosmos')).toHaveClass('bg-secondary-background')
  })

  it('aplica variant padrão quando nenhum variant é passado', () => {
    render(<Badge>cosmos</Badge>)
    expect(screen.getByText('cosmos')).toHaveClass('bg-main')
  })
})
