import { NextRequest, NextResponse } from 'next/server'
import { STOCK_ANNA_FACE_ID } from '@/config/tavus'
import { buildFullPipelinePal, buildLiveKitEchoPal } from '@/lib/tavus/pals'
import { createPal } from '@/lib/tavus/server'

export const revalidate = 0

type PalKind = 'full' | 'livekit'

type CreatePalBody = {
  kind?: PalKind
}

export async function POST(request: NextRequest) {
  try {
    const setupToken = process.env.TAVUS_SETUP_TOKEN
    if (setupToken && request.headers.get('x-setup-token') !== setupToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as CreatePalBody
    const kind: PalKind = body.kind ?? 'full'
    const faceId = process.env.TAVUS_FACE_ID?.trim() || STOCK_ANNA_FACE_ID

    const payload = ((): ReturnType<typeof buildFullPipelinePal> => {
      switch (kind) {
        case 'full':
          return buildFullPipelinePal(faceId)
        case 'livekit':
          return buildLiveKitEchoPal(faceId)
        default: {
          const _exhaustive: never = kind
          throw new Error(`Unsupported PAL kind: ${String(_exhaustive)}`)
        }
      }
    })()

    const pal = await createPal(payload)
    return NextResponse.json(pal, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create PAL'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
