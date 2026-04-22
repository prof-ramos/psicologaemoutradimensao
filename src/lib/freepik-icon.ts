import { integrationsConfig } from '@/config/integrations'

const FREEPIK_BASE_URL = 'https://api.freepik.com/v1/ai/text-to-icon'

type IconStyle = 'solid' | 'outline' | 'color' | 'flat' | 'sticker'
export type IconFormat = 'png' | 'svg'

interface GenerateIconParams {
  prompt: string
  style?: IconStyle
  format?: IconFormat
  num_inference_steps?: number
  guidance_scale?: number
}

interface GenerateIconResponse {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    url: string
    format: IconFormat
  }
  error?: string
}

interface PreviewIconResponse {
  task_id: string
  preview_url: string
}

function getApiKey(): string {
  const key = integrationsConfig.freepikApiKey
  if (!key) throw new Error('Freepik API key (integrationsConfig.freepikApiKey) is not set')
  return key
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': getApiKey(),
  }
}

export async function generateIcon(params: GenerateIconParams): Promise<GenerateIconResponse> {
  const res = await fetch(FREEPIK_BASE_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      prompt: params.prompt,
      style: params.style ?? 'solid',
      format: params.format ?? 'png',
      num_inference_steps: params.num_inference_steps ?? 10,
      guidance_scale: params.guidance_scale ?? 7,
      webhook_url: integrationsConfig.freepikWebhookUrl,
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const error = await res.text().catch(() => 'Unknown error')
    throw new Error(`Freepik API error (${res.status}): ${error}`)
  }

  return res.json() as Promise<GenerateIconResponse>
}

export async function previewIcon(params: Omit<GenerateIconParams, 'num_inference_steps' | 'guidance_scale'>): Promise<PreviewIconResponse> {
  const res = await fetch(`${FREEPIK_BASE_URL}/preview`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      prompt: params.prompt,
      style: params.style ?? 'solid',
      format: params.format ?? 'png',
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    const error = await res.text().catch(() => 'Unknown error')
    throw new Error(`Freepik preview error (${res.status}): ${error}`)
  }

  return res.json() as Promise<PreviewIconResponse>
}

export function getRenderUrl(taskId: string, format: IconFormat): string {
  return `${FREEPIK_BASE_URL}/${taskId}/render/${format}`
}
