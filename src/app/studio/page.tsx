import type { Metadata } from 'next'
import { StudioApp } from '@/components/studio/StudioApp'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Live listing video conversation',
  description:
    'Start a Tavus conversational video session with Dr. Jan Duffy VideoCreator for Las Vegas real estate.',
}

export default function StudioPage() {
  return (
    <div className="px-4 py-10">
      <p className="mx-auto mb-6 max-w-5xl text-sm text-slate-600">
        {SITE.legalName} · {SITE.address.street}, {SITE.address.city},{' '}
        {SITE.address.region} {SITE.address.postalCode} ·{' '}
        <a className="underline" href={SITE.phoneHref}>
          {SITE.phone}
        </a>
      </p>
      <StudioApp />
    </div>
  )
}
