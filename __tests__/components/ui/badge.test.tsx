import { Badge } from '@/components/ui/badge'
import { render, screen } from '@testing-library/react'

describe('Badge', () => {
  it('renderiza children', () => {
    render(<Badge>psicologia</Badge>)
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })

  it('aplica variant blue', () => {
    render(<Badge variant="blue">cosmos</Badge>)
    expect(screen.getByText('cosmos')).toHaveClass('bg-cosmic-blue/60')
  })

  it('aplica variant padrão quando nenhum variant é passado', () => {
    render(<Badge>cosmos</Badge>)
    expect(screen.getByText('cosmos')).toHaveClass('bg-main/55')
  })

  it('aplica variant stone para chips mais neutros', () => {
    render(<Badge variant="stone">aspecto</Badge>)
    expect(screen.getByText('aspecto')).toHaveClass('bg-stone-100')
  })
})
