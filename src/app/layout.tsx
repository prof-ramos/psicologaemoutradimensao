import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { config } from '@/config'
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

const metadataTitle = config.blog.metadata.title
const resolvedDefaultTitle =
  typeof metadataTitle === 'string' ? metadataTitle : metadataTitle.default

export const metadata: Metadata = {
  title: metadataTitle,
  description: config.blog.metadata.description,
  openGraph: {
    title: resolvedDefaultTitle,
    description: config.blog.metadata.description,
    images: [{ url: `${config.baseUrl}/api/og/site`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${config.baseUrl}/api/og/site`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
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
        <Navbar name={config.blog.name} />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
