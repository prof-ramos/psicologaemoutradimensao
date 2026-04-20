import Link from 'next/link'

interface NavbarProps {
  name: string
}

export function Navbar({ name }: NavbarProps) {
  return (
    <header className="border-b-2 border-border bg-main">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-heading text-xl font-black text-main-foreground hover:underline"
        >
          {name}
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="font-heading font-bold text-main-foreground hover:underline"
          >
            Blog
          </Link>
          <Link
            href="/mapa-astral"
            className="font-heading font-bold text-main-foreground hover:underline"
          >
            Mapa Astral
          </Link>
          <Link
            href="/contato"
            className="font-heading font-bold text-main-foreground hover:underline"
          >
            Contato
          </Link>
        </div>
      </nav>
    </header>
  )
}
