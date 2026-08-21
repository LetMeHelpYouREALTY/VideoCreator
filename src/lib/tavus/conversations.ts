import {
  DEFAULT_CONVERSATION_NAME,
  DEFAULT_CUSTOM_GREETING,
  MAX_CONTEXT_CHARS,
  STOCK_ANNA_FACE_ID,
} from '@/config/tavus'
import type { CreateConversationRequest } from '@/lib/tavus/types'

export type ConversationInput = {
  palId: string
  faceId?: string
  conversationName?: string
  conversationalContext?: string
  customGreeting?: string
}

export function sanitizeContext(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.slice(0, MAX_CONTEXT_CHARS)
}

export function buildCreateConversationBody(
  input: ConversationInput,
): CreateConversationRequest {
  const palId = input.palId.trim()
  if (!palId) {
    throw new Error('pal_id is required')
  }

  const body: CreateConversationRequest = {
    pal_id: palId,
    face_id: input.faceId?.trim() || STOCK_ANNA_FACE_ID,
    conversation_name: input.conversationName?.trim() || DEFAULT_CONVERSATION_NAME,
    custom_greeting: input.customGreeting?.trim() || DEFAULT_CUSTOM_GREETING,
    properties: {
      language: 'english',
      max_call_duration: 900,
      participant_left_timeout: 30,
      participant_absent_timeout: 60,
    },
  }

  const context = sanitizeContext(input.conversationalContext)
  if (context) {
    body.conversational_context = context
  }

  return body
}
