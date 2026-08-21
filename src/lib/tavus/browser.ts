import type { CreateConversationResponse } from '@/lib/tavus/types'

type TavusAction = 'create' | 'end'

export async function createTavusConversation(params?: {
  conversationalContext?: string
}): Promise<CreateConversationResponse> {
  const response = await fetch('/api/tavus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create' satisfies TavusAction,
      conversationalContext: params?.conversationalContext,
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
  const response = await fetch('/api/tavus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'end' satisfies TavusAction,
      conversationId,
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null
    throw new Error(payload?.error || 'Failed to end conversation')
  }
}
