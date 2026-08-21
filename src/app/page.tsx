import { FAQSection, faqJsonLd } from '@/components/sections/FAQSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { SITE } from '@/config/site'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <HeroSection />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Tavus CVI studio</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Create a full-pipeline PAL, then start a conversation. The API
            returns a conversation_url. The studio embeds it with CVIProvider
            and Conversation from the Tavus examples.
          </p>
          <Link className="mt-4 inline-block font-medium text-violet-700 underline" href="/studio">
            Open the studio
          </Link>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">LiveKit avatar agent</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            LiveKit runs STT, LLM, and TTS. Tavus joins the room as the face
            through tavus.AvatarSession with your face_id.
          </p>
          <Link className="mt-4 inline-block font-medium text-violet-700 underline" href="/livekit">
            LiveKit setup
          </Link>
        </article>
      </section>
      <FAQSection />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-slate-700">
          <p>
            {SITE.name}. {SITE.address.street}, {SITE.address.city},{' '}
            {SITE.address.region} {SITE.address.postalCode}. Call{' '}
            <a className="underline" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
            . {SITE.hours.display}.
          </p>
        </div>
      </section>
    </>
  )
}
