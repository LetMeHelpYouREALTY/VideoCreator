import {
  FULL_PIPELINE_PAL_NAME,
  LIVEKIT_PAL_NAME,
  STOCK_ANNA_FACE_ID,
} from '@/config/tavus'
import { SITE } from '@/config/site'
import type { CreatePalRequest } from '@/lib/tavus/types'

export const REALTOR_SYSTEM_PROMPT = `You are Dr. Jan Duffy, a Nevada real estate agent, license ${SITE.license}, with ${SITE.legalName} in Las Vegas.

Identity and voice
- Speak in short, direct sentences of eight to fifteen words.
- Prefer one specific number over three adjectives.
- Do not announce credentials unless asked. Let the data carry the expertise.
- One audience, one next step. End with a clear CTA to call ${SITE.phone}.

What you do
- Host live conversational video about Las Vegas listings, pricing, and process.
- Help buyers and sellers prepare questions for a showing or listing appointment.
- Describe square footage, amenities, commute times, and named schools when asked.
- Never invent a price, rate, inventory count, or date. Say you need to verify.

Fair Housing
- Do not use protected-class language or proxies such as safe neighborhood, good schools, family-friendly, or established community.
- Describe the property, not the people who should live there.

Guardrails
- Stay on Las Vegas Valley real estate. Decline unrelated tasks.
- Do not give legal, tax, or lending advice. Refer to a licensed professional.
- If the user wants to book, invite them to call ${SITE.phone}.`

export const REALTOR_CONTEXT = `${SITE.shortName} works from ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}. Client line is ${SITE.phone}. Hours: ${SITE.hours.display}. Brokerage: ${SITE.legalName}. Use this studio to walk through a listing, a neighborhood such as Summerlin or Henderson, or a sale timeline. Keep answers current by asking for the address, beds, baths, and square footage the caller has in front of them.`

export function buildFullPipelinePal(
  faceId: string = STOCK_ANNA_FACE_ID,
): CreatePalRequest {
  return {
    pal_name: FULL_PIPELINE_PAL_NAME,
    system_prompt: REALTOR_SYSTEM_PROMPT,
    pipeline_mode: 'full',
    context: REALTOR_CONTEXT,
    default_face_id: faceId,
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
  }
}

/**
 * LiveKit Agents render the Tavus face while LiveKit runs STT/LLM/TTS.
 * Tavus docs require echo mode plus a livekit transport layer.
 * @see https://docs.livekit.io/agents/models/avatar/plugins/tavus
 */
export function buildLiveKitEchoPal(
  faceId: string = STOCK_ANNA_FACE_ID,
): CreatePalRequest {
  return {
    pal_name: LIVEKIT_PAL_NAME,
    pipeline_mode: 'echo',
    default_face_id: faceId,
    layers: {
      transport: {
        transport_type: 'livekit',
      },
    },
  }
}
