import { describe, expect, it } from 'vitest'
import { MAX_CONTEXT_CHARS } from '@/config/tavus'
import {
  buildCreateConversationBody,
  sanitizeContext,
} from '@/lib/tavus/conversations'

describe('buildCreateConversationBody', () => {
  it('requires pal_id or face_id', () => {
    expect(() => buildCreateConversationBody({ palId: '   ' })).toThrow(
      'Provide pal_id, face_id, or both',
    )
  })

  it('matches the API Conversation Quickstart pal_id-only body', () => {
    const body = buildCreateConversationBody({
      palId: '<your_pal_id>',
      conversationName: 'Interview User',
    })
    expect(body).toEqual({
      pal_id: '<your_pal_id>',
      conversation_name: 'Interview User',
    })
    expect(Object.keys(body)).toEqual(['pal_id', 'conversation_name'])
  })

  it('includes face_id only when provided', () => {
    const body = buildCreateConversationBody({
      palId: 'p_test',
      faceId: 'r90bbd427f71',
    })
    expect(body.face_id).toBe('r90bbd427f71')
  })

  it('allows face_id without a PAL', () => {
    const body = buildCreateConversationBody({ faceId: 'r90bbd427f71' })
    expect(body.pal_id).toBeUndefined()
    expect(body.face_id).toBe('r90bbd427f71')
  })

  it('sets test_mode for integration wiring', () => {
    const body = buildCreateConversationBody({
      palId: 'p_test',
      testMode: true,
    })
    expect(body.test_mode).toBe(true)
  })

  it('trims optional listing context and drops empty strings', () => {
    expect(sanitizeContext('  ')).toBeUndefined()
    const long = 'a'.repeat(MAX_CONTEXT_CHARS + 50)
    expect(sanitizeContext(long)?.length).toBe(MAX_CONTEXT_CHARS)

    const body = buildCreateConversationBody({
      palId: 'p_test',
      conversationalContext: '  123 Main St, 3 bed, 2 bath, 1840 sq ft  ',
    })
    expect(body.conversational_context).toBe(
      '123 Main St, 3 bed, 2 bath, 1840 sq ft',
    )
  })
})
