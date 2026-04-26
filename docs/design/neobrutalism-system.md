# NeoBrutalism Design System

Este projeto usa **NeoBrutalismo como sistema visual oficial**. Ajustes de layout, hero, formulário, tabela, cards, header, footer e componentes compartilhados devem **preservar essa direção** em vez de migrar para uma linguagem editorial suave, glassmorphism, minimalismo lavado ou superfícies luxuosas.

## Fonte de verdade

- Fonte de verdade para agentes: `DESIGN.md`
- Base local obrigatória: `src/app/globals.css`
- Referência de componentes: `neobrutalism.dev`
- Referência externa consultiva: `https://context7.com/websites/neobrutalism_dev/llms.txt?tokens=21933`
- Context7 library ID: `/websites/neobrutalism_dev`
- Formato persistente de design system: `https://github.com/google-labs-code/design.md`

`DESIGN.md` descreve a identidade visual em um formato legível por agentes e validável por CLI. O CSS em `src/app/globals.css` continua sendo a implementação runtime; quando ambos divergirem, atualize os dois na mesma mudança.

## Tokens canônicos

O trecho abaixo documenta os **tokens canônicos** que devem guiar futuras alterações. Quando houver divergência entre uma refatoração visual e estes tokens, **os tokens vencem**.

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(92.13% 0.0388 282.36);
  --secondary-background: oklch(100% 0 0);
  --foreground: oklch(0% 0 0);
  --main-foreground: oklch(0% 0 0);
  --main: oklch(66.34% 0.1806 277.2);
  --border: oklch(0% 0 0);
  --ring: oklch(0% 0 0);
  --overlay: oklch(0% 0 0 / 0.8);
  --shadow: -2px 4px 0px 0px var(--border);
  --chart-1: #7A83FF;
  --chart-2: #FACC00;
  --chart-3: #FF4D50;
  --chart-4: #00D696;
  --chart-5: #0099FF;
  --chart-active-dot: #000;
}

.dark {
  --background: oklch(26.58% 0.0737 283.96);
  --secondary-background: oklch(23.93% 0 0);
  --foreground: oklch(92.49% 0 0);
  --main-foreground: oklch(0% 0 0);
  --main: oklch(66.34% 0.1806 277.2);
  --border: oklch(0% 0 0);
  --ring: oklch(100% 0 0);
  --shadow: -2px 4px 0px 0px var(--border);
  --chart-1: #7A83FF;
  --chart-2: #E0B700;
  --chart-3: #FF6669;
  --chart-4: #00BD84;
  --chart-5: #008AE5;
  --chart-active-dot: #fff;
}

@theme inline {
  --color-main: var(--main);
  --color-background: var(--background);
  --color-secondary-background: var(--secondary-background);
  --color-foreground: var(--foreground);
  --color-main-foreground: var(--main-foreground);
  --color-border: var(--border);
  --color-overlay: var(--overlay);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --spacing-boxShadowX: -2px;
  --spacing-boxShadowY: 4px;
  --spacing-reverseBoxShadowX: -2px;
  --spacing-reverseBoxShadowY: -4px;
  --radius-base: 10px;
  --shadow-shadow: var(--shadow);
  --font-weight-base: 500;
  --font-weight-heading: 700;
}
  
@layer base {
  body {
    @apply text-foreground font-base bg-background;
  }

  h1, h2, h3, h4, h5, h6{
    @apply font-heading;
  }
}
```

## Regras visuais obrigatórias

- **Bordas pretas e explícitas**: use `border-2 border-border` como linguagem padrão dos blocos.
- **Sombra dura deslocada**: use `shadow-shadow`, não sombras difusas ou realistas.
- **Raio contido**: preserve `--radius-base: 10px`; não arredonde excessivamente cards, botões e inputs.
- **Contraste alto**: foreground preto, borda preta, destaque forte em `--main`.
- **Superfície secundária clara**: use `secondary-background` para contraste interno, sem estética “glass”.
- **Estados interativos físicos**: hover e active devem sugerir deslocamento, pressão ou inversão de sombra, não apenas fade suave.
- **Tipografia firme**: headings com peso alto, leitura direta, sem visual “luxury editorial”.
- **Componentes com presença**: cards, badges, botões e tabelas devem parecer objetos sólidos.

## O que evitar

- Sombras suaves, amplas ou atmosféricas
- Bordas sem contraste
- Interfaces “clean SaaS” ou “soft minimal”
- Containers com blur/transparência como linguagem principal
- Gradientes delicados como base de identidade
- Chips excessivamente suaves ou dessaturados
- CTAs com aparência premium/luxuosa em vez de direta e física

## Uso do `neobrutalism.dev`

A referência `neobrutalism.dev` deve ser tratada como **guia de implementação de primitives e padrões visuais** para:

- `Button`
- `Badge`
- `Input`
- `Textarea`
- `Table`
- `NavigationMenu` / navegação
- `Alert`
- `Chart` e tokens de gráfico

Pelos exemplos e snippets indexados no Context7/`llms.txt`, a linguagem recorrente inclui:

- `rounded-base`
- `border-2 border-border`
- `bg-main` ou `bg-secondary-background`
- `text-main-foreground`
- `shadow-shadow`
- combinações utilitárias de contraste alto, preenchimento sólido e presença física

## Regra para futuras refatorações

Se uma refatoração visual:

1. melhora a hierarquia, mas
2. enfraquece bordas, sombra dura, contraste ou presença física,

então ela **não está alinhada** ao sistema visual do projeto e deve ser revista.

Hierarquia visual, espaçamento e legibilidade são bem-vindos, desde que a execução continue claramente **NeoBrutalist**.
