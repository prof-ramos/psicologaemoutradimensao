/**
 * @jest-environment node
 */

jest.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))

const mockGetPosts = jest.fn()
const mockGetPost = jest.fn()

jest.mock('../../src/features/blog/client', () => ({
  getWispClient: () => ({
    getPosts: (...args: unknown[]) => mockGetPosts(...args),
    getPost: (...args: unknown[]) => mockGetPost(...args),
  }),
}))

describe('blog service', () => {
  beforeEach(() => {
    mockGetPosts.mockReset()
    mockGetPost.mockReset()
  })

  it('delegates paginated listing to wisp client', async () => {
    mockGetPosts.mockResolvedValue({
      posts: [{ id: '1', slug: 'hello' }],
      pagination: { page: 2, totalPosts: 10, limit: 6, totalPages: 2, nextPage: null, prevPage: 1 },
    })

    const { getBlogPostsPage } = await import('../../src/features/blog/service')
    const result = await getBlogPostsPage(2, 6)

    expect(mockGetPosts).toHaveBeenCalledWith({ page: 2, limit: 6 })
    expect(result.posts).toHaveLength(1)
    expect(result.pagination.page).toBe(2)
  })

  it('returns all posts for static generation consumers', async () => {
    mockGetPosts.mockResolvedValue({
      posts: [{ id: '1', slug: 'hello' }, { id: '2', slug: 'world' }],
      pagination: { page: 1, totalPosts: 2, limit: 'all', totalPages: 1, nextPage: null, prevPage: null },
    })

    const { getAllBlogPosts } = await import('../../src/features/blog/service')
    const result = await getAllBlogPosts()

    expect(mockGetPosts).toHaveBeenCalledWith({ limit: 'all' })
    expect(result).toHaveLength(2)
  })

  it('returns cached post by slug', async () => {
    mockGetPost.mockResolvedValue({ post: { id: '1', slug: 'hello', title: 'Hello', tags: [] } })

    const { getBlogPostBySlug } = await import('../../src/features/blog/service')
    const result = await getBlogPostBySlug('hello')

    expect(mockGetPost).toHaveBeenCalledWith('hello')
    expect(result.post?.slug).toBe('hello')
  })
})
