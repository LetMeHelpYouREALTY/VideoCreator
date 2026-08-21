import { SITE, formatNAP } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{SITE.name}</h2>
          <p className="mt-2 text-sm text-slate-700">
            License {SITE.license}
          </p>
          <p className="mt-2 text-sm text-slate-700">{formatNAP()}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Hours</h2>
          <p className="mt-2 text-sm text-slate-700">{SITE.hours.display}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a className="underline" href={SITE.phoneHref}>
              Call
            </a>
            <a className="underline" href={SITE.mapsUrl} target="_blank" rel="noreferrer">
              Directions
            </a>
            <a className="underline" href={SITE.reviewsUrl} target="_blank" rel="noreferrer">
              View Google Reviews
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Office</h2>
          <iframe
            title={`Map to ${SITE.legalName} at ${SITE.address.street}`}
            className="mt-2 h-40 w-full rounded-md border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
            )}&z=15&output=embed`}
          />
        </div>
      </div>
    </footer>
  )
}
