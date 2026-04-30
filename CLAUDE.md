# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
npm run dev          # http://localhost:3000
```

### Variáveis de ambiente

Ver `.env.example` para o template completo. Vars obrigatórias em `.env.local`:

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_BLOG_ID` | ID do blog no WISP CMS |
| `NEXT_PUBLIC_BASE_URL` | URL base da aplicação |
| `NEXT_PUBLIC_BLOG_DISPLAY_NAME` | Nome exibido no blog |
| `NEXT_PUBLIC_BLOG_DESCRIPTION` | Descrição para SEO |
| `OG_IMAGE_SECRET` | Segredo HMAC para URLs de OG image do Mapa Astral |
| `REVALIDATION_SECRET` | Segredo para revalidação on-demand |

---

## 2. Estrutura do projeto

```text
src/
  app/
    layout.tsx              ← Layout raiz: Navbar + Footer + fontes Google
    page.tsx                ← Home: últimos 6 posts do WISP
    globals.css             ← Tokens Tailwind v4 (@theme), animações
    global-error.tsx        ← Error boundary global (client component)
    robots.ts               ← Gera /robots.txt
    icon.png                ← Favicon (192×192)
    apple-icon.png          ← Apple touch icon (180×180)
    blog/
      page.tsx              ← Listagem paginada (?page=N) com error handling
      loading.tsx           ← Skeleton de loading para o blog
      [slug]/page.tsx       ← Post individual com ISR (revalidate=3600)
      sitemap.ts            ← /blog/sitemap.xml
    mapa-astral/
      page.tsx              ← Página do Mapa Astral (Server Component)
      loading.tsx           ← Skeleton de loading para o mapa astral
      chart-form.tsx        ← Formulário de entrada (Client Component)
      chart-svg.tsx         ← Roda zodiacal via @astrodraw/astrochart
      chart-svg-wrapper.tsx ← Wrapper client para o gráfico
      chart-details.tsx     ← Tabela de posições, aspectos, ASC/MC
      use-geocode.ts        ← Hook useGeocode() — busca de cidade via /api/geocode
    seu-dia/
      page.tsx              ← Página "Seu Dia" (Server Component)
      loading.tsx           ← Skeleton de loading para o Seu Dia
      date-form.tsx         ← Formulário de data (Client Component)
      day-results.tsx       ← Cards de eventos/nascimentos/mortes + ExactDaySection
      wiki-thumbnail.tsx    ← Client component: <Image> com fallback de erro (Wikipedia)
    contato/page.tsx        ← Link para https://x.com/Gayaliz_
    api/
      geocode/route.ts      ← GET /api/geocode?q=... (proxy Nominatim)
      og/route.tsx          ← GET /api/og — OG image do Mapa Astral (next/og + HMAC)
      og/site/route.tsx     ← GET /api/og/site — OG image genérica do site
      revalidate/route.ts   ← POST /api/revalidate (body: { secret })
    rss/route.ts            ← Feed RSS XML
  components/
    navbar.tsx              ← Header fundo #ccff00, hamburger menu mobile (client component)
    footer.tsx              ← Footer fundo preto, link @Gayaliz_
    blog-post-card.tsx      ← Card neobrutalism com sombra sólida + prop priority
    blog-post-content.tsx   ← HTML sanitizado do WISP
    blog-posts-pagination.tsx ← Prev/next com useSearchParams
    ui/
      button.tsx            ← Button neobrutalism (CVA)
      badge.tsx             ← Badge 4 variantes: default/blue/pink/orange
      card.tsx              ← Card neobrutalism (rounded-base, shadow-shadow, border-2)
      input.tsx             ← Input neobrutalism
      label.tsx             ← Label via Radix LabelPrimitive
  lib/
    utils.ts                ← cn() — tailwind-merge + clsx
    og-image.ts             ← signMapaAstralOgUrl() — gera URL OG com HMAC
    horoscope.ts            ← calculateHoroscope() — cálculos astrológicos
    horoscope-i18n.ts       ← Traduções pt-BR de planetas, signos, aspectos
    geocode-validation.ts   ← validateGeocodeQuery() + MAX_QUERY_LENGTH
  features/
    blog/
      client.ts             ← getWispClient() — singleton do buildWispClient
      service.ts            ← getAllBlogPosts, getBlogPostBySlug, getRecentBlogPosts (unstable_cache)
      index.ts              ← barrel
    mapa-astral/
      query.ts              ← parseMapaAstralParams() → ValidMapaAstralParams | empty | invalid
      service.ts            ← getMapaAstralResult() — chama calculateHoroscope()
      metadata.ts           ← buildMapaAstralMetadata(), verifyMapaAstralOgSignature()
      share.ts              ← buildMapaAstralShareMessages() — URLs Twitter/WhatsApp
      ui.ts                 ← createMapaAstralPageState() — monta estado da página
      index.ts              ← barrel
    og/
      assets.ts             ← ogAssets, getOgFontOptions() — carrega fonte TTF para OG images
    seu-dia/
      types.ts              ← WikiPage, WikiEvent, OnThisDayResult, ValidSeuDiaParams
      query.ts              ← parseSeuDiaParams() → { kind: 'empty'|'invalid'|'valid' }
      service.ts            ← fetchOnThisDay(month, day, birthYear?) — Wikipedia API, revalidate 86400
      index.ts              ← barrel
  config.ts                 ← Barrel: re-exporta todos os módulos de src/config/
  config/
    shared.ts               ← readTrimmedEnv() — utilitário base de leitura de env vars
    cms.ts                  ← cmsConfig — NEXT_PUBLIC_BLOG_ID
    integrations.ts         ← integrationsConfig — REVALIDATION_SECRET
    og.ts                   ← ogConfig — OG_IMAGE_SECRET
    site.ts                 ← siteConfig — nome, descrição, baseUrl
  assets/
    fonts/og-font.ttf       ← Fonte TTF usada nas OG images geradas server-side

__tests__/
  config.test.ts
  config-domains.test.ts
  utils.test.ts
  lib/horoscope.test.ts
  api/
    geocode.test.ts
    revalidate.test.ts
  features/
    blog-service.test.ts
    mapa-astral-query.test.ts
    mapa-astral-service.test.ts
    mapa-astral-share.test.ts
    seu-dia-query.test.ts
  components/
    navbar.test.tsx
    footer.test.tsx
    blog-post-card.test.tsx
    chart-form.test.tsx
    day-results.test.tsx
    ui/button.test.tsx
    ui/badge.test.tsx

e2e/
  home.spec.ts
  blog.spec.ts
  mapa-astral.spec.ts
  seu-dia.spec.ts           ← usa datas âncora determinísticas (ex: 1969-07-20)
```

### Dependências-chave

| Pacote | Papel |
| --- | --- |
| `@wisp-cms/client` | Fetch de posts do CMS (instanciado via `features/blog/client.ts`) |
| `circular-natal-horoscope-js` | Cálculos astrológicos |
| `@astrodraw/astrochart` | Renderização da roda zodiacal em SVG |
| `date-fns` | Formatação de datas em pt-BR |
| `sanitize-html` | Sanitiza HTML dos posts |
| `rss` | Gera feed RSS |
| `lucide-react` | Ícones (Menu, X na Navbar; outros) |
| `@playwright/test` | Testes E2E (suíte `e2e/`) |

---

## 3. Fluxo de trabalho de desenvolvimento

### Comandos principais

```bash
npm run dev           # servidor local em http://localhost:3000
npm run build         # build de produção
npm run start         # serve o build local
npm run lint          # ESLint
npm run lint:fix      # ESLint com auto-fix
npm run knip          # detecta exports/imports não utilizados
npm run test          # Jest (unit + component)
npm run test:e2e      # Playwright E2E
npm run test:e2e:ui   # Playwright modo interativo
npm run deploy        # vercel --prod (deploy direto para produção)
```

### Stack de rendering

```text
Server Components (padrão) → dados do WISP, cálculos astrológicos, Wikipedia API
Client Components ('use client') → chart-form, chart-svg, blog-posts-pagination, date-form, wiki-thumbnail
```

### Mapa Astral — fluxo de dados

```text
URL: /mapa-astral?data=1990-03-15&hora=14:30&lat=-23.55&lng=-46.63&cidade=São Paulo
         ↓
page.tsx (Server) → parseMapaAstralParams() → ValidMapaAstralParams
         ↓
getMapaAstralResult() → calculateHoroscope() → HoroscopeResult
         ↓
ChartSVGWrapper  → @astrodraw/astrochart (useEffect no cliente)
ChartDetails     → tabela de posições + ASC/MC + aspectos
share.ts         → buildMapaAstralShareMessages() → URLs Twitter/WhatsApp
```

O `use-geocode.ts` (`mapa-astral/use-geocode.ts`) é um hook client-side que chama
`/api/geocode` para converter nome de cidade em lat/lng no formulário.

### Navbar — hamburger menu mobile

A Navbar (`src/components/navbar.tsx`) é um **Client Component** (`'use client'`) que usa:
- `usePathname()` para indicar rota ativa
- `useState` para abrir/fechar o menu mobile
- Ícones `Menu` e `X` do Lucide para o botão hamburger

Links de navegação: Blog, Mapa Astral, Seu Dia, Contato. A `navigation-menu.tsx` do Radix foi removida — substituída por implementação customizada simples.

### Loading skeletons

Cada rota principal tem um `loading.tsx` do Next.js App Router que exibe skeleton em neobrutalism durante o carregamento:
- `src/app/blog/loading.tsx` — grid de cards com `animate-pulse`
- `src/app/mapa-astral/loading.tsx` — skeleton do formulário e seção hero
- `src/app/seu-dia/loading.tsx` — skeleton do formulário e seção hero

O `global-error.tsx` captura erros de nível de layout com botão "Tentar novamente".

### Tema neobrutalism

O sistema visual oficial é **NeoBrutalismo**.

- Fonte de verdade: `DESIGN.md` (raiz do projeto) e `docs/design/neobrutalism-system.md`
- Base local: `src/app/globals.css`
- Context7 library ID: `/ekmas/neobrutalism-components`

Princípios não negociáveis:

- `border-2 border-border` como linguagem padrão
- `shadow-shadow` com sombra dura deslocada, não sombra suave
- contraste alto entre `background`, `foreground`, `main` e `border`
- `radius-base` contido, sem arredondamento excessivo
- componentes com presença física e leitura direta
- hierarquia visual pode evoluir, mas sem abandonar o caráter neobrutalist

### OG Images

Dois endpoints de OG image gerados server-side com `next/og`:
- `/api/og` — OG image do Mapa Astral (personalizda por usuário, assinada com HMAC)
- `/api/og/site` — OG image genérica do site

A fonte TTF (`src/assets/fonts/og-font.ttf`) é carregada via `features/og/assets.ts` usando `fs` (server-only).
A URL do `/api/og` é assinada com `OG_IMAGE_SECRET` via `lib/og-image.ts` para evitar geração não autorizada.

### Seu Dia — fluxo de dados

```text
URL: /seu-dia?data=1990-04-22
         ↓
page.tsx (Server) → parseSeuDiaParams(searchParams) → ValidSeuDiaParams | 'invalid' | 'empty'
         ↓
fetchOnThisDay(month, day, birthYear) → OnThisDayResult
  { events[], births[], deaths[], exactDayEvents[] }  ← revalidate: 86400
         ↓
DayResults → ExactDaySection (bg-foreground invertido, só exibe se exactDayEvents.length > 0)
           → Section('events') / Section('births') / Section('deaths')
           → WikiThumbnail (client component com fallback de erro)
```

**Importante:** A API da Wikipedia é chamada server-side (`next: { revalidate: 86400 }`).
`page.route()` do Playwright não intercepta essas requisições — os testes E2E usam a API real
com datas âncora determinísticas (ex: `1969-07-20` = pouso lunar).

**DOM da ExactDaySection:** dois elementos separados — `<p>Aconteceu neste dia</p>` e `<h3>em {year}</h3>`.
Não existe texto unificado "Neste dia, em 1969" em nenhum elemento.

### ISR e publicação de posts

Posts novos no WISP aparecem automaticamente em até 1h
(ISR `revalidate=3600`). Para aparecer imediatamente:

```bash
curl -X POST https://psicologaemoutradimensao.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"SEU_REVALIDATION_SECRET"}'
```

---

## 4. Abordagem de teste

### Testes unitários / componentes (Jest)

Ficam em `__tests__/` usando Jest + React Testing Library.
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
| `config-domains.test.ts` | Configs individuais: cms, og, site, integrations |
| `horoscope.test.ts` | Posições válidas; signos pt-BR; ASC/MC com hora |
| `api/geocode.test.ts` | validateGeocodeQuery() + rota GET /api/geocode |
| `features/mapa-astral-*.test.ts` | parseMapaAstralParams, getMapaAstralResult, buildMapaAstralShareMessages |
| `features/seu-dia-query.test.ts` | parseSeuDiaParams() |
| `features/blog-service.test.ts` | Funções do blog service |
| `button.test.tsx` | Classe `bg-main`, `border-2`, disabled state |
| `badge.test.tsx` | Classe `bg-cosmic-blue` no variant blue |
| `chart-form.test.tsx` | Campos, submit, navegação e busca de cidade |
| `blog-post-card.test.tsx` | Título, descrição, link `/blog/[slug]`, tag |
| `day-results.test.tsx` | DayResults e ExactDaySection |

### Testes E2E (Playwright)

Ficam em `e2e/`. Requerem servidor rodando (`npm run dev` ou build+start).

```bash
npm run test:e2e                 # rodar todos os testes E2E
npx playwright test e2e/seu-dia  # rodar só o arquivo seu-dia.spec.ts
npm run test:e2e:ui              # modo interativo
npx playwright test --headed     # browser visível
```

**Limitação crítica:** `page.route()` só intercepta requisições do browser.
Chamadas feitas em Server Components (fetch server-side) **não podem ser mockadas**.
Os testes que dependem de dados da API usam datas âncora determinísticas:
- `1990-04-22` → data genérica com dados garantidos na Wikipedia
- `1969-07-20` → pouso lunar (Apollo 11) para testar ExactDaySection

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

### OG image retorna 403

A rota `/api/og` valida a assinatura HMAC da URL. Se o `OG_IMAGE_SECRET` mudou ou
a URL foi construída sem `signMapaAstralOgUrl()`, a requisição é rejeitada.

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

### Imports não utilizados / dead code

```bash
npm run knip       # lista exports e imports não usados no projeto
```

---

## 6. Próximas Melhorias Planejadas

### Melhorias no "Seu Dia" (spec: `docs/superpowers/specs/2026-04-23-seu-dia-melhorias-design.md`)

Plan em: `docs/superpowers/plans/2026-04-23-seu-dia-melhorias.md`

**Status:** Não iniciado. Todas as tasks estão pendentes.

Três features planejadas:

1. **Filtros por categoria** (`FilterTabs`) — segmented control client-side para filtrar entre Todos / Meu Ano / Eventos / Nascimentos / Mortes.
2. **Botão de compartilhar** (`ShareBar`) — copiar link (`navigator.clipboard`) e download de card PNG (`html-to-image`).
3. **Animações** — shimmer skeleton (`SkeletonCard`), stagger reveal melhorado, confetti com `canvas-confetti` quando `exactDayEvents.length > 0`.

**Dependências a instalar antes de implementar:**
```bash
npm install html-to-image canvas-confetti
npm install -D @types/canvas-confetti
```

**Novos arquivos:**
- `src/components/ui/seu-dia/filter-tabs.tsx`
- `src/components/ui/seu-dia/share-bar.tsx`
- `src/components/ui/seu-dia/confetti-trigger.tsx`
- `src/components/ui/seu-dia/skeleton-card.tsx`
- `src/components/ui/seu-dia/share-card.tsx`

**Arquivo a modificar:** `src/app/seu-dia/day-results.tsx` → virar Client Component com `useState` para filtro + `useRef` para PNG.
