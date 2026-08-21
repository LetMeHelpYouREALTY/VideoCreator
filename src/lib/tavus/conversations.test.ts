import { describe, expect, it } from 'vitest'
import {
  STOCK_ANNA_FACE_ID,
  DEFAULT_CONVERSATION_NAME,
  MAX_CONTEXT_CHARS,
} from '@/config/tavus'
import {
  buildCreateConversationBody,
  sanitizeContext,
} from '@/lib/tavus/conversations'

describe('buildCreateConversationBody', () => {
  it('requires pal_id', () => {
    expect(() => buildCreateConversationBody({ palId: '   ' })).toThrow(
      'pal_id is required',
    )
  })

  it('uses the documented stock Anna face when face_id is omitted', () => {
    const body = buildCreateConversationBody({ palId: 'p_test' })
    expect(body.pal_id).toBe('p_test')
    expect(body.face_id).toBe(STOCK_ANNA_FACE_ID)
    expect(body.conversation_name).toBe(DEFAULT_CONVERSATION_NAME)
    expect(body.properties?.language).toBe('english')
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
