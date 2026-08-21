import type { Metadata } from 'next'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'LiveKit Tavus avatar agent',
  description:
    'Run a LiveKit voice assistant with a Tavus face in the same room for Las Vegas real estate video.',
}

export default function LiveKitPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">
        LiveKit Tavus avatar agent
      </h1>
      <p className="mt-4 leading-7 text-slate-700">
        LiveKit runs the voice assistant. Tavus renders the face. Start
        tavus.AvatarSession with your face_id before AgentSession.start, then
        keep room audio output disabled so Tavus owns playback.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
        <li>
          Create an echo-mode PAL with a livekit transport, or skip pal_id to
          use the stock LiveKit PAL.
        </li>
        <li>
          Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, TAVUS_API_KEY,
          and TAVUS_FACE_ID in agent/.env.local.
        </li>
        <li>
          Run <code className="rounded bg-slate-100 px-1">npm run agent:dev</code> from
          the repo root.
        </li>
        <li>
          Join the room from the LiveKit Agents Playground or a frontend starter.
        </li>
      </ol>
      <p className="mt-8 text-sm text-slate-700">
        {SITE.legalName}, {SITE.address.street}, {SITE.address.city},{' '}
        {SITE.address.region} {SITE.address.postalCode}. Call{' '}
        <a className="underline" href={SITE.phoneHref}>
          {SITE.phone}
        </a>
        .
      </p>
    </article>
  )
}
