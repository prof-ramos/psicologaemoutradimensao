'use client'

import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavbarProps {
  name: string
}

const NAV_ITEMS = [
  { href: '/blog', label: 'Blog' },
  { href: '/mapa-astral', label: 'Mapa Astral' },
  { href: '/seu-dia', label: 'Seu Dia' },
  { href: '/contato', label: 'Contato' },
]

export function Navbar({ name }: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b-2 border-border bg-main shadow-shadow sticky top-0 z-50">
      <nav aria-label="Main navigation" className="mx-auto max-w-6xl px-4 py-3 md:py-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="min-w-0 max-w-[calc(100%-56px)] truncate py-2 font-heading text-lg font-black text-main-foreground transition-transform hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] sm:text-xl md:max-w-none"
          >
            {name}
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1.5 font-heading text-sm font-black uppercase tracking-tight transition-all',
                    isActive
                      ? 'bg-foreground text-background border-2 border-border shadow-shadow -translate-x-1 -translate-y-1'
                      : 'text-main-foreground hover:bg-foreground/5'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center border-2 border-border bg-background shadow-shadow transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden border-t-2 border-border mt-3 pt-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'block px-3 py-3 font-heading text-sm font-black uppercase tracking-tight transition-all',
                    isActive
                      ? 'bg-foreground text-background border-2 border-border'
                      : 'text-main-foreground border-2 border-transparent hover:bg-foreground/5'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </header>
  )
}
