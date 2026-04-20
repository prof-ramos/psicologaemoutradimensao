export interface AppConfig {
  baseUrl: string
  blog: {
    name: string
    metadata: {
      title: {
        absolute: string
        default: string
        template: string
      }
      description: string
    }
  }
  ogImageSecret: string
  revalidationSecret: string
  wisp: { blogId: string }
}

const buildConfig = (): AppConfig => {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID
  if (!blogId) throw new Error('NEXT_PUBLIC_BLOG_ID is missing')

  const isProduction = process.env.NODE_ENV === 'production'

  const ogImageSecret = process.env.OG_IMAGE_SECRET
  if (isProduction && !ogImageSecret) {
    throw new Error('OG_IMAGE_SECRET is missing in production')
  }

  const revalidationSecret = process.env.REVALIDATION_SECRET
  if (isProduction && !revalidationSecret) {
    throw new Error('REVALIDATION_SECRET is missing in production')
  }

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
    ogImageSecret: ogImageSecret || 'dev-secret',
    revalidationSecret: revalidationSecret || '',
    wisp: { blogId },
  }
}

export const config: AppConfig = buildConfig()
