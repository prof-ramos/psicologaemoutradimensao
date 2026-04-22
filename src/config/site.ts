import { readTrimmedEnv } from './shared'

interface SiteConfig {
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
}

const name = readTrimmedEnv('NEXT_PUBLIC_BLOG_DISPLAY_NAME') || 'PsicologaEmOutraDimensão'
const defaultDescription = readTrimmedEnv('NEXT_PUBLIC_BLOG_DESCRIPTION') || 'Blog pessoal'
const baseUrl = (readTrimmedEnv('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000').replace(/\/+$/, '')

export const siteConfig = {
  baseUrl,
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
} satisfies SiteConfig
