import { DEFAULT_CONVERSATION_NAME, MAX_CONTEXT_CHARS } from '@/config/tavus'
import type { CreateConversationRequest } from '@/lib/tavus/types'

export type ConversationInput = {
  palId?: string
  faceId?: string
  conversationName?: string
  conversationalContext?: string
  customGreeting?: string
  testMode?: boolean
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

/**
 * Builds POST /v2/conversations.
 * Matches the API Conversation Quickstart when only pal_id is set:
 * `{ pal_id, conversation_name }`.
 */
export function buildCreateConversationBody(
  input: ConversationInput,
): CreateConversationRequest {
  const palId = input.palId?.trim()
  const faceId = input.faceId?.trim()

  if (!palId && !faceId) {
    throw new Error('Provide pal_id, face_id, or both')
  }

  const body: CreateConversationRequest = {
    conversation_name: input.conversationName?.trim() || DEFAULT_CONVERSATION_NAME,
  }

  if (palId) {
    body.pal_id = palId
  }

  if (faceId) {
    body.face_id = faceId
  }

  if (input.testMode) {
    body.test_mode = true
  }

  const greeting = input.customGreeting?.trim()
  if (greeting) {
    body.custom_greeting = greeting
  }

  const context = sanitizeContext(input.conversationalContext)
  if (context) {
    body.conversational_context = context
  }

  return body
}
