# PsicologaEmOutraDimensão

Blog pessoal de psicologia, astrologia e acontecimentos históricos — publicado sob pseudônimo.

[![Next.js][Next.js]][Next-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![Tailwind CSS][Tailwind]][Tailwind-url]
[![Deployed on Vercel][Vercel]][Vercel-url]

---

## Sobre

Site pessoal com quatro seções principais:

- **Blog** — posts publicados via WISP CMS, com ISR de 1 hora
- **Mapa Astral** — calcula e renderiza a roda zodiacal natal a partir de data, hora e cidade de nascimento
- **Seu Dia** — busca eventos históricos, nascimentos e mortes ocorridos na data de nascimento (Wikipedia pt-BR)
- **Contato** — link direto para [@Gayaliz_](https://x.com/Gayaliz_) no X

---

## Construído com

[![Next.js][Next.js]][Next-url]
[![React][React.js]][React-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![Tailwind CSS][Tailwind]][Tailwind-url]
[![Vercel][Vercel]][Vercel-url]

| Pacote | Função |
|---|---|
| `@wisp-cms/client` | Fetch e ISR de posts |
| `circular-natal-horoscope-js` | Cálculos astrológicos |
| `@astrodraw/astrochart` | Renderização SVG da roda zodiacal |
| `date-fns` | Formatação de datas em pt-BR |
| `sanitize-html` | Sanitização do HTML dos posts |

**Design System:** [NeoBrutalismo](docs/design/neobrutalism-system.md) — bordas explícitas, sombra dura deslocada, contraste alto.

---

## Primeiros passos

### Pré-requisitos

- Node.js 20+
- npm 10+
- Vercel CLI — `npm i -g vercel`
- Conta Vercel vinculada ao projeto

### Instalação

```bash
# 1. Clonar o repositório
git clone <repo> psicologaemoutradimensao
cd psicologaemoutradimensao

# 2. Instalar dependências
npm install

# 3. Puxar variáveis de ambiente da Vercel
vercel link
vercel env pull .env.local

# 4. Rodar localmente
npm run dev   # http://localhost:3000
```

### Variáveis de ambiente

Veja `.env.example` para o template completo. Variáveis obrigatórias em `.env.local`:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_BLOG_ID` | ID do blog no WISP CMS |
| `NEXT_PUBLIC_BASE_URL` | URL base da aplicação |
| `NEXT_PUBLIC_BLOG_DISPLAY_NAME` | Nome exibido no blog |
| `NEXT_PUBLIC_BLOG_DESCRIPTION` | Descrição para SEO |
| `OG_IMAGE_SECRET` | Segredo HMAC para URLs de OG image |
| `REVALIDATION_SECRET` | Segredo para revalidação on-demand |

---

## Testes

```bash
# Unitários e componentes (Jest)
npx jest

# E2E (Playwright) — requer servidor rodando
npx playwright test
```

---

## Deploy

```bash
vercel --prod
```

Para forçar revalidação do cache após publicar um post:

```bash
curl -X POST https://psicologaemoutradimensao.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"SEU_REVALIDATION_SECRET"}'
```

---

## Design System

O projeto adota **NeoBrutalismo** como linguagem visual oficial.

- Referência canônica: [`docs/design/neobrutalism-system.md`](docs/design/neobrutalism-system.md)
- Base local: `src/app/globals.css`
- Context7 library ID: `/ekmas/neobrutalism-components`

Princípios não negociáveis:

- `border-2 border-border` como linguagem padrão
- `shadow-shadow` — sombra dura deslocada, nunca sombra suave
- Contraste alto entre `background`, `foreground`, `main` e `border`
- `radius-base` contido, sem arredondamento excessivo

---

<!-- Badge definitions -->
[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
