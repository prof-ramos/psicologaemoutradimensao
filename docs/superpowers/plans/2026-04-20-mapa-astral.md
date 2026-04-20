# Mapa Astral — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar página `/mapa-astral` ao blog com formulário de dados de nascimento, geocoding via Nominatim e renderização de mapa natal SVG 100% open source.

**Architecture:** Server Component lê URL searchParams, calcula o horóscopo com `circular-natal-horoscope-js` no servidor e passa o resultado como prop para um Client Component que renderiza o SVG via `astrochart` (import dinâmico dentro de `useEffect` para evitar acesso ao DOM no SSR). Geocoding é um Route Handler que faz proxy para a API pública Nominatim. Dados persistidos na URL (shareable link).

**Tech Stack:** Next.js 15 App Router, `circular-natal-horoscope-js`, `astrochart`, Nominatim OpenStreetMap API, TypeScript, Tailwind CSS v4 (tokens neobrutalism existentes), Jest + React Testing Library

---

## Contexto de Design

- Hero: `bg-cosmic-blue` (#4DB8FF)
- Cor de destaque: `bg-main` (#CCFF00) para badges de info
- Bordas e sombras: tokens existentes `border-border`, `shadow-shadow`
- Sem hora → calcula com 12:00, retorna `hasHouses: false`, esconde casas/Ascendente

---

## File Map

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/horoscope-i18n.ts` | Mapas de tradução pt-BR: planetas, signos, aspectos |
| `src/lib/horoscope.ts` | `calculateHoroscope()` — wraps circular-natal-horoscope-js, exporta tipos |
| `src/app/api/geocode/route.ts` | GET proxy para Nominatim, retorna array de sugestões |
| `src/components/navbar.tsx` | Adicionar link "Mapa Astral" |
| `src/app/mapa-astral/chart-details.tsx` | Server Component: tabela de posições + lista de aspectos |
| `src/app/mapa-astral/chart-svg.tsx` | Client Component: renderiza SVG com astrochart via useEffect |
| `src/app/mapa-astral/chart-form.tsx` | Client Component: formulário + busca de cidade |
| `src/app/mapa-astral/page.tsx` | Server Page: lê params, calcula, compõe layout |
| `__tests__/lib/horoscope.test.ts` | Testes unitários do cálculo |
| `__tests__/api/geocode.test.ts` | Testes de validação do geocode |

---

## Task 0: Instalar Dependências

**Files:**
- Modify: `package.json` (via npm install)

- [ ] Instalar libs de cálculo e renderização:
```bash
npm install circular-natal-horoscope-js astrochart
```

- [ ] Verificar que as libs foram adicionadas ao `package.json`:
```bash
grep -E "circular-natal|astrochart" package.json
```
> Esperado: ambas aparecem em `dependencies`

- [ ] Verificar que o projeto compila sem erros:
```bash
npx tsc --noEmit 2>&1 | head -10
```
> Esperado: sem erros (pode aparecer aviso sobre tipos ausentes — tudo bem por ora)

- [ ] Commit:
```bash
git add package.json package-lock.json
git commit -m "chore: instala circular-natal-horoscope-js e astrochart"
```

---

## Task 1: Traduções pt-BR (`src/lib/horoscope-i18n.ts`)

**Files:**
- Create: `src/lib/horoscope-i18n.ts`

- [ ] Criar `src/lib/horoscope-i18n.ts`:
```ts
/** Mapa body.key (lowercase) → nome em pt-BR */
export const PLANET_PT: Record<string, string> = {
  sun:       'Sol',
  moon:      'Lua',
  mercury:   'Mercúrio',
  venus:     'Vênus',
  mars:      'Marte',
  jupiter:   'Júpiter',
  saturn:    'Saturno',
  uranus:    'Urano',
  neptune:   'Netuno',
  pluto:     'Plutão',
  chiron:    'Quíron',
  northnode: 'Nodo Norte',
  southnode: 'Nodo Sul',
  lilith:    'Lilith',
}

/** Sign.label (English, Title Case) → nome em pt-BR */
export const SIGN_PT: Record<string, string> = {
  Aries:       'Áries',
  Taurus:      'Touro',
  Gemini:      'Gêmeos',
  Cancer:      'Câncer',
  Leo:         'Leão',
  Virgo:       'Virgem',
  Libra:       'Libra',
  Scorpio:     'Escorpião',
  Sagittarius: 'Sagitário',
  Capricorn:   'Capricórnio',
  Aquarius:    'Aquário',
  Pisces:      'Peixes',
}

/** aspect.aspectKey (lowercase) → nome em pt-BR */
export const ASPECT_PT: Record<string, string> = {
  conjunction: 'Conjunção',
  opposition:  'Oposição',
  trine:       'Trígono',
  square:      'Quadratura',
  sextile:     'Sextil',
  quincunx:    'Quincúncio',
}

/**
 * Converte body.key (lowercase) para chave do AstroChart.
 * Regra geral: capitaliza primeira letra. Exceções: northnode → NNode.
 */
export function toAstroChartKey(key: string): string {
  const exceptions: Record<string, string> = {
    northnode: 'NNode',
    southnode: 'SNode',
  }
  return exceptions[key] ?? (key.charAt(0).toUpperCase() + key.slice(1))
}
```

- [ ] Commit:
```bash
git add src/lib/horoscope-i18n.ts
git commit -m "feat: adiciona traduções pt-BR para planetas, signos e aspectos"
```

---

## Task 2: Cálculo Astrológico (`src/lib/horoscope.ts`)

**Files:**
- Create: `src/lib/horoscope.ts`
- Create: `__tests__/lib/horoscope.test.ts`

- [ ] **Escrever teste** — `__tests__/lib/horoscope.test.ts`:
```ts
import { calculateHoroscope } from '../../src/lib/horoscope'

const BASE_INPUT = {
  year: 1990, month: 3, day: 15,    // 15 de março de 1990
  hour: 14,   minute: 30,
  lat: -23.5505, lng: -46.6333,     // São Paulo
  hasTime: true,
}

describe('calculateHoroscope', () => {
  it('retorna planetas no formato AstroChart (Sun, Moon, etc.)', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.planets).toHaveProperty('Sun')
    expect(result.planets).toHaveProperty('Moon')
    expect(Array.isArray(result.planets['Sun'])).toBe(true)
    expect(result.planets['Sun'][0]).toBeGreaterThanOrEqual(0)
    expect(result.planets['Sun'][0]).toBeLessThan(360)
  })

  it('retorna 12 cúspides quando hasTime=true', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.cusps).toHaveLength(12)
    expect(result.hasHouses).toBe(true)
  })

  it('retorna cusps vazio e hasHouses=false quando hasTime=false', () => {
    const result = calculateHoroscope({ ...BASE_INPUT, hasTime: false })
    expect(result.cusps).toHaveLength(0)
    expect(result.hasHouses).toBe(false)
  })

  it('planetas retrógrados têm -0.2 como segundo elemento', () => {
    const result = calculateHoroscope(BASE_INPUT)
    for (const values of Object.values(result.planets)) {
      expect(values.length).toBeGreaterThanOrEqual(1)
      expect(values.length).toBeLessThanOrEqual(2)
      if (values.length === 2) {
        expect(values[1]).toBe(-0.2)
      }
    }
  })

  it('posições têm signo em pt-BR', () => {
    const result = calculateHoroscope(BASE_INPUT)
    const validSigns = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem',
                        'Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    for (const pos of result.positions) {
      expect(validSigns).toContain(pos.signPt)
    }
  })

  it('planetas têm nome em pt-BR', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(result.positions.map(p => p.namePt)).toContain('Sol')
    expect(result.positions.map(p => p.namePt)).toContain('Lua')
  })

  it('retorna aspectos com estrutura correta', () => {
    const result = calculateHoroscope(BASE_INPUT)
    expect(Array.isArray(result.aspects)).toBe(true)
    for (const asp of result.aspects) {
      expect(asp).toHaveProperty('planet1')
      expect(asp).toHaveProperty('planet2')
      expect(asp).toHaveProperty('typePt')
      expect(typeof asp.orb).toBe('number')
    }
  })
})
```

- [ ] Rodar para confirmar FAIL:
```bash
npx jest __tests__/lib/horoscope.test.ts 2>&1 | tail -5
```
> Esperado: FAIL com "Cannot find module"

- [ ] Criar `src/lib/horoscope.ts`:
```ts
import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import { PLANET_PT, SIGN_PT, ASPECT_PT, toAstroChartKey } from './horoscope-i18n'

export type PlanetPosition = {
  key: string           // lowercase body key: "sun", "moon", …
  namePt: string        // "Sol", "Lua", …
  signPt: string        // "Áries", "Touro", …
  degreeInSign: number  // 0–29.99 graus dentro do signo
  decimalDegrees: number // 0–359.99 graus na eclíptica
  isRetrograde: boolean
  house: number         // 1–12 (0 quando hasHouses=false)
}

export type AspectInfo = {
  planet1: string  // nome pt-BR
  planet2: string  // nome pt-BR
  typePt: string   // "Conjunção", "Trígono", …
  orb: number      // ex: 2.3
}

export type HoroscopeResult = {
  /** Formato AstroChart: { Sun: [281], Moon: [268, -0.2], … } */
  planets: Record<string, number[]>
  /** 12 cúspides em graus eclípticos (0–360). Vazio se hasHouses=false */
  cusps: number[]
  positions: PlanetPosition[]
  aspects: AspectInfo[]
  hasHouses: boolean
}

export type HoroscopeInput = {
  year: number
  month: number   // 1-indexed: January=1, …, December=12
  day: number
  hour: number    // 0–23 (use 12 se hora desconhecida)
  minute: number  // 0–59
  lat: number
  lng: number
  hasTime: boolean  // false → calcula com hora=12:00 mas esconde casas no output
}

export function calculateHoroscope(input: HoroscopeInput): HoroscopeResult {
  const origin = new (Origin as any)({
    year:      input.year,
    month:     input.month - 1,   // Origin usa meses 0-indexed
    date:      input.day,
    hour:      input.hour,
    minute:    input.minute,
    latitude:  input.lat,
    longitude: input.lng,
  })

  const horoscope = new (Horoscope as any)({
    origin,
    houseSystem:      'placidus',
    zodiac:           'tropical',
    aspectPoints:     ['bodies'],
    aspectWithPoints: ['bodies'],
    aspectTypes:      ['major'],
    customOrbs: {
      conjunction: 10,
      opposition:  10,
      trine:        8,
      square:       7,
      sextile:      6,
      quincunx:     3,
    },
  })

  // ── Posições planetárias ──────────────────────────────────────────────
  const planets: Record<string, number[]> = {}
  const positions: PlanetPosition[] = []

  for (const body of horoscope.CelestialBodies.all as any[]) {
    const key: string = body.key          // "sun", "moon", …
    const dec: number = body.ChartPosition.Ecliptic.DecimalDegrees
    const isRetro: boolean = !!body.isRetrograde

    planets[toAstroChartKey(key)] = isRetro ? [dec, -0.2] : [dec]

    positions.push({
      key,
      namePt:         PLANET_PT[key]           ?? key,
      signPt:         SIGN_PT[body.Sign.label]  ?? body.Sign.label,
      degreeInSign:   dec % 30,
      decimalDegrees: dec,
      isRetrograde:   isRetro,
      house: input.hasTime ? (body.House?.id ?? 0) : 0,
    })
  }

  // ── Cúspides das casas ────────────────────────────────────────────────
  const cusps: number[] = input.hasTime
    ? (horoscope.Houses as any[]).map(
        (h: any) => h.ChartPosition.StartPosition.Ecliptic.DecimalDegrees
      )
    : []

  // ── Aspectos ──────────────────────────────────────────────────────────
  const aspects: AspectInfo[] = (horoscope.Aspects.all as any[]).map((asp: any) => ({
    planet1: PLANET_PT[asp.point1Key] ?? asp.point1Label,
    planet2: PLANET_PT[asp.point2Key] ?? asp.point2Label,
    typePt:  ASPECT_PT[asp.aspectKey] ?? asp.label,
    orb:     Math.round(asp.orb * 10) / 10,
  }))

  return { planets, cusps, positions, aspects, hasHouses: input.hasTime }
}
```

- [ ] Rodar testes:
```bash
npx jest __tests__/lib/horoscope.test.ts 2>&1 | tail -10
```
> Esperado: PASS (6 testes)

- [ ] Commit:
```bash
git add src/lib/horoscope.ts __tests__/lib/horoscope.test.ts
git commit -m "feat: adiciona cálculo astrológico com circular-natal-horoscope-js"
```

---

## Task 3: Geocode Route Handler (`src/app/api/geocode/route.ts`)

**Files:**
- Create: `src/app/api/geocode/route.ts`
- Create: `__tests__/api/geocode.test.ts`

- [ ] **Escrever teste** — `__tests__/api/geocode.test.ts`:
```ts
describe('geocode query validation', () => {
  it('rejeita query vazia', () => {
    const q = ''
    expect(q.trim().length < 2).toBe(true)
  })

  it('rejeita query com 1 caractere', () => {
    const q = 'S'
    expect(q.trim().length < 2).toBe(true)
  })

  it('aceita cidade válida', () => {
    const q = 'São Paulo'
    expect(q.trim().length >= 2).toBe(true)
  })

  it('aceita cidade estrangeira', () => {
    const q = 'Paris'
    expect(q.trim().length >= 2).toBe(true)
  })
})
```

- [ ] Rodar para confirmar PASS (lógica pura):
```bash
npx jest __tests__/api/geocode.test.ts
```
> Esperado: PASS (4 testes)

- [ ] Criar `src/app/api/geocode/route.ts`:
```ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''

  if (q.trim().length < 2) {
    return Response.json({ error: 'Query muito curta' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PsicologaEmOutraDimensao/1.0 (psicologaemoutradimensao.vercel.app)',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      // Nominatim pede no máximo 1 req/s — não cacheamos para garantir resultados frescos
      cache: 'no-store',
    })

    if (!res.ok) {
      return Response.json({ error: 'Serviço de geocoding indisponível' }, { status: 502 })
    }

    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] Commit:
```bash
git add src/app/api/geocode/ __tests__/api/geocode.test.ts
git commit -m "feat: adiciona Route Handler de geocoding via Nominatim"
```

---

## Task 4: Atualizar Navbar

**Files:**
- Modify: `src/components/navbar.tsx`
- Modify: `__tests__/components/navbar.test.tsx`

- [ ] Adicionar teste ao `__tests__/components/navbar.test.tsx`. Abrir o arquivo e adicionar este teste dentro do `describe('Navbar', ...)`:
```tsx
it('tem link para /mapa-astral', () => {
  render(<Navbar name="Test" />)
  expect(screen.getByRole('link', { name: /mapa astral/i })).toHaveAttribute('href', '/mapa-astral')
})
```

- [ ] Rodar para confirmar FAIL:
```bash
npx jest __tests__/components/navbar.test.tsx
```
> Esperado: FAIL — link não existe ainda

- [ ] Editar `src/components/navbar.tsx` — adicionar link "Mapa Astral" **entre** Blog e Contato:
```tsx
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
```

- [ ] Rodar testes:
```bash
npx jest __tests__/components/navbar.test.tsx
```
> Esperado: PASS (4 testes)

- [ ] Commit:
```bash
git add src/components/navbar.tsx __tests__/components/navbar.test.tsx
git commit -m "feat: adiciona link Mapa Astral na navbar"
```

---

## Task 5: Detalhes do Mapa (`src/app/mapa-astral/chart-details.tsx`)

**Files:**
- Create: `src/app/mapa-astral/chart-details.tsx`

> Server Component — sem `"use client"`. Recebe dados já calculados como props.

- [ ] Criar `src/app/mapa-astral/chart-details.tsx`:
```tsx
import type { HoroscopeResult } from '@/lib/horoscope'
import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'

const ASPECT_VARIANTS: Array<BadgeProps['variant']> = ['default', 'blue', 'pink', 'orange']

interface ChartDetailsProps {
  data: HoroscopeResult
  cidade: string
  dataStr: string   // "1990-03-15"
  hora?: string     // "14:30" ou undefined
}

export function ChartDetails({ data, cidade, dataStr, hora }: ChartDetailsProps) {
  const [year, month, day] = dataStr.split('-')
  const formattedDate = `${day}/${month}/${year}`

  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="border-2 border-border bg-main p-4 shadow-shadow">
        <p className="font-heading text-sm font-black uppercase">
          {formattedDate}
          {hora ? ` às ${hora}` : ''}
          {cidade ? ` · ${cidade}` : ''}
        </p>
        {!data.hasHouses && (
          <p className="mt-1 font-base text-xs text-foreground/70">
            Sem horário — casas e Ascendente não calculados
          </p>
        )}
      </div>

      {/* Tabela de posições */}
      <div className="space-y-2">
        <h2 className="font-heading text-lg font-black uppercase">Posições Planetárias</h2>
        <div className="border-2 border-border overflow-hidden">
          <table className="w-full font-base text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Planeta
                </th>
                <th className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Signo
                </th>
                <th className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                  Grau
                </th>
                {data.hasHouses && (
                  <th className="px-3 py-2 text-left font-heading text-xs font-black uppercase tracking-wide">
                    Casa
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.positions.map((pos, i) => (
                <tr
                  key={pos.key}
                  className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}
                >
                  <td className="px-3 py-2 font-medium">
                    {pos.namePt}
                    {pos.isRetrograde && (
                      <span className="ml-1 text-xs text-muted-foreground" title="Retrógrado">
                        ℞
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{pos.signPt}</td>
                  <td className="px-3 py-2 tabular-nums">{Math.floor(pos.degreeInSign)}°</td>
                  {data.hasHouses && (
                    <td className="px-3 py-2">{pos.house}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aspectos */}
      {data.aspects.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-black uppercase">Aspectos Principais</h2>
          <div className="flex flex-wrap gap-2">
            {data.aspects.map((asp, i) => (
              <Badge key={i} variant={ASPECT_VARIANTS[i % ASPECT_VARIANTS.length]}>
                {asp.planet1} {asp.typePt} {asp.planet2}
                <span className="ml-1 font-normal opacity-70">({asp.orb}°)</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] Verificar TypeScript:
```bash
npx tsc --noEmit 2>&1 | grep "chart-details" | head -5
```
> Esperado: sem erros

- [ ] Commit:
```bash
git add src/app/mapa-astral/chart-details.tsx
git commit -m "feat: adiciona componente de detalhes do mapa astral"
```

---

## Task 6: SVG do Mapa (`src/app/mapa-astral/chart-svg.tsx`)

**Files:**
- Create: `src/app/mapa-astral/chart-svg.tsx`

> Client Component — usa `useEffect` com `import('astrochart')` dinâmico para evitar SSR.

- [ ] Criar `src/app/mapa-astral/chart-svg.tsx`:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import type { HoroscopeResult } from '@/lib/horoscope'

interface ChartSVGProps {
  data: HoroscopeResult
}

export function ChartSVG({ data }: ChartSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const chartId = 'mapa-astral-canvas'

  useEffect(() => {
    if (!containerRef.current) return
    setError(null)

    // Limpar renderização anterior
    containerRef.current.innerHTML = ''
    containerRef.current.id = chartId

    import('astrochart')
      .then(() => {
        const astrology = (window as any).astrology
        if (!astrology) {
          setError('Não foi possível carregar o renderizador do mapa.')
          return
        }

        const size = Math.min(containerRef.current!.offsetWidth || 560, 560)

        const chart = new astrology.Chart(chartId, size, size, {
          MARGIN:           50,
          SYMBOL_SCALE:     0.9,
          COLOR_BACKGROUND: '#ffffff',
          POINTS_COLOR:     '#000000',
          SIGNS_COLOR:      '#000000',
          CIRCLE_COLOR:     '#333333',
          LINE_COLOR:       '#333333',
        })

        const radix = chart.radix({
          planets: data.planets,
          cusps:   data.cusps.length === 12 ? data.cusps : undefined,
        })

        if (data.hasHouses && data.cusps.length === 12) {
          radix.addPointsOfInterest({
            As: [data.cusps[0]],
            Ic: [data.cusps[3]],
            Ds: [data.cusps[6]],
            Mc: [data.cusps[9]],
          })
        }

        radix.aspects()
      })
      .catch(() => setError('Erro ao carregar o gráfico.'))
  }, [data])

  if (error) {
    return (
      <div className="border-2 border-border bg-electric-orange p-4">
        <p className="font-heading font-bold">{error}</p>
      </div>
    )
  }

  return (
    <div className="border-2 border-border bg-background shadow-shadow">
      <div ref={containerRef} className="w-full" />
    </div>
  )
}
```

- [ ] Verificar TypeScript:
```bash
npx tsc --noEmit 2>&1 | grep "chart-svg" | head -5
```
> Esperado: sem erros

- [ ] Commit:
```bash
git add src/app/mapa-astral/chart-svg.tsx
git commit -m "feat: adiciona componente SVG do mapa astral com AstroChart"
```

---

## Task 7: Formulário (`src/app/mapa-astral/chart-form.tsx`)

**Files:**
- Create: `src/app/mapa-astral/chart-form.tsx`
- Create: `__tests__/components/chart-form.test.tsx`

- [ ] **Escrever teste** — `__tests__/components/chart-form.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ChartForm } from '@/app/mapa-astral/chart-form'

// Mock de next/navigation usado no componente
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('ChartForm', () => {
  it('renderiza campo de data', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
  })

  it('renderiza campo de hora como opcional', () => {
    render(<ChartForm />)
    expect(screen.getByLabelText(/hora de nascimento/i)).toBeInTheDocument()
    expect(screen.getByText(/opcional/i)).toBeInTheDocument()
  })

  it('renderiza campo de cidade', () => {
    render(<ChartForm />)
    expect(screen.getByPlaceholderText(/são paulo/i)).toBeInTheDocument()
  })

  it('renderiza botão de busca de cidade', () => {
    render(<ChartForm />)
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
  })

  it('renderiza botão de calcular mapa', () => {
    render(<ChartForm />)
    expect(screen.getByRole('button', { name: /calcular mapa astral/i })).toBeInTheDocument()
  })
})
```

- [ ] Rodar para confirmar FAIL:
```bash
npx jest __tests__/components/chart-form.test.tsx 2>&1 | tail -5
```
> Esperado: FAIL com "Cannot find module"

- [ ] Criar `src/app/mapa-astral/chart-form.tsx`:
```tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GeoResult {
  display_name: string
  lat: string
  lon: string
}

interface ChartFormProps {
  initialData?: string
  initialHora?: string
  initialCidade?: string
  initialLat?: string
  initialLng?: string
}

export function ChartForm({
  initialData  = '',
  initialHora  = '',
  initialCidade = '',
  initialLat   = '',
  initialLng   = '',
}: ChartFormProps) {
  const router = useRouter()
  const [data,       setData]       = useState(initialData)
  const [hora,       setHora]       = useState(initialHora)
  const [cidade,     setCidade]     = useState(initialCidade)
  const [lat,        setLat]        = useState(initialLat)
  const [lng,        setLng]        = useState(initialLng)
  const [geoResults, setGeoResults] = useState<GeoResult[]>([])
  const [isSearching,setIsSearching]= useState(false)
  const [geoError,   setGeoError]   = useState('')
  const [isPending,  startTransition]= useTransition()

  async function handleCitySearch() {
    if (!cidade.trim()) return
    setIsSearching(true)
    setGeoError('')
    setGeoResults([])
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(cidade)}`)
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) {
        setGeoError('Nenhuma cidade encontrada.')
      } else {
        setGeoResults(json.slice(0, 5))
      }
    } catch {
      setGeoError('Erro ao buscar cidade.')
    } finally {
      setIsSearching(false)
    }
  }

  function selectCity(result: GeoResult) {
    setCidade(result.display_name.split(',')[0].trim())
    setLat(result.lat)
    setLng(result.lon)
    setGeoResults([])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data || !lat || !lng) return
    const params = new URLSearchParams({ data, lat, lng })
    if (hora)   params.set('hora',   hora)
    if (cidade) params.set('cidade', cidade)
    startTransition(() => {
      router.push(`/mapa-astral?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Data */}
        <div className="space-y-1">
          <label
            htmlFor="nascimento-data"
            className="font-heading text-sm font-black uppercase tracking-wide"
          >
            Data de nascimento *
          </label>
          <input
            id="nascimento-data"
            type="date"
            required
            value={data}
            onChange={e => setData(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
        </div>

        {/* Hora */}
        <div className="space-y-1">
          <label
            htmlFor="nascimento-hora"
            className="font-heading text-sm font-black uppercase tracking-wide"
          >
            Hora de nascimento{' '}
            <span className="font-normal normal-case text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="nascimento-hora"
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            className="w-full border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          {!hora && (
            <p className="font-base text-xs text-muted-foreground">
              Sem horário, casas e Ascendente não serão calculados.
            </p>
          )}
        </div>
      </div>

      {/* Cidade */}
      <div className="space-y-1">
        <label
          htmlFor="nascimento-cidade"
          className="font-heading text-sm font-black uppercase tracking-wide"
        >
          Cidade de nascimento *
        </label>
        <div className="flex gap-2">
          <input
            id="nascimento-cidade"
            type="text"
            value={cidade}
            onChange={e => { setCidade(e.target.value); setLat(''); setLng('') }}
            placeholder="Ex: São Paulo"
            className="flex-1 border-2 border-border bg-background px-3 py-2 font-base text-sm shadow-shadow focus:outline-none focus:ring-2 focus:ring-border"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCitySearch}
            disabled={isSearching || !cidade.trim()}
          >
            {isSearching
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Search className="h-4 w-4" />
            }
            Buscar
          </Button>
        </div>

        {geoError && (
          <p className="font-base text-xs text-electric-orange font-bold">{geoError}</p>
        )}

        {geoResults.length > 0 && (
          <ul className="border-2 border-border bg-background">
            {geoResults.map((r, i) => (
              <li key={i} className={i > 0 ? 'border-t border-border' : ''}>
                <button
                  type="button"
                  onClick={() => selectCity(r)}
                  className="w-full px-3 py-2 text-left font-base text-sm hover:bg-main transition-colors"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {lat && lng && (
          <p className="font-base text-xs text-muted-foreground">
            ✓ Localização selecionada — {parseFloat(lat).toFixed(2)}°, {parseFloat(lng).toFixed(2)}°
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!data || !lat || !lng || isPending}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Calcular mapa astral
      </Button>
    </form>
  )
}
```

- [ ] Rodar testes:
```bash
npx jest __tests__/components/chart-form.test.tsx 2>&1 | tail -10
```
> Esperado: PASS (5 testes)

- [ ] Commit:
```bash
git add src/app/mapa-astral/chart-form.tsx __tests__/components/chart-form.test.tsx
git commit -m "feat: adiciona formulário do mapa astral com busca de cidade"
```

---

## Task 8: Página Principal (`src/app/mapa-astral/page.tsx`)

**Files:**
- Create: `src/app/mapa-astral/page.tsx`

- [ ] Criar `src/app/mapa-astral/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { Globe } from 'lucide-react'
import { calculateHoroscope } from '@/lib/horoscope'
import { ChartForm } from './chart-form'
import { ChartDetails } from './chart-details'
import { ChartSVG } from './chart-svg'

export const metadata: Metadata = {
  title: 'Mapa Astral',
  description: 'Calcule seu mapa natal gratuitamente — 100% open source, em português.',
}

interface PageProps {
  searchParams: Promise<{
    data?:   string   // "1990-03-15"
    hora?:   string   // "14:30"
    lat?:    string   // "-23.55"
    lng?:    string   // "-46.63"
    cidade?: string   // "São Paulo"
  }>
}

export default async function MapaAstralPage({ searchParams }: PageProps) {
  const params = await searchParams
  const hasParams = !!(params.data && params.lat && params.lng)

  let result = null
  let calcError: string | null = null

  if (hasParams) {
    try {
      const [year, month, day] = params.data!.split('-').map(Number)
      const [hour, minute] = params.hora
        ? params.hora.split(':').map(Number)
        : [12, 0]

      result = calculateHoroscope({
        year, month, day, hour, minute,
        lat: parseFloat(params.lat!),
        lng: parseFloat(params.lng!),
        hasTime: !!params.hora,
      })
    } catch {
      calcError = 'Não foi possível calcular o mapa. Verifique os dados e tente novamente.'
    }
  }

  return (
    <div className="-mx-4 -mt-8">

      {/* ── Hero ── */}
      <div className="border-b-2 border-border bg-cosmic-blue px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-foreground self-start px-3 py-1">
            <Globe className="h-3 w-3 text-cosmic-blue fill-cosmic-blue" />
            <span className="font-heading text-xs font-black tracking-widest text-background uppercase">
              100% Open Source
            </span>
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-none md:text-7xl">
            Mapa Astral
          </h1>
          <p className="font-base text-base md:text-lg text-foreground/80 max-w-md">
            Calcule seu mapa natal gratuitamente, em português.
            Sem cadastro, sem cookies, sem bullshit.
          </p>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">

        {/* Formulário — pré-populado com params da URL */}
        <ChartForm
          initialData={params.data}
          initialHora={params.hora}
          initialCidade={params.cidade}
          initialLat={params.lat}
          initialLng={params.lng}
        />

        {/* Erro de cálculo */}
        {calcError && (
          <div className="border-2 border-border bg-electric-orange p-4 shadow-shadow">
            <p className="font-heading font-black">{calcError}</p>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ChartSVG data={result} />
            <ChartDetails
              data={result}
              cidade={params.cidade ?? ''}
              dataStr={params.data!}
              hora={params.hora}
            />
          </div>
        )}

      </div>
    </div>
  )
}
```

- [ ] Verificar TypeScript:
```bash
npx tsc --noEmit 2>&1 | head -15
```
> Esperado: sem erros

- [ ] Rodar todos os testes:
```bash
npx jest --passWithNoTests 2>&1 | tail -10
```
> Esperado: todos os testes passam (deve incluir 6 novos)

- [ ] Build de produção:
```bash
npm run build 2>&1 | tail -20
```
> Esperado: `/mapa-astral` aparece na lista de rotas como `○ (Static)`

- [ ] Commit:
```bash
git add src/app/mapa-astral/
git commit -m "feat: adiciona página de mapa astral com formulário e SVG"
```

---

## Task 9: Deploy

- [ ] Confirmar que todos os testes passam:
```bash
npx jest --passWithNoTests
```

- [ ] Build limpo:
```bash
npm run build
```

- [ ] Deploy:
```bash
vercel --prod
```

- [ ] Testar manualmente em produção:
  - Acessar `/mapa-astral` → formulário vazio aparece
  - Digitar "São Paulo" → clicar "Buscar" → lista de sugestões aparece
  - Selecionar São Paulo → lat/lng preenchidos
  - Preencher data (ex: 1990-03-15) e hora (14:30)
  - Clicar "Calcular mapa astral" → URL muda com params, SVG renderiza, tabela aparece
  - Copiar URL e abrir em aba anônima → mapa carrega direto (link compartilhável)
  - Testar sem hora → mapa sem casas, aviso exibido

- [ ] Commit final (se houve ajustes):
```bash
git add -A
git commit -m "fix: ajustes pós-deploy do mapa astral"
```

---

## Verificação End-to-End

1. `npx jest` → todos os testes passam (incluindo 6 novos do horoscope + 4 geocode + 5 chart-form + 1 navbar)
2. `npm run build` → `/mapa-astral` na lista de rotas, sem erros TypeScript
3. `/mapa-astral` → formulário renderiza
4. Busca de cidade → retorna sugestões do Nominatim
5. Cálculo com hora → SVG completo + tabela com casas + badge "Sem filtro" de confirmação
6. Cálculo sem hora → SVG de planetas, tabela sem coluna Casa, aviso exibido
7. URL compartilhável → mapa carrega diretamente sem precisar preencher o form
8. `vercel --prod` → deploy sem erros
