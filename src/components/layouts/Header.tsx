import Link from 'next/link'
import { SITE } from '@/config/site'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold text-slate-900">
            {SITE.shortName} VideoCreator
          </Link>
          <p className="text-sm text-slate-600">{SITE.legalName}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/studio" className="text-slate-900 hover:underline">
            Start a video conversation
          </Link>
          <Link href="/livekit" className="text-slate-700 hover:underline">
            LiveKit avatar agent
          </Link>
          <a href={SITE.phoneHref} className="rounded-md bg-violet-700 px-3 py-2 text-white">
            Call {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  )
}
