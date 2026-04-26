'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-xs space-y-2">
          <Label
            htmlFor="nascimento-data"
            className="font-black uppercase tracking-wider text-foreground"
          >
            Data de nascimento *
          </Label>
          <Input
            id="nascimento-data"
            type="date"
            required
            aria-required="true"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-auto px-4 py-3 shadow-shadow"
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
    </Card>
  )
}
