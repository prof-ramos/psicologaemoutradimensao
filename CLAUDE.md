@AGENTS.md

# PsicologaEmOutraDimensão

Blog pessoal. Pseudônimo — sem disclaimers de qualquer tipo.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4 + neobrutalism-components (copy-paste shadcn/ui)
- @wisp-cms/client para posts (Blog ID: `14fdf534-3ce0-40c5-84be-9dfbb290cda2`)
- Deploy: Vercel CLI (`vercel --prod`)

## Comandos

- `npm run dev` — desenvolvimento local
- `vercel env pull .env.local` — puxar env vars da Vercel (só vars development)
- `npx jest` — rodar testes
- `npm run build` — build local
- `vercel --prod` — deploy para produção

## Variáveis de ambiente

Ver `.env.example`. Vars adicionadas na Vercel (production):
- `NEXT_PUBLIC_BLOG_ID`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_BLOG_DISPLAY_NAME`
- `NEXT_PUBLIC_BLOG_DESCRIPTION`
- `OG_IMAGE_SECRET`
- `REVALIDATION_SECRET`

## URLs

- Produção: https://psicologaemoutradimensao.vercel.app
- Dashboard Vercel: https://vercel.com/gabriel-ramos-projects-c715690c/psicologaemoutradimensao

## Revalidação on-demand

```
GET /api/revalidate?secret=REVALIDATION_SECRET
```

Revalida todo o layout. Use após publicar posts no WISP (ISR cobre em até 1h automaticamente).
