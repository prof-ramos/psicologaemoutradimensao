describe('config', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('throws when NEXT_PUBLIC_BLOG_ID is missing', () => {
    delete process.env.NEXT_PUBLIC_BLOG_ID
    jest.resetModules()
    expect(() => require('../src/config')).toThrow('NEXT_PUBLIC_BLOG_ID is missing')
  })

  it('returns config with blogId when NEXT_PUBLIC_BLOG_ID is set', () => {
    process.env.NEXT_PUBLIC_BLOG_ID = 'test-blog-id'
    jest.resetModules()
    const { config } = require('../src/config')
    expect(config.wisp.blogId).toBe('test-blog-id')
  })

  it('uses env var for blog name', () => {
    process.env.NEXT_PUBLIC_BLOG_ID = 'abc'
    process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME = 'Meu Blog'
    jest.resetModules()
    const { config } = require('../src/config')
    expect(config.blog.name).toBe('Meu Blog')
  })

  it('uses default blog name when env var absent', () => {
    delete process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME
    process.env.NEXT_PUBLIC_BLOG_ID = 'abc'
    jest.resetModules()
    const { config } = require('../src/config')
    expect(config.blog.name).toBe('PsicologaEmOutraDimensão')
  })
})
