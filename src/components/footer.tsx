import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <p className="font-base text-sm">
          © {new Date().getFullYear()} PsicologaEmOutraDimensão
        </p>
        <Link
          href="https://x.com/Gayaliz_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir perfil @Gayaliz_ no X em nova aba"
          className="font-heading text-sm font-bold hover:underline"
        >
          @Gayaliz_
        </Link>
      </div>
    </footer>
  )
}
