import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ValidSeuDiaParams } from './types'

export interface SeuDiaRawParams {
  data?: string | string[]
}

type ParsedSeuDiaParams =
  | { kind: 'empty' }
  | { kind: 'invalid'; error: string }
  | { kind: 'valid'; value: ValidSeuDiaParams }

const DATE_RE = /^\d{4}-\d{1,2}-\d{1,2}$/

function normalizeString(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value.find((item) => item.trim()) : value
  const trimmed = raw?.trim()
  return trimmed ? trimmed : undefined
}

export function parseSeuDiaParams(input: SeuDiaRawParams): ParsedSeuDiaParams {
  const data = normalizeString(input.data)
  if (!data) return { kind: 'empty' }
  if (!DATE_RE.test(data)) return { kind: 'invalid', error: 'Data inválida.' }

  const [year, month, day] = data.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  if (
    !year ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return { kind: 'invalid', error: 'Data inválida.' }
  }

  const display = format(new Date(year, month - 1, day), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return {
    kind: 'valid',
    value: { month, day, year, display },
  }
}
