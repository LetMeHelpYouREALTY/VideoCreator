import { describe, expect, it } from 'vitest'
import { STOCK_ANNA_FACE_ID } from '@/config/tavus'
import { buildFullPipelinePal, buildLiveKitEchoPal } from '@/lib/tavus/pals'

describe('PAL payloads', () => {
  it('builds a full-pipeline interviewer-style PAL', () => {
    const pal = buildFullPipelinePal()
    expect(pal.pipeline_mode).toBe('full')
    expect(pal.default_face_id).toBe(STOCK_ANNA_FACE_ID)
    expect(pal.layers?.perception?.perception_model).toBe('raven-1')
    expect(pal.layers?.conversational_flow?.turn_detection_model).toBe(
      'sparrow-1',
    )
    expect(pal.system_prompt).toMatch(/Do not use protected-class language/)
    expect(pal.system_prompt).toMatch(/square footage/)
  })

  it('builds an echo PAL for LiveKit Agents', () => {
    const pal = buildLiveKitEchoPal('r5dc7c7d0bcb')
    expect(pal.pipeline_mode).toBe('echo')
    expect(pal.default_face_id).toBe('r5dc7c7d0bcb')
    expect(pal.layers?.transport?.transport_type).toBe('livekit')
  })
})
