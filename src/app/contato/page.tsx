import type { Metadata } from 'next'
import { TwitterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contato',
}

export default function ContatoPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center">
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
        >
          <TwitterIcon className="h-5 w-5" />
          @Gayaliz_
        </a>
      </Button>
    </div>
  )
}
