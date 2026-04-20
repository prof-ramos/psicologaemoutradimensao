import { render, screen } from '@testing-library/react'
import { BlogPostCard } from '@/components/blog-post-card'

const mockPost = {
  id: '1',
  slug: 'meu-primeiro-post',
  title: 'Meu Primeiro Post',
  description: 'Uma descrição interessante',
  image: null,
  publishedAt: new Date('2026-01-15'),
  tags: [{ id: '1', name: 'psicologia' }],
}

describe('BlogPostCard', () => {
  it('renderiza título do post', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText('Meu Primeiro Post')).toBeInTheDocument()
  })

  it('renderiza descrição', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText('Uma descrição interessante')).toBeInTheDocument()
  })

  it('tem link para /blog/[slug]', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/meu-primeiro-post')
  })

  it('renderiza a tag', () => {
    render(<BlogPostCard post={mockPost} />)
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })
})
