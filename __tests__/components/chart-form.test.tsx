import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChartForm } from '@/app/mapa-astral/chart-form'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

beforeEach(() => {
  mockPush.mockClear()
})

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

  it('botão calcular fica desabilitado sem dados obrigatórios', () => {
    render(<ChartForm />)
    const submit = screen.getByRole('button', { name: /calcular mapa astral/i })
    expect(submit).toBeDisabled()
  })

  it('botão calcular habilita com data e lat/lng preenchidos', () => {
    render(<ChartForm initialData="1990-03-15" initialLat="-23.55" initialLng="-46.63" />)
    const submit = screen.getByRole('button', { name: /calcular mapa astral/i })
    expect(submit).not.toBeDisabled()
  })

  it('navega com params corretos ao submeter', () => {
    render(<ChartForm initialData="1990-03-15" initialLat="-23.55" initialLng="-46.63" initialCidade="São Paulo" />)
    fireEvent.submit(screen.getByRole('button', { name: /calcular mapa astral/i }).closest('form')!)
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/mapa-astral?')
    )
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('data=1990-03-15'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('lat=-23.55'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('lng=-46.63'))
  })

  it('exibe erro quando busca de cidade falha', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as jest.Mock

    render(<ChartForm initialCidade="XYZ Inexistente" />)
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText(/nenhuma cidade encontrada/i)).toBeInTheDocument()
    })
  })

  it('exibe resultados de cidade quando busca retorna dados', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { display_name: 'São Paulo, Brasil', lat: '-23.55', lon: '-46.63' },
      ],
    }) as jest.Mock

    render(<ChartForm initialCidade="São Paulo" />)
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument()
    })
  })
})
