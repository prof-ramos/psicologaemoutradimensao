import { DayResults } from '@/app/seu-dia/day-results'
import type { OnThisDayResult, ValidSeuDiaParams, WikiEvent } from '@/features/seu-dia'
import { render, screen } from '@testing-library/react'

const params: ValidSeuDiaParams = {
  year: 1990,
  month: 4,
  day: 22,
  display: '22 de abril de 1990',
}

function event(year: number, text: string, pageOverrides: Partial<WikiEvent['pages'][number]> = {}): WikiEvent {
  return {
    year,
    text,
    pages: [
      {
        title: text,
        extract: `${text}. Texto complementar.`,
        content_urls: {
          desktop: {
            page: 'https://pt.wikipedia.org/wiki/Teste',
          },
        },
        ...pageOverrides,
      },
    ],
  }
}

function result(overrides: Partial<OnThisDayResult> = {}): OnThisDayResult {
  return {
    exactDayEvents: [],
    events: [],
    births: [],
    deaths: [],
    ...overrides,
  }
}

describe('DayResults', () => {
  it('renderiza as seções com copy final do produto', () => {
    render(
      <DayResults
        params={params}
        result={result({
          exactDayEvents: [event(1990, 'Aconteceu no ano')],
          events: [event(1500, 'Evento histórico')],
          births: [event(1900, 'Pessoa nasceu')],
          deaths: [event(1950, 'Pessoa morreu')],
        })}
      />
    )

    expect(screen.getByRole('heading', { name: /22 de abril de 1990/i })).toBeInTheDocument()
    expect(screen.getByText(/Dados públicos da Wikipedia pt-BR/i)).toBeInTheDocument()
    expect(screen.getByText('No seu ano')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Eventos do dia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nasceram neste dia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Morreram neste dia' })).toBeInTheDocument()
  })

  it('renderiza estado vazio quando não há dados', () => {
    render(<DayResults params={params} result={result()} />)

    expect(
      screen.getByText(/Ainda não encontramos registros para esta data/i)
    ).toBeInTheDocument()
  })

  it('normaliza títulos da Wikipedia removendo underscores', () => {
    render(
      <DayResults
        params={params}
        result={result({
          births: [event(1995, 'Jonas_Blue')],
        })}
      />
    )

    expect(screen.getAllByText('Jonas Blue')).toHaveLength(2)
    expect(screen.queryByText('Jonas_Blue')).not.toBeInTheDocument()
  })

  it('usa o texto do evento como fallback quando a pessoa vem sem página da Wikipedia', () => {
    render(
      <DayResults
        params={params}
        result={result({
          births: [
            event(2006, 'Ryan Francisco, futebolista brasileiro.', {
              title: undefined,
              extract: undefined,
              content_urls: undefined,
            }),
          ],
        })}
      />
    )

    expect(screen.getByText('Ryan Francisco')).toBeInTheDocument()
    expect(screen.getByText('2006')).toBeInTheDocument()
  })

  it('não estica thumbnails verticais ou pequenas em cards de evento', () => {
    const { container } = render(
      <DayResults
        params={params}
        result={result({
          events: [
            event(2019, 'A Tesla lança o Tesla Cybertruck.', {
              thumbnail: {
                source: 'https://example.com/logo.png',
                width: 330,
                height: 426,
              },
            }),
          ],
        })}
      />
    )

    expect(container.querySelector('img')).toHaveClass('object-contain')
  })
})
