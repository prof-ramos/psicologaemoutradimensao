import { Navbar } from '@/components/navbar'
import { render, screen } from '@testing-library/react'

describe('Navbar', () => {
  it('renderiza o nome do blog', () => {
    render(<Navbar name="PsicologaEmOutraDimensão" />)
    expect(screen.getByText('PsicologaEmOutraDimensão')).toBeInTheDocument()
  })

  test.each([
    [/blog/i, '/blog'],
    [/contato/i, '/contato'],
    [/mapa astral/i, '/mapa-astral'],
    [/seu dia/i, '/seu-dia'],
  ])('tem link para %s', (name, href) => {
    render(<Navbar name="Test" />)
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  })
})

describe('Navbar — edge cases', () => {
  it('renderiza nome vazio sem quebrar', () => {
    render(<Navbar name="" />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renderiza nome longo e faz truncate', () => {
    const longName = 'A'.repeat(200)
    render(<Navbar name={longName} />)
    expect(screen.getByText(longName)).toBeInTheDocument()
  })
})

describe('Navbar Acessibilidade', () => {
  it('nav tem aria-label', () => {
    render(<Navbar name="Test" />)
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toHaveAttribute('aria-label')
  })
})
