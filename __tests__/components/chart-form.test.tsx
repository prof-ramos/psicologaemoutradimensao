import { render, screen } from '@testing-library/react'
import { ChartForm } from '@/app/mapa-astral/chart-form'

// Mock de next/navigation usado no componente
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('ChartForm', () => {
  it('renderiza campo de data', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
  })

  it('renderiza campo de hora como opcional', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/hora de nascimento/i)).toBeInTheDocument()
    expect(screen.getByText(/opcional/i)).toBeInTheDocument()
  })

  it('renderiza campo de cidade', () => {
    render(<ChartForm />)
    expect(screen.getByPlaceholderText(/são paulo/i)).toBeInTheDocument()
  })

  it('renderiza botão de busca de cidade', () => {
    render(<ChartForm />)
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
  })

  it('renderiza botão de calcular mapa', () => {
    render(<ChartForm />)
    expect(screen.getByRole('button', { name: /calcular mapa astral/i })).toBeInTheDocument()
  })
})
