'use client'

import { cn } from '@/lib/utils'
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
    <header className="border-b-2 border-border bg-main shadow-shadow sticky top-0 z-50">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="font-heading text-xl font-black text-main-foreground hover:translate-x-[2px] hover:translate-y-[2px] transition-transform active:translate-x-[4px] active:translate-y-[4px]"
        >
          {name}
        </Link>
        <div className="flex items-center gap-3 md:gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "px-3 py-1.5 font-heading text-sm font-black uppercase tracking-tight transition-all",
                  isActive 
                    ? "bg-foreground text-background border-2 border-border shadow-shadow -translate-x-1 -translate-y-1" 
                    : "text-main-foreground hover:bg-foreground/5"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
