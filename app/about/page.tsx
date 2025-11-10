"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#1a1d23] text-white">
      <Navigation />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 bg-black/30 backdrop-blur-xl px-6 py-3 rounded-full border border-amber-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-wider">LUMIÈRE</h1>
            </div>
            <p className="text-xl md:text-2xl text-amber-400 font-light mb-4">Luxury Lighting Collection</p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Illuminating spaces with elegance and sophistication since 2020
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-amber-400">Our Story</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                LUMIÈRE was born from a passion for exceptional design and the belief that lighting is more than just
                function—it's an art form that transforms spaces and creates atmosphere.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                Every piece in our collection is carefully curated from the world's finest lighting designers, combining
                traditional craftsmanship with contemporary innovation.
              </p>
              <p className="text-white/80 leading-relaxed">
                We work with master artisans who use premium materials—hand-blown glass, brushed brass, natural
                marble—to create lighting that becomes the centerpiece of any room.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-amber-400">Our Philosophy</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Quality First</h3>
                  <p className="text-white/70 leading-relaxed">
                    We never compromise on materials or craftsmanship. Each lamp is built to last generations.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Timeless Design</h3>
                  <p className="text-white/70 leading-relaxed">
                    Our pieces transcend trends, offering elegance that remains relevant for decades.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Personalized Service</h3>
                  <p className="text-white/70 leading-relaxed">
                    From consultation to installation, we ensure your lighting perfectly suits your space.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-amber-400">Why Choose LUMIÈRE</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Premium Materials</h3>
                <p className="text-white/70 leading-relaxed">
                  Hand-blown glass, solid brass, Italian marble, and sustainably sourced wood.
                </p>
              </div>

              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Artisan Crafted</h3>
                <p className="text-white/70 leading-relaxed">
                  Each piece is handmade by skilled artisans with decades of experience.
                </p>
              </div>

              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 text-center">
                <div className="text-5xl mb-4">♻️</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Sustainable</h3>
                <p className="text-white/70 leading-relaxed">
                  Energy-efficient LED technology and responsibly sourced materials.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 backdrop-blur-xl p-12 rounded-3xl border border-amber-500/30 text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">Visit Our Showroom</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Experience our collection in person. Our design consultants are here to help you find the perfect lighting
              for your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-full hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/50"
              >
                Explore Collection
              </Link>
              <a
                href="#contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-3xl font-bold tracking-wider text-white">LUMIÈRE</span>
          </div>
          <p className="text-white/60 mb-6">Luxury Lighting Collection</p>
          <div className="flex justify-center gap-8 text-sm text-white/70">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-amber-400 transition-colors">
              About
            </Link>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-white/40 text-sm mt-8">© 2025 LUMIÈRE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
