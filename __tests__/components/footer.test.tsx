import { Footer } from '@/components/footer'
import { render, screen } from '@testing-library/react'

describe('Footer', () => {
  it('tem link para o Twitter', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /abrir perfil @gayaliz_ no x em nova aba/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://x.com/Gayaliz_')
  })

  it('renderiza copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/©/)).toBeInTheDocument()
  })

  it('link do X tem aria-label descritivo', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /abrir perfil @gayaliz_ no x em nova aba/i })
    expect(link).toHaveAttribute('aria-label', expect.stringMatching(/nova aba/i))
  })
})
