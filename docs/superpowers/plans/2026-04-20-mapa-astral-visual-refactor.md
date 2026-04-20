# Mapa Astral Visual Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refinar a página `/mapa-astral` para ter hierarquia visual mais clara, melhor uso de espaço e uma UI mais coesa sem alterar a proposta direta do produto.

**Architecture:** A refatoração fica concentrada na rota `src/app/mapa-astral`, com pequenos ajustes em componentes compartilhados de navegação, rodapé e primitives de UI para alinhar o sistema visual. O cálculo astrológico, o fluxo de URL e a estrutura funcional da página permanecem intactos; mudamos somente composição, tokens visuais e apresentação dos dados.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Jest + React Testing Library

---

## File Map

| Arquivo | Responsabilidade |
| --- | --- |
| `src/app/mapa-astral/page.tsx` | Reorganizar hero, container principal e composição da área de resultados |
| `src/app/mapa-astral/chart-form.tsx` | Transformar o formulário em um bloco único e consistente |
| `src/app/mapa-astral/chart-details.tsx` | Refinar cards, tabela e badges de aspectos |
| `src/app/mapa-astral/chart-svg.tsx` | Dar mais protagonismo visual ao gráfico |
| `src/app/globals.css` | Definir tokens visuais e ritmo mais consistente |
| `src/components/navbar.tsx` | Fortalecer o header sem deixá-lo pesado |
| `src/components/footer.tsx` | Melhorar acabamento e legibilidade do rodapé |
| `src/components/ui/button.tsx` | Adicionar variante de CTA mais refinada |
| `src/components/ui/badge.tsx` | Adicionar variantes de badge mais controladas |
| `__tests__/components/*.test.tsx` | Ajustar expectativas do sistema visual compartilhado quando necessário |

## Task 1: Estrutura da página e hero

**Files:**
- Modify: `src/app/mapa-astral/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Reestruturar hero e container principal**
- [ ] **Step 2: Criar ritmo de espaçamento mais consistente**
- [ ] **Step 3: Distribuir melhor a seção de resultados em telas grandes**

## Task 2: Formulário e CTA

**Files:**
- Modify: `src/app/mapa-astral/chart-form.tsx`
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Transformar inputs, labels e busca de cidade em um card único**
- [ ] **Step 2: Refinar o CTA principal com variante visual menos agressiva**
- [ ] **Step 3: Melhorar alinhamento e estados interativos**

## Task 3: Resultados, tabela e badges

**Files:**
- Modify: `src/app/mapa-astral/chart-details.tsx`
- Modify: `src/app/mapa-astral/chart-svg.tsx`
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 1: Dar protagonismo visual ao gráfico**
- [ ] **Step 2: Organizar resumo, tabela e aspectos em cards consistentes**
- [ ] **Step 3: Reduzir saturação e ruído visual dos badges**

## Task 4: Header, footer e testes

**Files:**
- Modify: `src/components/navbar.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `__tests__/components/navbar.test.tsx`
- Modify: `__tests__/components/footer.test.tsx`
- Modify: `__tests__/components/ui/button.test.tsx`
- Modify: `__tests__/components/ui/badge.test.tsx`

- [ ] **Step 1: Refinar header e footer para fechar o sistema visual**
- [ ] **Step 2: Atualizar testes afetados**
- [ ] **Step 3: Rodar suíte seletiva para validar a refatoração**
