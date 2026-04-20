import { BlogPostCard } from '@/components/blog-post-card'
import { render, screen } from '@testing-library/react'

const mockPost = {
  id: '1',
  slug: 'meu-primeiro-post',
  title: 'Meu Primeiro Post',
  description: 'Uma descrição interessante',
  image: null,
  publishedAt: new Date('2026-01-15'),
  tags: [{ id: '1', name: 'psicologia' }],
}

const mockPostWithImage = {
  id: '2',
  slug: 'meu-segundo-post',
  title: 'Meu Segundo Post',
  description: 'Descrição do segundo post',
  image: 'https://example.com/img.jpg',
  publishedAt: new Date('2026-01-15'),
  tags: [],
}

describe('BlogPostCard', () => {
  it('renderiza título do post como heading', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByRole('heading', { name: 'Meu Primeiro Post' })).toBeInTheDocument()
  })

  it('renderiza descrição', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText('Uma descrição interessante')).toBeInTheDocument()
  })

  it('tem link para /blog/[slug]', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByRole('link', { name: /meu primeiro post/i })).toHaveAttribute(
      'href',
      '/blog/meu-primeiro-post'
    )
  })

  it('renderiza a tag', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })

  it('link é acessível por teclado', () => {
    render(<BlogPostCard post={mockPost} />)
    const link = screen.getByRole('link', { name: /meu primeiro post/i })
    expect(link).toHaveAttribute('tabIndex', '0')
  })

  it('imagem tem texto alternativo adequado', () => {
    render(<BlogPostCard post={mockPostWithImage} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', mockPostWithImage.title)
  })

  it('renderiza data formatada corretamente', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText(/15.*jan.*2026/i)).toBeInTheDocument()
  })
})
