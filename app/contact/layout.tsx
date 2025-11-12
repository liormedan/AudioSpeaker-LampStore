import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with LUMIÈRE. Visit our showroom, contact our design team, or inquire about custom lighting solutions. We\'re here to help illuminate your space.',
  openGraph: {
    title: 'Contact LUMIÈRE - Get In Touch',
    description: 'Visit our showroom, contact our design team, or inquire about custom lighting solutions.',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

