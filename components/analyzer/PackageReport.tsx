'use client';

import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PackageReport as PackageReportType } from '@/data/types';
import { formatCurrency } from '@/lib/calculations';

const BREAKDOWN_COLORS: Record<string, string> = {
  'Base Salary': '#0F2B46',
  Housing: '#1A8A7D',
  Flights: '#D4A853',
  'Health Insurance': '#2D8B4E',
  Tuition: '#6B8CAE',
  'Bonus (Annual)': '#E8D9B8',
  'Other Benefits': '#C4956A',
};

const FLAG_STYLES = {
  green: { bg: 'bg-green/5', border: 'border-green/20', dot: 'bg-green', text: 'text-green' },
  yellow: { bg: 'bg-gold/5', border: 'border-gold/20', dot: 'bg-gold', text: 'text-gold-dark' },
  red: { bg: 'bg-red/5', border: 'border-red/20', dot: 'bg-red', text: 'text-red' },
};

interface Props {
  report: PackageReportType;
}

export default function PackageReport({ report }: Props) {
  const chartData = [
    { name: 'Base Salary', value: report.breakdown.baseSalaryUSD },
    { name: 'Housing', value: report.breakdown.housingValueUSD },
    { name: 'Flights', value: report.breakdown.flightsValueUSD },
    { name: 'Health Insurance', value: report.breakdown.healthInsuranceValueUSD },
    { name: 'Tuition', value: report.breakdown.tuitionValueUSD },
    { name: 'Bonus (Annual)', value: report.breakdown.bonusAnnualizedUSD },
    { name: 'Other Benefits', value: report.breakdown.otherBenefitsUSD },
  ].filter((d) => d.value > 0);

  const greenFlags = report.flags.filter((f) => f.type === 'green');
  const yellowFlags = report.flags.filter((f) => f.type === 'yellow');
  const redFlags = report.flags.filter((f) => f.type === 'red');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Hero Stats */}
      <div className="bg-navy rounded-2xl p-8 lg:p-10 mb-6 relative overflow-hidden noise-bg">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] compass-decoration opacity-20" />
        <div className="relative z-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Total Compensation</p>
          <div className="font-[family-name:var(--font-fraunces)] text-5xl lg:text-6xl font-bold text-sand-light mb-6">
            {formatCurrency(report.totalCompensationUSD)}
            <span className="text-sand-dark/30 text-2xl ml-2">/year</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-sand-dark/40 text-xs mb-1">Estimated Savings</p>
              <p className={`font-[family-name:var(--font-fraunces)] text-2xl font-bold ${
                report.estimatedAnnualSavingsUSD >= 0 ? 'text-green' : 'text-red'
              }`}>
                {formatCurrency(report.estimatedAnnualSavingsUSD)}
              </p>
              <p className="text-sand-dark/30 text-xs mt-1">per year</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-sand-dark/40 text-xs mb-1">Percentile</p>
              <p className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-gold">
                Top {100 - report.percentile}%
              </p>
              <p className="text-sand-dark/30 text-xs mt-1">for this region &amp; role</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5 col-span-2 lg:col-span-1">
              <p className="text-sand-dark/40 text-xs mb-1">Package Score</p>
              <div className="flex items-center gap-3">
                <span className="text-green text-lg font-bold">{greenFlags.length}</span>
                <span className="text-sand-dark/20">/</span>
                <span className="text-gold text-lg font-bold">{yellowFlags.length}</span>
                <span className="text-sand-dark/20">/</span>
                <span className="text-red text-lg font-bold">{redFlags.length}</span>
              </div>
              <p className="text-sand-dark/30 text-xs mt-1">green / caution / red flags</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Chart + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-sand-dark/15 p-6">
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy mb-4">Compensation Breakdown</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={BREAKDOWN_COLORS[entry.name] || '#E8D9B8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: '#0F2B46',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F5ECD7',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sand-dark/15 p-6">
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy mb-4">Value Breakdown</h3>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BREAKDOWN_COLORS[item.name] }} />
                  <span className="text-sm text-navy/70">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-navy tabular-nums">{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-sand-dark/10 flex items-center justify-between">
              <span className="text-sm font-bold text-navy">Total</span>
              <span className="text-sm font-bold text-navy tabular-nums">{formatCurrency(report.totalCompensationUSD)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
        <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy mb-4">Package Assessment</h3>

        {redFlags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red/70 mb-2">Red Flags</p>
            <div className="space-y-2">
              {redFlags.map((flag, i) => (
                <div key={i} className={`${FLAG_STYLES.red.bg} ${FLAG_STYLES.red.border} border rounded-xl p-4 flex items-start gap-3`}>
                  <div className={`w-2 h-2 ${FLAG_STYLES.red.dot} rounded-full mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-xs font-semibold text-red/80 mb-0.5">{flag.category}</p>
                    <p className="text-sm text-navy/70">{flag.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {yellowFlags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark/70 mb-2">Points to Consider</p>
            <div className="space-y-2">
              {yellowFlags.map((flag, i) => (
                <div key={i} className={`${FLAG_STYLES.yellow.bg} ${FLAG_STYLES.yellow.border} border rounded-xl p-4 flex items-start gap-3`}>
                  <div className={`w-2 h-2 ${FLAG_STYLES.yellow.dot} rounded-full mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-xs font-semibold text-gold-dark/80 mb-0.5">{flag.category}</p>
                    <p className="text-sm text-navy/70">{flag.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {greenFlags.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green/70 mb-2">Strengths</p>
            <div className="space-y-2">
              {greenFlags.map((flag, i) => (
                <div key={i} className={`${FLAG_STYLES.green.bg} ${FLAG_STYLES.green.border} border rounded-xl p-4 flex items-start gap-3`}>
                  <div className={`w-2 h-2 ${FLAG_STYLES.green.dot} rounded-full mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-xs font-semibold text-green/80 mb-0.5">{flag.category}</p>
                    <p className="text-sm text-navy/70">{flag.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Summary */}
      {report.aiSummary && (
        <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-teal">
              <path d="M9 2L10.5 6.5L15 5L11.5 9L15 13L10.5 11.5L9 16L7.5 11.5L3 13L6.5 9L3 5L7.5 6.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy">AI Analysis</h3>
          </div>
          <div className="text-sm text-navy/70 leading-relaxed space-y-3 prose-sm">
            {report.aiSummary.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Negotiation Tips */}
      {report.negotiationTips.length > 0 && (
        <div className="bg-gold/5 rounded-2xl border border-gold/15 p-6 mb-6">
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gold">
              <path d="M9 2V16M2 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Negotiation Tips
          </h3>
          <ul className="space-y-3">
            {report.negotiationTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-gold/15 rounded-full flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-navy/70 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-sand-light px-7 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          Compare This Package
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
