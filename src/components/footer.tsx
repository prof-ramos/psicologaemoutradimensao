import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-foreground pt-12 pb-16 text-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="font-heading text-lg font-black uppercase tracking-tight">
            PsicologaEmOutraDimensão
          </p>
          <p className="font-base text-xs opacity-60">
            © {new Date().getFullYear()} — Todos os direitos reservados.
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <Link
            href="https://x.com/Gayaliz_"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir perfil @Gayaliz_ no X em nova aba"
            className="group flex items-center gap-2 border-2 border-border bg-main px-4 py-2 font-heading text-sm font-black uppercase text-main-foreground shadow-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <span>Twitter</span>
            <span className="text-lg leading-none transition-transform group-hover:rotate-12">↗</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
