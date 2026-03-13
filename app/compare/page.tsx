import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComparisonDashboard from '@/components/compare/ComparisonDashboard';

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-sand-light">
      <Header />

      <main className="pt-28 pb-24 px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Stay vs Go</p>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy mb-3">
            Compare your options
          </h1>
          <p className="text-navy/45 max-w-lg mx-auto">
            Model your current situation against potential moves. See projected wealth, break-even points, and which path builds more wealth over time.
          </p>
        </div>
        <ComparisonDashboard />
      </main>

      <Footer />
    </div>
  );
}
