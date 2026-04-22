import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-base',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const metadataTitle = siteConfig.blog.metadata.title
const resolvedDefaultTitle =
  typeof metadataTitle === 'string' ? metadataTitle : metadataTitle.default
const ogUrl = new URL('/api/og/site', siteConfig.baseUrl).toString()

export const metadata: Metadata = {
  title: metadataTitle,
  description: siteConfig.blog.metadata.description,
  openGraph: {
    title: resolvedDefaultTitle,
    description: siteConfig.blog.metadata.description,
    images: [{ url: ogUrl, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogUrl],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-main focus:text-main-foreground focus:border-2 focus:border-border"
        >
          Pular para o conteúdo
        </a>
        <Navbar name={siteConfig.blog.name} />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
