'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface DateFormProps {
  defaultValue?: string
}

export function DateForm({ defaultValue = '' }: DateFormProps) {
  const router = useRouter()
  const [date, setDate] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    startTransition(() => {
      router.push(`/seu-dia?data=${date}`)
    })
  }

  return (
    <div className="border-2 border-border bg-background p-6 shadow-shadow md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-xs space-y-2">
          <label
            htmlFor="nascimento-data"
            className="font-heading text-sm font-black uppercase tracking-wider text-foreground"
          >
            Data de nascimento *
          </label>
          <input
            id="nascimento-data"
            type="date"
            required
            aria-required="true"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-border bg-secondary-background px-4 py-3 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-main transition-all"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto md:min-w-[240px]"
          disabled={!date || isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span>Descobrir Meu Dia</span>
        </Button>
      </form>
    </div>
  )
}
