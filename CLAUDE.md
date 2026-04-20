# PsicologaEmOutraDimensão — Guia do Desenvolvedor

Blog pessoal. Pseudônimo — sem disclaimers de qualquer tipo.

---

## 1. Configuração

### Pré-requisitos

- Node.js 20+
- npm 10+
- Next.js 16 (App Router)
- Vercel CLI (`npm i -g vercel`)
- Conta Vercel vinculada ao projeto

### Primeira vez

```bash
# 1. Clonar e entrar no projeto
git clone <repo> psicologaemoutradimensao
cd psicologaemoutradimensao

# 2. Instalar dependências
npm install

# 3. Puxar variáveis de ambiente da Vercel
vercel link          # vincula ao projeto existente
vercel env pull .env.local

# 4. Rodar localmente
npm run dev          # http://localhost:3000 com Turbopack
```

### Variáveis de ambiente

Ver `.env.example` para o template completo. Vars obrigatórias em `.env.local`:

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_BLOG_ID` | ID do blog no WISP CMS |
| `NEXT_PUBLIC_BASE_URL` | URL base da aplicação |
| `NEXT_PUBLIC_BLOG_DISPLAY_NAME` | Nome exibido no blog |
| `NEXT_PUBLIC_BLOG_DESCRIPTION` | Descrição para SEO |
| `OG_IMAGE_SECRET` | Segredo HMAC para URLs de OG image |
| `REVALIDATION_SECRET` | Segredo para revalidação on-demand |

---

## 2. Estrutura do projeto

```text
src/
  app/
    layout.tsx              ← Layout raiz: Navbar + Footer + fontes Google
    page.tsx                ← Home: últimos 6 posts do WISP
    globals.css             ← Tokens Tailwind v4 (@theme), animações
    icon.png                ← Favicon (192×192)
    apple-icon.png          ← Apple touch icon (180×180)
    blog/
      page.tsx              ← Listagem paginada (?page=N)
      [slug]/page.tsx       ← Post individual com ISR (revalidate=3600)
      sitemap.ts            ← /blog/sitemap.xml
    mapa-astral/
      page.tsx              ← Página do Mapa Astral (Server Component)
      chart-form.tsx        ← Formulário de entrada (Client Component)
      chart-svg.tsx         ← Roda zodiacal via @astrodraw/astrochart
      chart-svg-wrapper.tsx ← Wrapper client para o gráfico
      chart-details.tsx     ← Tabela de posições, aspectos, ASC/MC
    contato/page.tsx        ← Link para https://x.com/Gayaliz_
    api/
      geocode/route.ts      ← GET /api/geocode?q=... (proxy Nominatim)
      revalidate/route.ts   ← POST /api/revalidate (body: { secret })
    rss/route.ts            ← Feed RSS XML
  components/
    navbar.tsx              ← Header fundo #ccff00, links Blog + Contato
    footer.tsx              ← Footer fundo preto, link @Gayaliz_
    blog-post-card.tsx      ← Card neobrutalism com sombra sólida
    blog-post-content.tsx   ← HTML sanitizado do WISP
    blog-posts-pagination.tsx ← Prev/next com useSearchParams
    ui/
      button.tsx            ← Button neobrutalism (CVA)
      badge.tsx             ← Badge 4 variantes: default/blue/pink/orange
  lib/
    wisp.ts                 ← Instância do buildWispClient
    utils.ts                ← cn() — tailwind-merge + clsx
    og-image.ts             ← Gera URL de OG image com HMAC
    horoscope.ts            ← calculateHoroscope() — cálculos astrológicos
    horoscope-i18n.ts       ← Traduções pt-BR de planetas, signos, aspectos
  config.ts                 ← Lê e valida env vars; exporta config tipada

__tests__/
  config.test.ts
  utils.test.ts
  lib/horoscope.test.ts
  api/revalidate.test.ts
  components/
    navbar.test.tsx
    footer.test.tsx
    blog-post-card.test.tsx
    blog-posts-pagination.test.tsx  (se existir)
    ui/button.test.tsx
    ui/badge.test.tsx
    chart-form.test.tsx
```

### Dependências-chave

| Pacote | Papel |
| --- | --- |
| `@wisp-cms/client` | Fetch de posts do CMS |
| `circular-natal-horoscope-js` | Cálculos astrológicos |
| `@astrodraw/astrochart` | Renderização da roda zodiacal em SVG |
| `date-fns` | Formatação de datas em pt-BR |
| `sanitize-html` | Sanitiza HTML dos posts |
| `rss` | Gera feed RSS |

---

## 3. Fluxo de trabalho de desenvolvimento

### Stack de rendering

```text
Server Components (padrão) → dados do WISP, cálculos astrológicos
Client Components ('use client') → chart-form, chart-svg, blog-posts-pagination
```

A página do Mapa Astral (`/mapa-astral`) é Server Component:
lê `searchParams`, chama `calculateHoroscope()` e passa os dados já
calculados para os Client Components.

### Mapa Astral — fluxo de dados

```text
URL: /mapa-astral?data=1990-03-15&hora=14:30&lat=-23.55&lng=-46.63&cidade=São Paulo
         ↓
page.tsx (Server) → calculateHoroscope(input) → HoroscopeResult
         ↓
ChartSVGWrapper  → @astrodraw/astrochart (useEffect no cliente)
ChartDetails     → tabela de posições + ASC/MC + aspectos
```

### Tema neobrutalism

Definido em `globals.css` via `@theme`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-main` | `#ccff00` | Navbar, botões, planetas no gráfico |
| `--color-cosmic-blue` | `#4db8ff` | Badge blue, label ASC |
| `--color-vibrant-pink` | `#ff99cc` | Badge pink, label MC |
| `--color-electric-orange` | `#ff6600` | Badge orange |
| `--shadow-shadow` | `0.25rem 0.25rem 0 0 #000` | Sombra sólida dos cards |

### ISR e publicação de posts

Posts novos no WISP aparecem automaticamente em até 1h
(ISR `revalidate=3600`). Para aparecer imediatamente:

```bash
curl -X POST https://psicologaemoutradimensao.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"SEU_REVALIDATION_SECRET"}'
```

### Deploy

```bash
vercel --prod     # deploy direto para produção
```

---

## 4. Abordagem de teste

Todos os testes ficam em `__tests__/` usando Jest + React Testing Library.
Configuração em `jest.config.ts` (raiz do projeto) usando `nextJest`.

```bash
npx jest                      # rodar todos
npx jest --watch              # modo watch
npx jest __tests__/lib/       # rodar só testes da lib
npx jest --no-coverage        # mais rápido, sem relatório de cobertura
```

### Convenções

- **Unitários puros** (`config.test.ts`, `utils.test.ts`, `horoscope.test.ts`):
  sem mocks, testam lógica real
- **Componentes** (`*.test.tsx`): `render()` + `screen.getBy*` + `expect(...).toBeInTheDocument()`
- **`global.fetch`**: salvar/restaurar via
  `const orig = (global as any).fetch` /
  `afterEach(() => { (global as any).fetch = orig })`
- **Mocks de rota**:
  `jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))`

### O que cada camada testa

| Arquivo | O que verifica |
| --- | --- |
| `config.test.ts` | Falha com env var ausente; retorna config correta |
| `horoscope.test.ts` | Posições válidas; signos pt-BR; ASC/MC com hora |
| `button.test.tsx` | Classe `bg-main`, `border-2`, disabled state |
| `badge.test.tsx` | Classe `bg-cosmic-blue` no variant blue |
| `chart-form.test.tsx` | Campos, submit, navegação e busca de cidade |
| `blog-post-card.test.tsx` | Título, descrição, link `/blog/[slug]`, tag |

---

## 5. Solução de problemas comuns

### `NEXT_PUBLIC_BLOG_ID is missing`

```bash
vercel env pull .env.local   # recria o .env.local com vars da Vercel
```

### Posts não aparecem em produção

1. Verificar se o WISP Blog ID está correto (`14fdf534-3ce0-40c5-84be-9dfbb290cda2`)
2. Revalidar manualmente: `POST /api/revalidate` com body `{"secret":"REVALIDATION_SECRET"}`
3. Checar logs: `vercel logs https://psicologaemoutradimensao.vercel.app`

### Gráfico do Mapa Astral não renderiza

O `@astrodraw/astrochart` exige DOM — só funciona no cliente. Causas comuns:

- Componente não marcado como `'use client'`
- `useEffect` não disparando (checar se `ref.current` é não-nulo)
- Dados com `cusps` vazio quando `hasTime=false` → já tratado com equal-house fallback

### Hydration mismatch no SVG

Coordenadas floating-point divergem entre server e client. Solução:
usar `.toFixed(1)` em todos os valores numéricos usados como atributos SVG.

### Testes falhando por `fetch` undefined

```ts
const orig = (global as any).fetch
afterEach(() => { (global as any).fetch = orig })
// dentro do teste:
;(global as any).fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => [...],
})
```

### Build falhando com TypeScript

```bash
npx tsc --noEmit   # checar erros sem gerar output
npm run build      # build completo
```

---

## URLs

- Produção: <https://psicologaemoutradimensao.vercel.app>
- Dashboard Vercel (privado)
- WISP CMS: <https://wisp.blog>
