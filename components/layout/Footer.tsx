import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-sand-dark/60 relative overflow-hidden">
      {/* Decorative compass */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] compass-decoration opacity-30 -translate-y-1/2 translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
                <circle cx="18" cy="18" r="16" stroke="#D4A853" strokeWidth="1.5" opacity="0.4" />
                <path d="M18 6L20.5 14H18L15.5 14L18 6Z" fill="#D4A853" opacity="0.6" />
              </svg>
              <span className="text-sand-light font-[family-name:var(--font-fraunces)] text-lg font-semibold">
                Global Teacher Compass
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Helping international educators make informed financial decisions about where to teach,
              what to negotiate, and how to build wealth abroad.
            </p>
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-1.5 bg-white/5 text-sand-dark/40 text-xs px-3 py-1.5 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 bg-green rounded-full" />
                30+ Cities
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 text-sand-dark/40 text-xs px-3 py-1.5 rounded-full border border-white/5">
                AI-Powered
              </span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sand-light text-xs font-semibold uppercase tracking-[0.15em] mb-4">Tools</h4>
            <ul className="space-y-2.5">
              <li><Link href="/analyze" className="text-sm hover:text-gold transition-colors">Package Analyzer</Link></li>
              <li><Link href="/compare" className="text-sm hover:text-gold transition-colors">Stay vs Go Calculator</Link></li>
              <li><Link href="/chat" className="text-sm hover:text-gold transition-colors">AI Financial Advisor</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sand-light text-xs font-semibold uppercase tracking-[0.15em] mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm opacity-50">Salary Data (Coming Soon)</span></li>
              <li><span className="text-sm opacity-50">City Guides (Coming Soon)</span></li>
              <li><span className="text-sm opacity-50">Community (Coming Soon)</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/5 pt-8">
          <div className="bg-white/[0.03] rounded-xl p-4 mb-6 border border-white/5">
            <p className="text-xs leading-relaxed text-sand-dark/40">
              <span className="text-gold/60 font-semibold">Disclaimer:</span>{' '}
              Global Teacher Compass provides educational financial guidance and tools for international educators.
              This is not regulated financial advice. All salary data, cost-of-living estimates, and projections
              are approximations based on publicly available information and should be verified independently.
              Always consult a qualified, fee-only financial advisor before making investment decisions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-sand-dark/30">
              &copy; {new Date().getFullYear()} Global Teacher Compass. All rights reserved.
            </p>
            <p className="text-xs text-sand-dark/30">
              Built for educators, by educators.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
