import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EmailCapture from '@/components/landing/EmailCapture';

const features = [
  {
    title: 'Package Analyzer',
    description: 'Paste your offer. Get instant, data-driven feedback on every line item — salary, housing, flights, insurance, tuition — with red flags and negotiation tips.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 11H25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 19H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    href: '/analyze',
    delay: '100',
  },
  {
    title: 'Stay vs Go Calculator',
    description: 'Compare your current situation against up to three moves. See wealth projections over time, crossover points, and the true cost of uprooting.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 12L14 4L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 20H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    href: '/compare',
    delay: '200',
  },
  {
    title: 'AI Financial Advisor',
    description: 'Ask anything about expat finances. Grounded in proven investment principles — index funds, avoiding tied advisors, tax-efficient strategies for every jurisdiction.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8L4 22V8C4 6.9 4.9 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 14H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    href: '/chat',
    delay: '300',
  },
];

const steps = [
  { number: '01', title: 'Enter Your Package', description: 'Input your current or offered compensation details — salary, benefits, location.' },
  { number: '02', title: 'Get Smart Analysis', description: 'Our engine scores every component against regional benchmarks and flags what matters.' },
  { number: '03', title: 'Make Better Decisions', description: 'Compare options, project your savings, and negotiate with confidence.' },
];

const stats = [
  { value: '30+', label: 'Cities Covered', sublabel: 'Cost-of-living data' },
  { value: '7', label: 'Regions', sublabel: 'Global coverage' },
  { value: 'AI', label: 'Powered Analysis', sublabel: 'Claude-driven insights' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-sand-light">
      <Header />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] compass-decoration opacity-40" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sand-light to-transparent z-10" />

        {/* Floating city dots */}
        <div className="absolute hidden lg:block" style={{ top: '30%', left: '8%' }}>
          <div className="relative pulse-dot w-2 h-2 bg-gold rounded-full" />
          <span className="absolute top-4 -left-3 text-[10px] text-navy/30 font-medium whitespace-nowrap">Dubai</span>
        </div>
        <div className="absolute hidden lg:block" style={{ top: '45%', right: '12%' }}>
          <div className="relative pulse-dot w-2 h-2 bg-teal rounded-full" />
          <span className="absolute top-4 -left-6 text-[10px] text-navy/30 font-medium whitespace-nowrap">Singapore</span>
        </div>
        <div className="absolute hidden lg:block" style={{ top: '55%', left: '15%' }}>
          <div className="relative pulse-dot w-2 h-2 bg-gold/60 rounded-full" />
          <span className="absolute top-4 -left-4 text-[10px] text-navy/30 font-medium whitespace-nowrap">Bangkok</span>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-navy/5 backdrop-blur-sm text-navy/60 text-xs font-medium px-4 py-2 rounded-full mb-8 border border-navy/5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
                <path d="M7 3V7L9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              For international school educators
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animation-delay-100 font-[family-name:var(--font-fraunces)] text-5xl sm:text-6xl lg:text-7xl font-semibold text-navy leading-[1.05] tracking-tight mb-6">
              Know Your{' '}
              <span className="text-gold-gradient">Worth</span>
              <br />
              Abroad
            </h1>

            {/* Subheading */}
            <p className="animate-fade-in-up animation-delay-200 text-lg sm:text-xl text-navy/55 leading-relaxed max-w-xl mb-10">
              Evaluate international school packages, compare opportunities across 30+ cities,
              and plan your financial future with AI-powered analysis.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-4">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-dark text-navy px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-0.5"
              >
                Analyze a Package
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2.5 bg-navy/5 hover:bg-navy/10 text-navy px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all border border-navy/10 hover:border-navy/20"
              >
                Compare Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Tools</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy">
              Everything you need to decide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`animate-fade-in-up animation-delay-${feature.delay} group card-hover relative bg-white rounded-2xl p-8 border border-sand-dark/20 hover:border-gold/30`}
              >
                <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mb-6 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-navy/50 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-navy relative overflow-hidden noise-bg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] compass-decoration opacity-20" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">How It Works</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-sand-light">
              Three steps to clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={step.number} className={`animate-fade-in-up animation-delay-${(i + 1) * 100} relative`}>
                <div className="text-gold/20 font-[family-name:var(--font-fraunces)] text-7xl font-bold mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-sand-light mb-3">
                  {step.title}
                </h3>
                <p className="text-sand-dark/40 text-sm leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-6 lg:-right-8 text-gold/15">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-sand-dark/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-fraunces)] text-5xl font-bold text-gold-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-navy font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-navy/40 text-xs">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Capture ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal mb-4">Stay Updated</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy mb-4">
              Join the community
            </h2>
            <p className="text-navy/50 mb-8">
              Get notified when we add new cities, salary data, and tools. No spam — just genuinely useful updates for international educators.
            </p>
            <EmailCapture />
            <p className="text-xs text-navy/30 mt-4">Free forever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
