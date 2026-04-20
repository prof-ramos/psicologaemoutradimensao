import { ChartForm } from '@/app/mapa-astral/chart-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const originalFetch: typeof globalThis.fetch | undefined = globalThis.fetch

beforeEach(() => {
  mockPush.mockClear()
})

afterEach(() => {
  if (originalFetch !== undefined) {
    globalThis.fetch = originalFetch
  }
})

describe('ChartForm', () => {
  it('renderiza campo de data', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
  })

  it('renderiza campo de hora como opcional', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/hora de nascimento/i)).toBeInTheDocument()
    expect(screen.getByText(/\(opcional\)/i)).toBeInTheDocument()
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
    render(<ChartForm initialDate="1990-03-15" initialLat="-23.55" initialLng="-46.63" />)
    const submit = screen.getByRole('button', { name: /calcular mapa astral/i })
    expect(submit).not.toBeDisabled()
  })

  it('navega com params corretos ao submeter', () => {
    render(<ChartForm initialDate="1990-03-15" initialLat="-23.55" initialLng="-46.63" initialCidade="São Paulo" />)
    const button = screen.getByRole('button', { name: /calcular mapa astral/i })
    const form = button.closest('form')
    expect(form).toBeInTheDocument()
    fireEvent.submit(form as HTMLFormElement)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/mapa-astral?'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('data=1990-03-15'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('lat=-23.55'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('lng=-46.63'))
  })

  it('exibe mensagem quando busca de cidade retorna sem resultados', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as unknown as Response)

    render(<ChartForm initialCidade="XYZ Inexistente" />)
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText(/nenhuma cidade encontrada/i)).toBeInTheDocument()
    })
  })

  it('exibe resultados de cidade quando busca retorna dados', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { display_name: 'São Paulo, Brasil', lat: '-23.55', lon: '-46.63' },
      ],
    } as unknown as Response)

    render(<ChartForm initialCidade="São Paulo" />)
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument()
    })
  })

  it('exibe erro de rede quando fetch rejeita', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    render(<ChartForm initialCidade="São Paulo" />)
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText(/erro ao buscar cidade/i)).toBeInTheDocument()
    })
  })

  it('inclui hora na navegação quando o campo é informado', () => {
    render(<ChartForm initialDate="1990-03-15" initialLat="-23.55" initialLng="-46.63" initialHora="14:30" />)
    const submit = screen.getByRole('button', { name: /calcular mapa astral/i })
    const form = submit.closest('form')
    expect(form).toBeInTheDocument()
    fireEvent.submit(form as HTMLFormElement)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('hora=14%3A30'))
  })

  it('exibe múltiplos resultados de cidade e permite selecionar', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { display_name: 'São Paulo, SP, Brasil', lat: '-23.55', lon: '-46.63' },
        { display_name: 'São Bernardo do Campo, SP, Brasil', lat: '-23.69', lon: '-46.54' },
      ],
    } as unknown as Response)

    render(<ChartForm />)
    fireEvent.change(screen.getByLabelText(/cidade de nascimento/i), {
      target: { value: 'São' },
    })
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))

    await waitFor(() => {
      expect(screen.getByText('São Paulo, SP, Brasil')).toBeInTheDocument()
      expect(screen.getByText('São Bernardo do Campo, SP, Brasil')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('São Bernardo do Campo, SP, Brasil'))

    expect(screen.getByLabelText(/cidade de nascimento/i)).toHaveValue('São Bernardo do Campo')
    expect(screen.getByText(/-23\.69°/)).toBeInTheDocument()
    expect(screen.getByText(/-46\.54°/)).toBeInTheDocument()
  })
})
