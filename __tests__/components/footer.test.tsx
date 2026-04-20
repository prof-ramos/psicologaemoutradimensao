import { Footer } from '@/components/footer'
import { render, screen } from '@testing-library/react'

describe('Footer', () => {
  it('tem link para @Gayaliz_ no X', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /@gayaliz_/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://x.com/Gayaliz_')
  })

  it('renderiza copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/©/)).toBeInTheDocument()
  })

  it('link do X tem aria-label descritivo', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /@gayaliz_/i })
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('nova aba'))
  })
})
