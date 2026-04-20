import { generateIcon, previewIcon } from '@/lib/freepik-icon'

const ICON_STYLES = ['solid', 'outline', 'color', 'flat', 'sticker'] as const
const ICON_FORMATS = ['png', 'svg'] as const

export async function POST(request: Request) {
  const body = await request.json()
  const { prompt, style, format, num_inference_steps, guidance_scale, preview } = body

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return Response.json({ error: 'Prompt é obrigatório' }, { status: 400 })
  }

  if (prompt.length > 500) {
    return Response.json({ error: 'Prompt muito longo (máx 500 chars)' }, { status: 400 })
  }

  if (style && !ICON_STYLES.includes(style as (typeof ICON_STYLES)[number])) {
    return Response.json({ error: `Style inválido. Opções: ${ICON_STYLES.join(', ')}` }, { status: 400 })
  }

  if (format && !ICON_FORMATS.includes(format as (typeof ICON_FORMATS)[number])) {
    return Response.json({ error: `Format inválido. Opções: ${ICON_FORMATS.join(', ')}` }, { status: 400 })
  }

  try {
    if (preview) {
      const result = await previewIcon({
        prompt: prompt.trim(),
        style: style ?? 'solid',
        format: format ?? 'png',
      })
      return Response.json(result)
    }

    const result = await generateIcon({
      prompt: prompt.trim(),
      style: style ?? 'solid',
      format: format ?? 'png',
      num_inference_steps,
      guidance_scale,
    })
    return Response.json(result)
  } catch (err) {
    console.error('icons/generate error:', err)
    return Response.json({ error: 'Erro ao gerar ícone' }, { status: 500 })
  }
}
