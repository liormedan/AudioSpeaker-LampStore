import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about LUMIÈRE - our story, philosophy, and commitment to exceptional lighting design. Discover why we choose premium materials and artisan craftsmanship.',
  openGraph: {
    title: 'About LUMIÈRE - Our Story & Philosophy',
    description: 'Learn about LUMIÈRE - our story, philosophy, and commitment to exceptional lighting design.',
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

