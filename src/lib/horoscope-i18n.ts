/** Mapa body.key (lowercase) → nome em pt-BR */
export const PLANET_PT: Record<string, string> = {
  sun:       'Sol',
  moon:      'Lua',
  mercury:   'Mercúrio',
  venus:     'Vênus',
  mars:      'Marte',
  jupiter:   'Júpiter',
  saturn:    'Saturno',
  uranus:    'Urano',
  neptune:   'Netuno',
  pluto:     'Plutão',
  chiron:    'Quíron',
  northnode: 'Nodo Norte',
  southnode: 'Nodo Sul',
  lilith:    'Lilith',
}

/** Sign.label (English, Title Case) → nome em pt-BR */
export const SIGN_PT: Record<string, string> = {
  Aries:       'Áries',
  Taurus:      'Touro',
  Gemini:      'Gêmeos',
  Cancer:      'Câncer',
  Leo:         'Leão',
  Virgo:       'Virgem',
  Libra:       'Libra',
  Scorpio:     'Escorpião',
  Sagittarius: 'Sagitário',
  Capricorn:   'Capricórnio',
  Aquarius:    'Aquário',
  Pisces:      'Peixes',
}

/** aspect.aspectKey (lowercase) → nome em pt-BR */
export const ASPECT_PT: Record<string, string> = {
  conjunction: 'Conjunção',
  opposition:  'Oposição',
  trine:       'Trígono',
  square:      'Quadratura',
  sextile:     'Sextil',
  quincunx:    'Quincúncio',
}

/**
 * Converte body.key (lowercase) para chave do AstroChart.
 * Regra geral: capitaliza primeira letra. Exceções: northnode → NNode.
 */
export function toAstroChartKey(key: string): string {
  const exceptions: Record<string, string> = {
    northnode: 'NNode',
    southnode: 'SNode',
  }
  return exceptions[key] ?? (key.charAt(0).toUpperCase() + key.slice(1))
}
