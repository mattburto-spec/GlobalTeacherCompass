'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackageForm from '@/components/analyzer/PackageForm';
import PackageReport from '@/components/analyzer/PackageReport';
import type { PackageReport as PackageReportType } from '@/data/types';

export default function AnalyzePage() {
  const [report, setReport] = useState<PackageReportType | null>(null);

  return (
    <div className="min-h-screen bg-sand-light">
      <Header />

      <main className="pt-28 pb-24 px-6 lg:px-8">
        {!report ? (
          <>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Package Analyzer</p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy mb-3">
                Analyze your offer
              </h1>
              <p className="text-navy/45 max-w-lg mx-auto">
                Enter your compensation package details and get instant, data-driven feedback with regional benchmarks and negotiation tips.
              </p>
            </div>
            <PackageForm onComplete={setReport} />
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">Analysis Complete</p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold text-navy mb-3">
                Your Package Report
              </h1>
              <button
                onClick={() => setReport(null)}
                className="text-sm text-teal hover:text-teal-light font-medium transition-colors"
              >
                Analyze another package
              </button>
            </div>
            <PackageReport report={report} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
