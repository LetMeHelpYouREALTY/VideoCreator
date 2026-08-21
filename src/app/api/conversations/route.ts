import { NextRequest, NextResponse } from 'next/server'
import { STOCK_SDR_PAL_ID } from '@/config/tavus'
import { buildCreateConversationBody } from '@/lib/tavus/conversations'
import { TavusHttpError, statusForTavusError } from '@/lib/tavus/http-error'
import { createConversation } from '@/lib/tavus/server'

export const revalidate = 0

type CreateConversationBody = {
  pal_id?: string
  face_id?: string
  conversation_name?: string
  test_mode?: boolean
}

function jsonError(error: string, status: number, details?: string) {
  return NextResponse.json({ error, details }, { status })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CreateConversationBody
    const palId = body.pal_id?.trim() || process.env.TAVUS_PAL_ID?.trim() || STOCK_SDR_PAL_ID
    const faceId = body.face_id?.trim() || process.env.TAVUS_FACE_ID?.trim() || undefined

    const conversation = await createConversation(
      buildCreateConversationBody({
        palId,
        faceId,
        conversationName: body.conversation_name,
        testMode: body.test_mode,
      }),
    )

    return NextResponse.json(conversation, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create conversation'
    const details = error instanceof TavusHttpError ? error.details : undefined
    return jsonError(message, statusForTavusError(error), details)
  }
}
