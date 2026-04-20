'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  name: string
}

const NAV_ITEMS = [
  { href: '/blog', label: 'Blog' },
  { href: '/mapa-astral', label: 'Mapa Astral' },
  { href: '/contato', label: 'Contato' },
]

export function Navbar({ name }: NavbarProps) {
  const pathname = usePathname()

  return (
    <header className="border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 md:py-5"
      >
        <Link
          href="/"
          className="max-w-[14rem] text-balance font-heading text-lg font-bold leading-tight tracking-[-0.03em] text-foreground transition-opacity hover:opacity-80 sm:max-w-none md:text-xl"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-border/10 bg-surface px-2 py-1.5 shadow-[var(--shadow-soft)]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={[
                'rounded-full px-3 py-2 font-heading text-sm font-semibold tracking-[0.01em] transition-colors',
                pathname === item.href
                  ? 'bg-foreground text-background'
                  : 'text-foreground/72 hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
