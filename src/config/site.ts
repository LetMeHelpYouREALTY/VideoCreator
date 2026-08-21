export const SITE = {
  name: 'Dr. Jan Duffy | Berkshire Hathaway HomeServices Nevada Properties',
  shortName: 'Dr. Jan Duffy',
  legalName: 'Berkshire Hathaway HomeServices Nevada Properties',
  description:
    'Conversational video studio for Las Vegas real estate. Talk live with a Tavus-powered avatar about listings, pricing, and next steps.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  phone: '702-222-1964',
  phoneHref: 'tel:+17022221964',
  email: 'drduffy@bhhsnv.com',
  license: 'S.0197614.LLC',
  address: {
    street: '8850 W. Sunset Road, Suite 200',
    city: 'Las Vegas',
    region: 'NV',
    postalCode: '89148',
    country: 'US',
  },
  hours: {
    display: 'Monday–Sunday, 9:00 AM–6:00 PM',
    schema: [
      {
        days: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  },
  mapsUrl:
    'https://maps.google.com/?q=8850+W+Sunset+Road+Suite+200,+Las+Vegas,+NV+89148',
  reviewsUrl:
    'https://www.google.com/search?q=Dr.+Jan+Duffy+Berkshire+Hathaway+HomeServices+Nevada+Properties+Las+Vegas+reviews',
  gbpUrl:
    'https://www.bhhs.com/arizona-properties-california-properties-and-nevada-properties-nv301/las-vegas/dr-jan-duffy/cid-3042332',
} as const

export function formatNAP(): string {
  return `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode} · ${SITE.phone}`
}
