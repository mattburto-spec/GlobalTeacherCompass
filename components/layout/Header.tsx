'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/explore', label: 'Explore' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/compare', label: 'Compare' },
  { href: '/chat', label: 'AI Advisor' },
  { href: '/submit', label: 'Share Data' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
                <circle cx="18" cy="18" r="16" stroke="#D4A853" strokeWidth="1.5" opacity="0.6" />
                <circle cx="18" cy="18" r="12" stroke="#D4A853" strokeWidth="0.75" opacity="0.3" />
                <path d="M18 4L18 32" stroke="#D4A853" strokeWidth="0.75" opacity="0.4" />
                <path d="M4 18L32 18" stroke="#D4A853" strokeWidth="0.75" opacity="0.4" />
                <path d="M18 6L20.5 14H18L15.5 14L18 6Z" fill="#D4A853" />
                <path d="M18 30L15.5 22H18L20.5 22L18 30Z" fill="#D4A853" opacity="0.4" />
                <path d="M6 18L14 15.5V18V20.5L6 18Z" fill="#D4A853" opacity="0.4" />
                <path d="M30 18L22 20.5V18V15.5L30 18Z" fill="#D4A853" opacity="0.4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sand-light font-[family-name:var(--font-fraunces)] text-[15px] font-semibold leading-tight tracking-tight group-hover:text-gold transition-colors">
                Global Teacher Compass
              </span>
              <span className="text-sand-dark/50 text-[10px] uppercase tracking-[0.2em] leading-tight">
                Know Your Worth
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors rounded-lg ${
                    isActive
                      ? 'text-gold bg-white/5'
                      : 'text-sand-dark/60 hover:text-sand-light hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/analyze"
            className="hidden md:inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-sand-light p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'text-gold bg-white/5'
                    : 'text-sand-dark/60 hover:text-sand-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/analyze"
              onClick={() => setMobileOpen(false)}
              className="block mx-4 mt-3 text-center bg-gold text-navy px-5 py-3 rounded-lg text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
