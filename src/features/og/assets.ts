import fs from 'fs'

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer
}

function readFileBuffer(fileUrl: URL): Buffer | undefined {
  try {
    return fs.readFileSync(fileUrl)
  } catch {
    return undefined
  }
}

function readDataUri(fileUrl: URL, mime: string): string {
  const buffer = readFileBuffer(fileUrl)
  if (!buffer) return ''
  return `data:${mime};base64,${buffer.toString('base64')}`
}

const fontBuffer = readFileBuffer(new URL('../../assets/fonts/og-font.ttf', import.meta.url))

export const ogAssets = {
  fontName: fontBuffer ? 'Geist' : 'sans-serif',
  fontData: fontBuffer ? toArrayBuffer(fontBuffer) : undefined,
  mysticSrc: readDataUri(new URL('../../../public/mystic.png', import.meta.url), 'image/png'),
}

export function getOgFontOptions() {
  if (!ogAssets.fontData) return {}
  return {
    fonts: [{ name: 'Geist', data: ogAssets.fontData, weight: 400 as const, style: 'normal' as const }],
  }
}
