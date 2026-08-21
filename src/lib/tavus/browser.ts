import type { CreateConversationResponse } from '@/lib/tavus/types'

export async function createTavusConversation(params?: {
  palId?: string
  conversationName?: string
  conversationalContext?: string
  testMode?: boolean
}): Promise<CreateConversationResponse> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(params?.palId ? { pal_id: params.palId } : {}),
      conversation_name: params?.conversationName,
      ...(params?.testMode ? { test_mode: true } : {}),
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null
    throw new Error(payload?.error || 'Failed to start conversation')
  }

  return (await response.json()) as CreateConversationResponse
}

export async function endTavusConversation(conversationId: string): Promise<void> {
  const response = await fetch(`/api/conversations/${conversationId}/end`, {
    method: 'POST',
  })

  if (!response.ok && response.status !== 204) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null
    throw new Error(payload?.error || 'Failed to end conversation')
  }
}
