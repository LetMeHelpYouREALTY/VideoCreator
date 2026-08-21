import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: SITE.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE.url}/studio`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/livekit`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
