import { getRenderUrl } from '@/lib/freepik-icon'
import { IconFormat } from '@/lib/freepik-icon'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string; format: string }> }
) {
  const { taskId, format } = await params

  if (!taskId) {
    return Response.json({ error: 'taskId é obrigatório' }, { status: 400 })
  }

  if (format !== 'png' && format !== 'svg') {
    return Response.json({ error: 'Format deve ser png ou svg' }, { status: 400 })
  }

  try {
    const renderUrl = getRenderUrl(taskId, format as IconFormat)

    const res = await fetch(renderUrl, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.FREEPIK_API_KEY ?? '',
      },
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      return Response.json({ error: 'Falha ao renderizar ícone' }, { status: 502 })
    }

    const contentType = format === 'svg' ? 'image/svg+xml' : 'image/png'
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('icons/render error:', err)
    return Response.json({ error: 'Erro interno' }, { status: 500 })
  }
}
