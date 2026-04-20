import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/10 bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-base text-sm text-background/72">
          © {new Date().getFullYear()} PsicologaEmOutraDimensão
        </p>
        <Link
          href="https://x.com/Gayaliz_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir perfil @Gayaliz_ no X em nova aba"
          className="font-heading text-sm font-semibold tracking-[0.01em] text-background transition-opacity hover:opacity-75"
        >
          @Gayaliz_
        </Link>
      </div>
    </footer>
  )
}
