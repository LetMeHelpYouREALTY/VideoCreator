import Link from 'next/link'
import { SITE } from '@/config/site'

export function HeroSection() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-violet-200">
            Las Vegas conversational video
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            Talk through a listing with a live Tavus video avatar
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            VideoCreator starts a Tavus CVI conversation with face {''}
            <code className="rounded bg-slate-800 px-1">r90bbd427f71</code>
            {' '}and a Las Vegas real estate PAL. LiveKit can render the same face beside a voice agent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="rounded-md bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-500"
            >
              Start conversation
            </Link>
            <a
              href={SITE.phoneHref}
              className="rounded-md border border-white/30 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
        <div className="rounded-xl bg-slate-800 p-6 text-sm leading-6 text-slate-100">
          <p>
            {SITE.legalName}
          </p>
          <p>{SITE.address.street}</p>
          <p>
            {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
          </p>
          <p className="mt-3">
            <a className="underline" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <p>{SITE.hours.display}</p>
        </div>
      </div>
    </section>
  )
}
