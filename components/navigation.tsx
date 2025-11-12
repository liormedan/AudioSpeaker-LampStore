"use client"

import Link from "next/link"

export function Navigation() {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 hover:bg-black/30 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="LUMIÈRE - Home"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50" aria-hidden="true">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-2xl font-bold tracking-wider text-white drop-shadow-lg">LUMIÈRE</span>
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex items-center gap-2 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10" role="menubar">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
            role="menuitem"
            aria-label="View our lamp collection"
          >
            Collection
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-white/90 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
            role="menuitem"
            aria-label="Learn about LUMIÈRE"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-white/90 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
            role="menuitem"
            aria-label="Contact us"
          >
            Contact
          </Link>
        </div>

        {/* Cart Icon */}
        <button 
          className="relative p-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Shopping cart, 0 items"
          aria-live="polite"
        >
          <span className="text-xl" aria-hidden="true">🛒</span>
          <span 
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/50"
            aria-hidden="true"
          >
            0
          </span>
        </button>
      </div>
    </nav>
  )
}
