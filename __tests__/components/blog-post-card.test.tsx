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
  beforeEach(() => {
    render(<BlogPostCard post={mockPost} />)
  })

  it('renderiza título do post', () => {
    expect(screen.getByText('Meu Primeiro Post')).toBeInTheDocument()
  })

  it('renderiza descrição', () => {
    expect(screen.getByText('Uma descrição interessante')).toBeInTheDocument()
  })

  it('tem link para /blog/[slug]', () => {
    expect(screen.getByRole('link', { name: /meu primeiro post/i })).toHaveAttribute(
      'href',
      '/blog/meu-primeiro-post'
    )
  })

  it('renderiza a tag', () => {
    expect(screen.getByText('psicologia')).toBeInTheDocument()
  })
})
