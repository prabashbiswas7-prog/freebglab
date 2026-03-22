import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free Background Lab — Generative Background Generator',
  description: 'Create stunning generative backgrounds free. 32 tools: mesh gradients, Perlin noise, Voronoi, patterns and more. Download PNG 4K instantly. No signup.',
  keywords: 'free background generator, gradient generator, mesh gradient, pattern generator, generative art, background maker',
  metadataBase: new URL('https://freebglab.com'),
  openGraph: {
    title: 'Free Background Lab',
    description: 'Free generative background generator — 32 tools, download instantly',
    type: 'website',
    siteName: 'Free Background Lab',
  },
  twitter: { card: 'summary_large_image', title: 'Free Background Lab' },
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#080810" />
      </head>
      <body>{children}</body>
    </html>
  )
}
