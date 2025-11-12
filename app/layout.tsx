import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'LUMIÈRE - Luxury Lighting Collection',
    template: '%s | LUMIÈRE',
  },
  description: 'Discover elegant and sophisticated lighting solutions. Premium lamps, floor lights, and table lamps crafted with exceptional design and quality materials. Transform your space with LUMIÈRE.',
  keywords: ['luxury lighting', 'designer lamps', 'floor lamps', 'table lamps', 'interior lighting', 'home decor', 'premium lighting', 'LED lights'],
  authors: [{ name: 'LUMIÈRE' }],
  creator: 'LUMIÈRE',
  publisher: 'LUMIÈRE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'LUMIÈRE',
    title: 'LUMIÈRE - Luxury Lighting Collection',
    description: 'Discover elegant and sophisticated lighting solutions. Premium lamps crafted with exceptional design and quality materials.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LUMIÈRE Luxury Lighting Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUMIÈRE - Luxury Lighting Collection',
    description: 'Discover elegant and sophisticated lighting solutions. Premium lamps crafted with exceptional design.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
