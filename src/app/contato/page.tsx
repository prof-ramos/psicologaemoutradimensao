import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato pelo X (Twitter) — @Gayaliz_.',
}

export default function ContatoPage() {
  return (
    <main className="flex flex-col items-center justify-center space-y-8 px-4 py-20 text-center min-h-[60vh]">
      <div className="space-y-4">
        <div className="inline-block border-2 border-border bg-vibrant-pink px-4 py-2 shadow-shadow">
          <h1 className="font-heading text-4xl font-black">Contato</h1>
        </div>
        <p className="font-base text-muted-foreground">Me encontre no X (Twitter)</p>
      </div>

      <Button asChild size="lg">
        <a
          href="https://x.com/Gayaliz_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir perfil no X, abre em nova aba"
        >
          <X className="h-5 w-5" aria-hidden="true" />
          @Gayaliz_
        </a>
      </Button>
    </main>
  )
}
