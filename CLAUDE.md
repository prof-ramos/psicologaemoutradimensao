# CLAUDE.md — psicologaemoutradimensao

Blog pessoal Next.js 16 + React 19. Código real em `.worktrees/feat-blog/` — ver CLAUDE.md lá para contexto completo.

## Comandos reais

```bash
npm run dev      # Next.js + Turbopack em localhost:3000
npm run build    # build de produção
npm run start    # servidor de produção
npm test         # Jest + React Testing Library
npx jest --watch # modo watch
```

## Configuração de ambiente

```bash
vercel env pull .env.local   # puxa vars da Vercel (necessário antes do primeiro dev)
```

Vars obrigatórias: `NEXT_PUBLIC_BLOG_ID`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BLOG_DISPLAY_NAME`, `NEXT_PUBLIC_BLOG_DESCRIPTION`, `OG_IMAGE_SECRET`, `REVALIDATION_SECRET`

## Stack real

- **Next.js 16.2.4** (App Router), **React 19**, **TypeScript 5**, **Tailwind v4**
- **WISP CMS** — fonte dos posts do blog
- **Jest** + **React Testing Library** — testes em `__tests__/`
- **Vercel** — deploy (`vercel --prod`)
- Sem ESLint, Prettier ou Husky instalados

## Gotchas

- O código fica em `.worktrees/feat-blog/` (git worktree) — editar lá, não na raiz
- `npm run lint`, `npm run typecheck`, `npm run format` **não existem**
- ISR de 1h nos posts; revalidação manual: `GET /api/revalidate?secret=REVALIDATION_SECRET`
- `@astrodraw/astrochart` exige DOM — só funciona com `'use client'`
