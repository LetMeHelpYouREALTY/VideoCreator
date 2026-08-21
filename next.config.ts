import type { NextConfig } from 'next'

const dailyHosts = [
  'https://*.daily.co',
  'wss://*.daily.co',
  'https://*.pluot.blue',
  'wss://*.pluot.blue',
]

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.daily.co",
  `connect-src 'self' https://tavusapi.com ${dailyHosts.join(' ')}`,
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: mediastream: https://*.daily.co",
  "frame-src 'self' https://*.daily.co https://maps.google.com https://www.google.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
].join('; ')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ]
  },
}

export default nextConfig
