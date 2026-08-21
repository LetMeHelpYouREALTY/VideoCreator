import { NextRequest, NextResponse } from 'next/server'
import { STOCK_ANNA_FACE_ID } from '@/config/tavus'
import { buildCreateConversationBody } from '@/lib/tavus/conversations'
import {
  createConversation,
  endConversation,
} from '@/lib/tavus/server'

export const revalidate = 0

type TavusRouteAction = 'create' | 'end'

type TavusRouteBody = {
  action?: TavusRouteAction
  conversationId?: string
  conversationalContext?: string
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

function assertConfiguredPalId(): string {
  const palId = process.env.TAVUS_PAL_ID?.trim()
  if (!palId) {
    throw new Error(
      'TAVUS_PAL_ID is not set. Create a full-pipeline PAL first, then add the pal_id to .env.local.',
    )
  }
  return palId
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TavusRouteBody
    const action: TavusRouteAction = body.action ?? 'create'

    switch (action) {
      case 'create': {
        const palId = assertConfiguredPalId()
        const conversation = await createConversation(
          buildCreateConversationBody({
            palId,
            faceId: process.env.TAVUS_FACE_ID?.trim() || STOCK_ANNA_FACE_ID,
            conversationalContext: body.conversationalContext,
          }),
        )
        return NextResponse.json(conversation, {
          headers: { 'Cache-Control': 'no-store' },
        })
      }
      case 'end': {
        if (!body.conversationId?.trim()) {
          return jsonError('conversationId is required', 400)
        }
        await endConversation(body.conversationId)
        return NextResponse.json({ ok: true })
      }
      default: {
        const _exhaustive: never = action
        return jsonError(`Unsupported action: ${String(_exhaustive)}`, 400)
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to process Tavus request'
    const status = message.includes('not configured') || message.includes('not set')
      ? 500
      : 502
    return jsonError(message, status)
  }
}
