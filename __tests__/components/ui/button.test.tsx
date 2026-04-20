import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('aplica classe bg-main no variant default', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-main')
  })

  it('aplica borda de 2px', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-2')
  })

  it('renderiza desabilitado', () => {
    render(<Button disabled>Test</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
