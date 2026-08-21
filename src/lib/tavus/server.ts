import { TAVUS_API_BASE } from '@/config/tavus'
import type {
  CreateConversationRequest,
  CreateConversationResponse,
  CreatePalRequest,
  CreatePalResponse,
} from '@/lib/tavus/types'

function getApiKey(): string {
  const apiKey = process.env.TAVUS_API_KEY
  if (!apiKey) {
    throw new Error('TAVUS_API_KEY is not configured')
  }
  return apiKey
}

async function tavusFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${TAVUS_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
      ...init.headers,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Tavus API ${path} failed (${response.status}): ${details}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function createPal(
  body: CreatePalRequest,
): Promise<CreatePalResponse> {
  return tavusFetch<CreatePalResponse>('/v2/pals', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function createConversation(
  body: CreateConversationRequest,
): Promise<CreateConversationResponse> {
  return tavusFetch<CreateConversationResponse>('/v2/conversations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function endConversation(conversationId: string): Promise<void> {
  const id = conversationId.trim()
  if (!id) {
    throw new Error('conversation_id is required')
  }

  await tavusFetch<undefined>(`/v2/conversations/${encodeURIComponent(id)}/end`, {
    method: 'POST',
  })
}
