import { NextRequest, NextResponse } from 'next/server'
import { TavusHttpError, statusForTavusError } from '@/lib/tavus/http-error'
import { endConversation } from '@/lib/tavus/server'

export const revalidate = 0

type EndConversationParams = {
  params: Promise<{ conversationId: string }>
}

export async function POST(
  _request: NextRequest,
  { params }: EndConversationParams,
) {
  try {
    const { conversationId } = await params
    if (!conversationId?.trim()) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 },
      )
    }

    await endConversation(conversationId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to end conversation'
    const details = error instanceof TavusHttpError ? error.details : undefined
    return NextResponse.json(
      { error: message, details },
      { status: statusForTavusError(error) },
    )
  }
}
