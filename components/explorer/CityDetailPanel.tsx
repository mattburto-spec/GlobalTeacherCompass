'use client';

import Link from 'next/link';
import type { ScoredCity } from '@/lib/triangle-scores';
import { REGION_COLORS } from '@/lib/triangle-scores';
import type { FamilyStatus } from '@/lib/triangle-scores';
import { formatCurrency } from '@/lib/calculations';

interface Props {
  city: ScoredCity;
  familyStatus: FamilyStatus;
  onClose: () => void;
}

function AxisBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-navy/60">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-sand-dark/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function CityDetailPanel({ city, familyStatus, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-sand-light z-50 shadow-2xl overflow-y-auto animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-navy p-6 noise-bg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] compass-decoration opacity-20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-sand-dark/40 hover:text-sand-light transition-colors z-10"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: REGION_COLORS[city.region] }}
              />
              <span className="text-xs text-sand-dark/40 uppercase tracking-wider">{city.region}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{city.flagEmoji}</span>
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-sand-light">
                  {city.city}
                </h2>
                <p className="text-sand-dark/40 text-sm">{city.country}</p>
              </div>
            </div>

            {/* Fit Score Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <span className="text-xs text-sand-dark/40 uppercase tracking-wider">Fit Score</span>
              <span className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-gold">{city.fitScore}</span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/40 mb-4">Axis Scores</h3>
          <div className="space-y-4 mb-8">
            <AxisBar label="School Quality" value={city.schoolScore} color="#1A8A7D" />
            <AxisBar label="City Livability" value={city.livabilityScore} color="#0F2B46" />
            <AxisBar label="Savings Potential" value={city.savingsScore} color="#D4A853" />
          </div>

          {/* Stats Grid */}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/40 mb-4">Key Stats</h3>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">Median Salary</p>
              <p className="font-[family-name:var(--font-fraunces)] text-lg font-bold text-navy">
                {formatCurrency(city.medianSalary)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">Housing Allow.</p>
              <p className="font-[family-name:var(--font-fraunces)] text-lg font-bold text-navy">
                {formatCurrency(city.typicalHousing)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">
                Monthly Expenses ({familyStatus === 'single' ? 'Single' : 'Family'})
              </p>
              <p className="font-[family-name:var(--font-fraunces)] text-lg font-bold text-navy">
                {formatCurrency(city.monthlyExpenses)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">Est. Savings/yr</p>
              <p className={`font-[family-name:var(--font-fraunces)] text-lg font-bold ${
                city.annualSavings >= 0 ? 'text-green' : 'text-red'
              }`}>
                {formatCurrency(city.annualSavings)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">Tax Rate</p>
              <div className="flex items-center gap-2">
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-bold text-navy">
                  {Math.round(city.taxRate * 100)}%
                </p>
                {city.taxFree && (
                  <span className="text-[10px] font-bold uppercase bg-green/10 text-green px-1.5 py-0.5 rounded">
                    Tax-Free
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <p className="text-[10px] uppercase tracking-wider text-navy/35 mb-1">Int&apos;l Schools</p>
              <p className="font-[family-name:var(--font-fraunces)] text-lg font-bold text-navy">
                {city.schoolCount}
              </p>
            </div>
          </div>

          {/* Quality Scores */}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/40 mb-4">Quality Indicators</h3>
          <div className="flex gap-3 mb-8">
            {[
              { label: 'Quality of Life', value: city.qualityOfLife },
              { label: 'Safety', value: city.safetyScore },
              { label: 'Healthcare', value: city.healthcareScore },
            ].map((item) => (
              <div key={item.label} className="flex-1 bg-white rounded-xl p-3 border border-sand-dark/10 text-center">
                <p className="font-[family-name:var(--font-fraunces)] text-xl font-bold text-navy">
                  {item.value}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-navy/35 mt-0.5">{item.label}</p>
                <p className="text-[9px] text-navy/25">/ 10</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/analyze"
            className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-dark text-navy px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-gold/20"
          >
            Analyze a package in {city.city}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
