import { parseSeuDiaParams } from '@/features/seu-dia'

describe('parseSeuDiaParams', () => {
  it('aceita data válida e devolve partes da data', () => {
    const parsed = parseSeuDiaParams({ data: '1990-04-22' })

    expect(parsed.kind).toBe('valid')
    if (parsed.kind !== 'valid') return
    expect(parsed.value).toMatchObject({
      year: 1990,
      month: 4,
      day: 22,
    })
    expect(parsed.value.display).toMatch(/22 de abril de 1990/i)
  })

  it('rejeita formato inválido', () => {
    expect(parseSeuDiaParams({ data: '22/04/1990' })).toEqual({
      kind: 'invalid',
      error: 'Data inválida.',
    })
  })

  it('rejeita datas inexistentes no calendário', () => {
    expect(parseSeuDiaParams({ data: '2024-02-31' })).toEqual({
      kind: 'invalid',
      error: 'Data inválida.',
    })
  })

  it('usa o primeiro valor preenchido quando recebe array de query params', () => {
    const parsed = parseSeuDiaParams({ data: ['', '2000-01-02'] })

    expect(parsed.kind).toBe('valid')
    if (parsed.kind !== 'valid') return
    expect(parsed.value).toMatchObject({ year: 2000, month: 1, day: 2 })
  })
})
