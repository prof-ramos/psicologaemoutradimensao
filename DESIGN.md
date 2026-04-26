---
version: alpha
name: PsicologaEmOutraDimensao NeoBrutalismo
description: Identidade visual neobrutalist para o site PsicologaEmOutraDimensao, com contraste alto, presença física e acentos astrais.
colors:
  primary: "#ccff00"
  primary-foreground: "#000000"
  background: "#ffffff"
  surface: "#ffffff"
  foreground: "#000000"
  border: "#000000"
  overlay: "#000000"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  cosmic-blue: "#4db8ff"
  vibrant-pink: "#ff99cc"
  electric-orange: "#ff6600"
  chart-1: "#7a83ff"
  chart-2: "#facc00"
  chart-3: "#ff4d50"
  chart-4: "#00d696"
  chart-5: "#0099ff"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.02em
  headline:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  title:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0em
  label:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0em
rounded:
  base: 10px
  sm: 6px
  none: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 80px
  max-content: 1152px
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  rule-line:
    backgroundColor: "{colors.border}"
    height: 2px
  muted-panel:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: 16px
  metadata:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
  overlay:
    backgroundColor: "{colors.overlay}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 12px
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 12px
    height: 40px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.base}"
    padding: 24px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.base}"
    padding: 12px
    height: 40px
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 8px
  badge-cosmic:
    backgroundColor: "{colors.cosmic-blue}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 8px
  badge-birth:
    backgroundColor: "{colors.vibrant-pink}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 8px
  badge-energy:
    backgroundColor: "{colors.electric-orange}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: 8px
  chart-series-1:
    backgroundColor: "{colors.chart-1}"
  chart-series-2:
    backgroundColor: "{colors.chart-2}"
  chart-series-3:
    backgroundColor: "{colors.chart-3}"
  chart-series-4:
    backgroundColor: "{colors.chart-4}"
  chart-series-5:
    backgroundColor: "{colors.chart-5}"
---

# PsicologaEmOutraDimensao Design System

## Overview

O site usa NeoBrutalismo como linguagem oficial: direto, físico, contrastado e um pouco cósmico. A experiência deve parecer construída com blocos sólidos, bordas pretas, sombra dura e cores astrais pontuais, sem perder clareza para leitura, formulários e navegação.

O tom visual combina presença editorial forte com utilidade prática. A psicologia e a astrologia aparecem por meio de contraste, ritmo, cor e nomes de seções, não por superfícies etéreas, glassmorphism ou ilustrações decorativas frágeis.

## Colors

- **Primary (#ccff00):** verde-lima elétrico para CTAs, navegação ativa e destaques de máxima prioridade.
- **Foreground / Border (#000000):** texto, contorno e sombra. O preto é estrutural, não apenas decorativo.
- **Background / Surface (#ffffff):** base clara e direta para preservar contraste e legibilidade.
- **Cosmic Blue (#4db8ff):** destaque secundário para conteúdo astral, badges e variações de card.
- **Vibrant Pink (#ff99cc):** acento afetivo para seções de nascimento, contraste e momentos de descoberta.
- **Electric Orange (#ff6600):** acento quente para chamadas, detalhes energéticos e estados de ênfase.
- **Muted (#f5f5f5):** áreas auxiliares e fundos discretos, sempre com borda preta quando virarem componente.

## Typography

Headings usam **Space Grotesk** com peso alto, escala forte e ritmo compacto. A voz deve ser segura, expressiva e frontal.

Texto corrido usa **Inter** com peso base 500 e `line-height` confortável. Labels e comandos podem usar Space Grotesk para manter a sensação geométrica dos componentes.

Não use tracking negativo além do padrão já definido para headings. Botões, badges e labels devem caber nos seus containers sem compressão visual.

## Layout

Layouts devem priorizar escaneabilidade: seções em faixas amplas, conteúdo centralizado com largura máxima aproximada de 1152px e grids simples que não escondam a informação principal.

Cards são usados para itens repetidos, formulários, resultados, chamadas específicas e blocos que precisam de contorno físico. Não coloque cards dentro de cards como padrão.

## Elevation & Depth

Profundidade vem de **sombra dura deslocada**, não de blur. A sombra canônica é equivalente a `-2px 4px 0px 0px #000000`.

Estados interativos devem parecer físicos: hover pode mover ou inverter levemente a sombra; active pode pressionar o elemento. Evite fades suaves como único feedback.

## Shapes

O raio padrão é `10px`. Esse arredondamento deve suavizar a interface sem transformar botões e cards em pílulas fofas. Elementos utilitários podem usar `6px`; divisórias estruturais podem permanecer retas.

## Components

- **Button:** use o primitive local baseado em `neobrutalism.dev`, com `border-2`, `rounded-base`, `shadow-shadow` e variantes físicas.
- **Badge:** use backgrounds sólidos e texto em alto contraste; não use chips translúcidos.
- **Input / Label:** formulários devem ter bordas pretas, labels fortes e áreas de toque claras.
- **Card:** use `bg-secondary-background`, `border-2 border-border`, `rounded-base` e `shadow-shadow`.
- **NavigationMenu:** navegação desktop deve usar o primitive local; mobile pode usar painel simples desde que preserve o mesmo contraste.
- **Results / Tables:** listas de dados devem parecer peças sólidas, com separação clara entre conteúdo, metadata e ações.

## Do's and Don'ts

Do:

- Preserve bordas pretas explícitas.
- Use `primary`, `cosmic-blue`, `vibrant-pink` e `electric-orange` como acentos fortes.
- Mantenha cards, botões e inputs com presença física.
- Prefira hierarquia por escala, contraste, borda e sombra dura.

Don't:

- Não substitua o sistema por glassmorphism, tons pastel lavados ou minimalismo SaaS genérico.
- Não use sombras difusas, blur ou transparência como linguagem principal.
- Não arredonde demais componentes estruturais.
- Não adicione texto explicativo em UI para justificar o design; a interface deve se explicar pelo próprio uso.
