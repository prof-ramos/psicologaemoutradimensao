/**
 * Freepik AI Icon Generation API Utility
 * Documentation: https://docs.freepik.com/api-reference/icon-generation
 */

import { config } from '@/config'

const FREEPIK_API_BASE = 'https://api.freepik.com/v1/ai/text-to-icon'

export type IconStyle = 'solid' | 'outline' | 'color' | 'flat' | 'sticker'
export type IconFormat = 'png' | 'svg'

interface GenerateIconParams {
  prompt: string
  webhookUrl?: string
  style?: IconStyle
  format?: IconFormat
  numInferenceSteps?: number
  guidanceScale?: number
}

interface FreepikTaskResponse {
  task_id: string
}

export async function generateIcon(params: GenerateIconParams): Promise<FreepikTaskResponse> {
  const apiKey = process.env.FREEPIK_API_KEY
  if (!apiKey) {
    throw new Error('FREEPIK_API_KEY is not defined')
  }

  const response = await fetch(FREEPIK_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-freepik-api-key': apiKey,
    },
    body: JSON.stringify({
      prompt: params.prompt,
      webhook_url: params.webhookUrl ?? 'https://example.com/webhook', // placeholder
      style: params.style ?? 'flat',
      format: params.format ?? 'svg',
      num_inference_steps: params.numInferenceSteps ?? 20,
      guidance_scale: params.guidanceScale ?? 7,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Freepik API Error: ${response.status} ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * Note: Since the API is asynchronous, we would normally need a webhook or a polling mechanism
 * to get the result. For static icons, we can generate them once and save them.
 */
