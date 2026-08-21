'use client'

import { useCallback, useState } from 'react'
import { HairCheck } from '@/components/cvi/components/hair-check'
import { Conversation } from '@/components/cvi/components/conversation'
import { createTavusConversation, endTavusConversation } from '@/lib/tavus/browser'
import type { CreateConversationResponse } from '@/lib/tavus/types'
import type { StudioScreen } from '@/lib/tavus/types'

export function StudioClient() {
  const [screen, setScreen] = useState<StudioScreen>('welcome')
  const [conversation, setConversation] = useState<CreateConversationResponse | null>(null)
  const [context, setContext] = useState('')
  const [testMode, setTestMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLeave = useCallback(async () => {
    if (conversation) {
      await endTavusConversation(conversation.conversation_id).catch(() => undefined)
    }
    setConversation(null)
    setScreen('welcome')
  }, [conversation])

  const handleJoin = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const nextConversation = await createTavusConversation({
        conversationalContext: context,
        testMode,
      })

      switch (nextConversation.status) {
        case 'active':
          setConversation(nextConversation)
          setScreen('call')
          return
        case 'ended':
          setConversation(null)
          setError(
            testMode
              ? `Test conversation ${nextConversation.conversation_id} created. status is ended; the PAL did not join.`
              : 'Conversation ended before join.',
          )
          setScreen('welcome')
          return
        case 'error':
          setConversation(null)
          setError(`Tavus returned conversation status error (${nextConversation.conversation_id}).`)
          setScreen('welcome')
          return
        default: {
          const _exhaustive: never = nextConversation.status
          setError(`Unknown conversation status: ${String(_exhaustive)}`)
          setScreen('welcome')
        }
      }
    } catch (joinError) {
      setError(
        joinError instanceof Error
          ? joinError.message
          : 'Could not start the Tavus conversation',
      )
      setScreen('welcome')
    } finally {
      setLoading(false)
    }
  }, [context, testMode])

  switch (screen) {
    case 'welcome':
      return (
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">
            Las Vegas listing video conversation
          </h1>
          <p className="mt-3 text-slate-700">
            Check camera and mic, then join a Tavus CVI room. Step 2 creates a
            conversation with pal_id only. Join uses the returned conversation_url.
          </p>
          <label className="mt-6 block text-sm font-medium text-slate-800" htmlFor="listing-context">
            Optional listing notes for this call
          </label>
          <textarea
            id="listing-context"
            className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm"
            rows={5}
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="Address, beds, baths, square footage, list price if verified."
          />
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={testMode}
              onChange={(event) => setTestMode(event.target.checked)}
            />
            Create in test mode (PAL does not join; no billing)
          </label>
          {error ? (
            <p className="mt-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            className="mt-6 rounded-md bg-violet-700 px-5 py-3 font-medium text-white hover:bg-violet-600"
            onClick={() => setScreen('hairCheck')}
          >
            Continue to camera check
          </button>
        </div>
      )
    case 'hairCheck':
      return (
        <div className="mx-auto w-full max-w-3xl">
          <HairCheck
            isJoinBtnLoading={loading}
            onJoin={() => {
              void handleJoin()
            }}
            onCancel={() => setScreen('welcome')}
          />
        </div>
      )
    case 'call':
      if (!conversation) {
        return (
          <p className="text-center text-slate-700" role="alert">
            Conversation URL missing. Return to start.
          </p>
        )
      }
      return (
        <div className="mx-auto h-[80vh] w-full max-w-5xl">
          <Conversation
            conversationUrl={conversation.conversation_url}
            onLeave={() => {
              void handleLeave()
            }}
          />
        </div>
      )
    default: {
      const _exhaustive: never = screen
      return _exhaustive
    }
  }
}
