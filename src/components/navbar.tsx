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
    <header className="border-b-2 border-border bg-main">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-heading text-xl font-black text-main-foreground hover:underline"
        >
          {name}
        </Link>
        <div className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="font-heading font-bold text-main-foreground hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
