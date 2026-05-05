"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <span className="text-xl font-bold tracking-tight">
              SG Arts & Culture
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-accent transition-colors">
              Events
            </Link>
            <Link
              href="/my-calendar"
              className="hover:text-accent transition-colors"
            >
              My Calendar
            </Link>
            <Link
              href="/organizer/dashboard"
              className="bg-accent text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              For Organisers
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-accent" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link href="/my-calendar" className="block py-2 hover:text-accent" onClick={() => setMenuOpen(false)}>
              My Calendar
            </Link>
            <Link
              href="/organizer/dashboard"
              className="block py-2 bg-accent text-secondary px-4 rounded-lg font-semibold text-center"
              onClick={() => setMenuOpen(false)}
            >
              For Organisers
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
