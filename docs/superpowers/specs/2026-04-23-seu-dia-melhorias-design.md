---
title: Melhorias "Seu Dia" — Design Spec
date: 2026-04-23
status: draft
scope: features/seu-dia, src/app/seu-dia
---

# Melhorias no "Seu Dia" — Design Spec

> **Entrega:** Opção B (agrupada) — Filtros + Compartilhar + Animações em um único plano.

## Contexto

O "Seu Dia" é uma página que, dada uma data de nascimento, consulta a Wikipedia pt-BR ("On This Day") e mostra:
- Eventos que aconteceram naquele dia (geral)
- Eventos que aconteceram no dia e ano exatos
- Nascimentos famosos nesse dia
- Mortes famosas nesse dia

As melhorias visam aumentar usabilidade, viralidade e percepção de qualidade.

---

## Feature 1: Filtros por Categoria

### Overview

Segmented control NeoBrutalista que permite filtrar quais seções de resultado são exibidas. O filtro é puramente client-side — os dados já vêm carregados do servidor.

### Estados

| Filtro | O que mostra |
|--------|-------------|
| `todos` (padrão) | Todas as 4 seções |
| `meu-ano` | Apenas `ExactDaySection` (eventos do dia + ano exato) |
| `eventos` | `ExactDaySection` + `Section(events)` |
| `nascimentos` | `Section(births)` |
| `mortes` | `Section(deaths)` |

### UI

- Local: dentro de `DayResults`, logo abaixo do título "Resultados para".
- Componente: `FilterTabs`.
- Estilo: botões em linha, `border-2 border-border`, sombra dura (`shadow-shadow`).
- Estado ativo: `bg-main text-main-foreground`.
- Estado inativo: `bg-background text-foreground hover:bg-muted`.
- Mobile: `flex-wrap` para quebrar linha se necessário.

### Data Flow

```
FilterTabs (client state: activeFilter: FilterKind)
  │
  ▼
DayResults recebe activeFilter como prop
  │
  ├── se activeFilter === 'todos'      → renderiza todas as seções
  ├── se activeFilter === 'meu-ano'      → renderiza apenas ExactDaySection
  ├── se activeFilter === 'eventos'      → renderiza ExactDaySection + Section(events)
  ├── se activeFilter === 'nascimentos'  → renderiza Section(births)
  └── se activeFilter === 'mortes'       → renderiza Section(deaths)
```

A lógica de filtro é uma simples condição antes de renderizar cada `Section`. Não altera os dados, apenas a visibilidade.

### Tipos

```ts
export type FilterKind = 'todos' | 'meu-ano' | 'eventos' | 'nascimentos' | 'mortes'
```

---

## Feature 2: Botão de Compartilhar

### Overview

Dois modos de compartilhamento acessíveis via botão no header dos resultados.

### Modo 1: Copiar Link

- Gera a URL atual com os search params já presentes.
- Tenta `navigator.share()` se disponível (mobile).
- Fallback: copia para clipboard via `navigator.clipboard.writeText()`.
- Feedback visual: toast/badge "Link copiado!".

### Modo 2: Download PNG (Card Visual)

- Gera um card visual NeoBrutalista estático em PNG.
- Implementação: client-side com `html-to-image` (lib leve, ~15KB gzipped).
- Elemento alvo: div escondida no DOM (`display: none`) ou montada dinamicamente, com estilos inline.
- Conteúdo do card:
  - Label: "Seu Dia — {DD/MM/AAAA}"
  - Headline: "{N} eventos históricos" + subheadline com contagens
  - URL do site
  - Fundo: `bg-cosmic-blue` (#4DB8FF), texto branco/preto, borda preta.

### UI

- Local: ao lado do título "Resultados para" no `DayResults`.
- Componente: `ShareBar`.
- Botão primário: "Compartilhar" com ícone `Share2` do Lucide.
- Ao clicar: abre menu/dropdown com "Copiar link" e "Baixar PNG".

### Estado de share

```ts
interface ShareState {
  kind: 'idle' | 'sharing' | 'copied' | 'downloading' | 'error'
  message?: string
}
```

### Segurança / Privacidade

- O card PNG não contém dados pessoais além da data inserida pelo próprio usuário.
- Não faz upload para servidor — geração 100% client-side.

---

## Feature 3: Animações & Micro-interações

### 3.1 Skeleton Loading

**Quando mostrar:**
- Durante o submit do `DateForm` (entre clicar "Descobrir Meu Dia" e a navegação completar).
- Na primeira renderização dos resultados (server está carregando).

**Implementação:**
- Componente `SkeletonCard` reutilizável.
- 3 linhas horizontias animadas (shimmer) dentro de um card com borda.
- Cores: `bg-muted` com gradiente de `bg-muted` → `bg-border` → `bg-muted` via `animate-shimmer`.
- Tailwind custom animation: `animation: shimmer 1.5s infinite`.

**Layout de skeleton:**
- 3 skeleton cards empilhados, repetindo o grid real (`grid-cols-1 sm:grid-cols-2`).
- Para cada seção, mostra 2 skeletons (para não quebrar layout).

### 3.2 Stagger Reveal

**O que é:** Os cards já têm `animate-card-enter` com `animationDelay`. Vamos:
- Aumentar o delay de `55ms` para `75ms` para efeito mais dramático.
- Melhorar o easing de `ease-out` para `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) para maior "punch".
- Adicionar um leve `translateY(12px)` → `translateY(0)` no keyframe para sensação de "subida".

### 3.3 Confetti Celebration

**Quando disparar:**
- Após os resultados carregarem e `exactDayEvents.length > 0`.
- Dispara uma vez por sessão de resultados (usa ref para evitar múltiplos disparos se o usuário filtrar).

**Implementação:**
- Lib: `canvas-confetti` (~3KB gzip, zero deps).
- Origem: canto superior esquerdo (ou central, dependendo do mockup final).
- Cores: `#CCFF00` (main), `#FF6B2C` (orange), `#4DB8FF` (cosmic-blue), `#fff` (white).
- Quantidade: 60 partículas, duração 2s, gravidade 1.2.

---

## Arquitetura Geral

### File Map (novos + modificados)

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/components/ui/seu-dia/filter-tabs.tsx` | Create | Segmented control de filtros |
| `src/components/ui/seu-dia/share-bar.tsx` | Create | Botão + menu de compartilhamento |
| `src/components/ui/seu-dia/skeleton-card.tsx` | Create | Card shimmer placeholder |
| `src/components/ui/seu-dia/confetti-trigger.tsx` | Create | Wrapper que dispara confetti na condição |
| `src/app/seu-dia/day-results.tsx` | Modify | Integra FilterTabs, ShareBar, confetti |
| `src/app/seu-dia/date-form.tsx` | Modify | Mostra skeleton ou loading state aprimorado |
| `src/app/seu-dia/page.tsx` | Modify | (talvez) ajusta skeleton durante RSC loading |
| `src/app/globals.css` | Modify | Adiciona keyframes `shimmer` e `card-enter-v2` |

### Data Flow Completo

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────────┐
│  DateForm   │────▶│  Page (RSC) │────▶│   fetchOnThisDay()      │
│  - submit   │     │  - parse    │     │   (Wikipedia API)       │
└─────────────┘     │  - fetch    │     └─────────────────────────┘
                    └─────────────┘              │
                         │                       │
                         ▼                       ▼
                    ┌────────────────────────────────────────────┐
                    │           DayResults (client)              │
                    │  ┌─────────────┐  ┌─────────────────────┐ │
                    │  │ FilterTabs  │  │    ShareBar         │ │
                    │  │ (filtro     │  │  - copiar link      │ │
                    │  │  client)    │  │  - download PNG     │ │
                    │  └──────┬──────┘  └─────────────────────┘ │
                    │         │                                  │
                    │  ┌──────▼────────┐                        │
                    │  │ ExactDaySection │ (condicional)         │
                    │  │ Section(events) │ (condicional)         │
                    │  │ Section(births) │ (condicional)         │
                    │  │ Section(deaths) │ (condicional)         │
                    │  └─────────────────┘                        │
                    │                                             │
                    │  ┌────────────────────────┐                 │
                    │  │ ConfettiTrigger          │                 │
                    │  │ (exactDayEvents > 0)     │                 │
                    │  └────────────────────────┘                 │
                    └──────────────────────────────────────────────┘
```

### Estado Client

```ts
// FilterTabs
const [activeFilter, setActiveFilter] = useState<FilterKind>('todos')

// ConfettiTrigger
const hasFiredRef = useRef(false)  // garante 1 disparo por montagem
```

---

## Design System (NeoBrutalismo)

**Novo token CSS (se necessário):**

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes card-enter-v2 {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Classes Tailwind:**
- Skeleton: `bg-gradient-to-r from-muted via-border to-muted bg-[length:200%_100%] animate-shimmer`
- Stagger: `animate-card-enter-v2` com `animation-delay` inline via style.

---

## Testes

### Unitários

- `FilterTabs`: clique em cada filtro chama `onFilterChange` com valor correto.
- `ShareBar`: "Copiar link" chama `navigator.clipboard.writeText` com URL esperada.
- `SkeletonCard`: renderiza container com classe de animação `shimmer`.
- `ConfettiTrigger`: dispara `confetti` apenas quando `exactDayEvents.length > 0` e apenas 1 vez.

### E2E (Playwright)

- Usuário seleciona uma data → skeleton aparece → resultados aparecem → filtra por "Meu Ano" → apenas seção exact-day fica visível.
- Botão "Compartilhar" → menu abre → "Copiar link" → toast "Link copiado!" aparece.

---

## Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `html-to-image` | ^1.x | Geração PNG client-side |
| `canvas-confetti` | ^1.x | Efeito de confetti |

Instalação:
```bash
npm install html-to-image canvas-confetti
npm install -D @types/canvas-confetti
```

> Nota: `html-to-image` é puramente client-side (DOM manipulation). Não há risco de SSR issues se usado dentro de `useEffect` ou event handlers.

---

## Rollout / Backwards Compatibility

- Todas as melhorias são adições puras — não alteram APIs, rotas, ou lógica existente.
- O estado de filtro não precisa ser persistido na URL (opcional futuro).
- Se `html-to-image` falhar, o fallback é o modo "Copiar link", que sempre funciona.
- Se `canvas-confetti` não carregar, a experiência fica funcional sem animação.

---

## Performance

- `html-to-image` roda apenas no evento de clique — não no critical path.
- `canvas-confetti` usa Canvas 2D, GPU-accelerated. Limpa automaticamente após 2s.
- Skeletons são CSS puro — zero JS overhead.
- Stagger reveal usa CSS transitions — não bloqueia main thread.
