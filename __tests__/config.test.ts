describe('config', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('throws when NEXT_PUBLIC_BLOG_ID is missing', async () => {
    delete process.env.NEXT_PUBLIC_BLOG_ID
    jest.resetModules()
    await expect(import('../src/config')).rejects.toThrow('NEXT_PUBLIC_BLOG_ID is missing')
  })

  async function loadConfig() {
    jest.resetModules()
    return import('../src/config')
  }

  it('returns config with blogId when NEXT_PUBLIC_BLOG_ID is set', async () => {
    process.env.NEXT_PUBLIC_BLOG_ID = 'test-blog-id'
    const { config } = await loadConfig()
    expect(config.wisp.blogId).toBe('test-blog-id')
  })

  it('uses env var for blog name', async () => {
    process.env.NEXT_PUBLIC_BLOG_ID = 'abc'
    process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME = 'Meu Blog'
    const { config } = await loadConfig()
    expect(config.blog.name).toBe('Meu Blog')
  })

  it('uses default blog name when env var absent', async () => {
    delete process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME
    process.env.NEXT_PUBLIC_BLOG_ID = 'abc'
    const { config } = await loadConfig()
    expect(config.blog.name).toBe('PsicologaEmOutraDimensão')
  })

  it('preserves compatibility bridge fields from domain configs', async () => {
    process.env.NEXT_PUBLIC_BLOG_ID = 'abc'
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com '
    process.env.OG_IMAGE_SECRET = 'og-secret'
    process.env.REVALIDATION_SECRET = 'reval-secret'
    const { config } = await loadConfig()
    expect(config.baseUrl).toBe('https://example.com')
    expect(config.ogImageSecret).toBe('og-secret')
    expect(config.revalidationSecret).toBe('reval-secret')
  })
})
