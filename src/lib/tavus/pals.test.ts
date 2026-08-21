import { describe, expect, it } from 'vitest'
import { INTERVIEWER_PAL_NAME, STOCK_ANNA_FACE_ID } from '@/config/tavus'
import {
  buildFullPipelinePal,
  buildInterviewerPal,
  buildLiveKitEchoPal,
} from '@/lib/tavus/pals'

describe('PAL payloads', () => {
  it('builds the API Conversation Quickstart Interviewer PAL', () => {
    const pal = buildInterviewerPal()
    expect(pal).toEqual({
      pal_name: INTERVIEWER_PAL_NAME,
      system_prompt:
        'As an Interviewer, you are a skilled professional who conducts thoughtful and structured interviews. Your aim is to ask insightful questions, listen carefully, and assess responses objectively to identify the best candidates.',
      pipeline_mode: 'full',
      context:
        'You have a track record of conducting interviews that put candidates at ease, draw out their strengths, and help organizations make excellent hiring decisions.',
      default_face_id: STOCK_ANNA_FACE_ID,
      layers: {
        perception: {
          perception_model: 'raven-1',
        },
        conversational_flow: {
          turn_detection_model: 'sparrow-1',
          turn_taking_patience: 'high',
          pal_interruptibility: 'medium',
        },
      },
    })
  })

  it('builds a full-pipeline Las Vegas realtor PAL', () => {
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
