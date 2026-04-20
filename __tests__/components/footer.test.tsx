import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/footer'

describe('Footer', () => {
  it('tem link para @Gayaliz_ no X', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /@Gayaliz_/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://x.com/Gayaliz_')
  })
})
