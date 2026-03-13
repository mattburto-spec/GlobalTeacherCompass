import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ExplorerDashboard from '@/components/explorer/ExplorerDashboard';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-sand-light">
      <Header />

      <main className="pt-28 pb-24 px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Explore</p>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy mb-3">
            Find your best fit
          </h1>
          <p className="text-navy/45 max-w-lg mx-auto">
            Weight what matters to you — school quality, city livability, or savings potential — and discover which cities match your priorities.
          </p>
        </div>
        <ExplorerDashboard />
      </main>

      <Footer />
    </div>
  );
}
