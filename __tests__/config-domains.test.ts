describe('domain configs', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_BLOG_ID = 'blog-id'
    delete process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME
    delete process.env.NEXT_PUBLIC_BLOG_DESCRIPTION
    delete process.env.NEXT_PUBLIC_BASE_URL
    delete process.env.FREEPIK_API_KEY
    delete process.env.OG_IMAGE_SECRET
    delete process.env.REVALIDATION_SECRET
    jest.resetModules()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('siteConfig trims baseUrl and uses defaults', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com \n'
    const { siteConfig } = await import('../src/config/site')
    expect(siteConfig.baseUrl).toBe('https://example.com')
    expect(siteConfig.blog.name).toBe('PsicologaEmOutraDimensão')
  })

  it('cmsConfig allows missing blog id so previews can build without CMS access', async () => {
    delete process.env.NEXT_PUBLIC_BLOG_ID
    jest.resetModules()
    const { cmsConfig } = await import('../src/config/cms')
    expect(cmsConfig.blogId).toBeUndefined()
  })

  it('integrationsConfig builds webhook URL from siteConfig', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://site.test'
    process.env.FREEPIK_API_KEY = 'freepik-key'
    const { integrationsConfig } = await import('../src/config/integrations')
    expect(integrationsConfig.freepikApiKey).toBe('freepik-key')
    expect(integrationsConfig.freepikWebhookUrl).toBe('https://site.test/api/icons/webhook')
  })
})
