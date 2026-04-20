# Blog Design Spec — PsicologaEmOutraDimensão

**Data:** 2026-04-20
**Status:** Referência ativa

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 App Router |
| UI Layer | React 19 |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | neobrutalism-components (shadcn/ui skin, copy-paste) |
| CMS | WISP CMS (`@wisp-cms/client`) |
| Deploy | Vercel CLI |

---

## Tipografia

| Uso | Fonte |
|-----|-------|
| Headings (h1–h4) | Space Grotesk |
| Body / UI | Inter |

Ambas carregadas via `next/font/google`.

---

## Paleta de Cores

```css
--color-main:           #CCFF00;  /* neon yellow — cor primária */
--color-cosmic-blue:    #4DB8FF;
--color-vibrant-pink:   #FF99CC;
--color-electric-orange:#FF6600;
--color-background:     #FFFFFF;
--color-foreground:     #000000;
--color-border:         #000000;
```

### Uso das cores

- `--color-main` (`#CCFF00`): CTAs, destaques, hover states, bordas de card em foco
- `--color-cosmic-blue`: elementos secundários, tags, acentos
- `--color-vibrant-pink`: acentos decorativos, ilustrações
- `--color-electric-orange`: alertas, badges
- `--color-background` / `--color-foreground`: base da página (branco/preto puro)
- `--color-border`: bordas neobrutalist (pretas, 2px solid)

### Estética neobrutalist

- Bordas: `2px solid #000000`
- Box shadow: `4px 4px 0px #000000`
- Sem border-radius arredondado (0px ou 2px máximo)
- Hover: deslocamento de shadow (`translate + shadow shrink`)

---

## Páginas

### `/` — Home

- Hero com headline impactante + CTA para `/blog`
- Preview dos últimos 3 posts (cards neobrutalist)
- Link para contato no footer

### `/blog` — Listagem

- Grid de cards de posts (título, data, excerpt)
- Paginação via WISP cursor
- Sem filtro por tag

### `/blog/[slug]` — Post individual

- Renderização ISR
- `export const revalidate = 3600` (1 hora)
- Conteúdo HTML do WISP sanitizado e renderizado
- Sem seção de comentários

### `/contato` — Contato

- Página simples com link externo para X (Twitter): https://x.com/Gayaliz_
- Sem formulário de contato

---

## Integração WISP CMS

- Pacote: `@wisp-cms/client`
- Dados buscados server-side em Server Components
- Posts listados via `wisp.getPosts()`
- Post individual via `wisp.getPost(slug)`
- Campos usados: `title`, `slug`, `publishedAt`, `excerpt`, `content`, `image`

---

## Revalidação (ISR)

```ts
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1 hora
```

### On-demand revalidation

Endpoint: `GET /api/revalidate?secret=<REVALIDATION_SECRET>`

- Valida o `secret` contra `process.env.REVALIDATION_SECRET`
- Chama `revalidatePath('/blog')` e `revalidatePath('/blog/[slug]', 'page')`
- Retorna `{ revalidated: true }` em sucesso

---

## Deploy

- Plataforma: Vercel
- CLI: `vercel` (instalado globalmente via npm)
- Branch de produção: `main`
- Preview: automático em PRs

### Variáveis de ambiente (Vercel)

| Variável | Descrição |
|----------|-----------|
| `WISP_BLOG_ID` | ID do blog no WISP CMS |
| `REVALIDATION_SECRET` | Secret para on-demand revalidation |

---

## Decisões explícitas — o que NÃO existe

- Sem dark mode
- Sem página "Sobre"
- Sem seção de comentários
- Sem sistema de tags / filtros
- Sem disclaimers de qualquer tipo
- Sem newsletter / formulário de captura
- Sem analytics client-side (pode ser adicionado depois via Vercel Analytics)
