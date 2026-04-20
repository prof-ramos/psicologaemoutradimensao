const buildConfig = () => {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID
  if (!blogId) throw new Error('NEXT_PUBLIC_BLOG_ID is missing')

  const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || 'PsicologaEmOutraDimensão'
  const defaultDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || 'Blog pessoal'

  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    blog: {
      name,
      metadata: {
        title: {
          absolute: name,
          default: name,
          template: `%s — ${name}`,
        },
        description: defaultDescription,
      },
    },
    ogImageSecret: process.env.OG_IMAGE_SECRET || 'dev-secret',
    revalidationSecret: process.env.REVALIDATION_SECRET || '',
    wisp: { blogId },
  }
}

export const config = buildConfig()
