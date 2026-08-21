import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from '@/components/layouts/Footer'
import { Header } from '@/components/layouts/Header'
import { SITE } from '@/config/site'
import { localBusinessJsonLd } from '@/lib/schema'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Las Vegas Conversational Video | Dr. Jan Duffy VideoCreator',
    template: '%s | Dr. Jan Duffy VideoCreator',
  },
  description: SITE.description,
  openGraph: {
    title: 'Las Vegas Conversational Video | Dr. Jan Duffy VideoCreator',
    description: SITE.description,
    url: SITE.url,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = localBusinessJsonLd()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-slate-100 text-slate-900 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
