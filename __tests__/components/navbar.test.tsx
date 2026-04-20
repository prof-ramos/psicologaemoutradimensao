import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/navbar'

describe('Navbar', () => {
  it('renderiza o nome do blog', () => {
    render(<Navbar name="PsicologaEmOutraDimensão" />)
    expect(screen.getByText('PsicologaEmOutraDimensão')).toBeInTheDocument()
  })

  it('tem link para /blog', () => {
    render(<Navbar name="Test" />)
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog')
  })

  it('tem link para /contato', () => {
    render(<Navbar name="Test" />)
    expect(screen.getByRole('link', { name: /contato/i })).toHaveAttribute('href', '/contato')
  })

  it('tem link para /mapa-astral', () => {
    render(<Navbar name="Test" />)
    expect(screen.getByRole('link', { name: /mapa astral/i })).toHaveAttribute('href', '/mapa-astral')
  })
})
