import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_CUSTOM_GREETING, STOCK_SDR_PAL_ID } from '@/config/tavus'
import { buildCreateConversationBody } from '@/lib/tavus/conversations'
import { TavusHttpError, statusForTavusError } from '@/lib/tavus/http-error'
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
  testMode?: boolean
}

function jsonError(error: string, status: number, details?: string) {
  return NextResponse.json({ error, details }, { status })
}

function configuredPalId(): string {
  return process.env.TAVUS_PAL_ID?.trim() || STOCK_SDR_PAL_ID
}

function configuredFaceId(): string | undefined {
  return process.env.TAVUS_FACE_ID?.trim() || undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TavusRouteBody
    const action: TavusRouteAction = body.action ?? 'create'

    switch (action) {
      case 'create': {
        const palId = configuredPalId()
        const faceId = configuredFaceId()
        const conversation = await createConversation(
          buildCreateConversationBody({
            palId,
            faceId,
            conversationalContext: body.conversationalContext,
            testMode: body.testMode,
            customGreeting: process.env.TAVUS_PAL_ID?.trim()
              ? DEFAULT_CUSTOM_GREETING
              : undefined,
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
    const details = error instanceof TavusHttpError ? error.details : undefined
    return jsonError(message, statusForTavusError(error), details)
  }
}
