'use client';

import { useState, useMemo } from 'react';
import type { ScoredCity } from '@/lib/triangle-scores';
import { REGION_COLORS } from '@/lib/triangle-scores';
import { formatCurrency } from '@/lib/calculations';

type SortColumn = 'fitScore' | 'schoolScore' | 'livabilityScore' | 'savingsScore' | 'annualSavings';

interface Props {
  cities: ScoredCity[];
  onCityClick: (city: ScoredCity) => void;
}

const COLUMNS: { key: SortColumn; label: string; shortLabel: string; hideOnMobile?: boolean }[] = [
  { key: 'fitScore', label: 'Fit Score', shortLabel: 'Fit' },
  { key: 'schoolScore', label: 'School', shortLabel: 'School', hideOnMobile: true },
  { key: 'livabilityScore', label: 'Livability', shortLabel: 'Live', hideOnMobile: true },
  { key: 'savingsScore', label: 'Savings Score', shortLabel: 'Save', hideOnMobile: true },
  { key: 'annualSavings', label: 'Est. Savings/yr', shortLabel: 'Savings' },
];

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-sand-dark/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums w-7 text-right">{value}</span>
    </div>
  );
}

export default function RankingTable({ cities, onCityClick }: Props) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('fitScore');
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...cities];
    arr.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      return sortDesc ? bVal - aVal : aVal - bVal;
    });
    return arr;
  }, [cities, sortColumn, sortDesc]);

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortColumn(col);
      setSortDesc(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-dark/15 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy">
          City Rankings
        </h3>
        <p className="text-xs text-navy/35 mt-1">
          Ranked by your weighted priorities. Click any city for details.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-sand-dark/10">
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-navy/40 px-6 py-3 w-10">
                #
              </th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-navy/40 px-4 py-3">
                City
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-[10px] font-semibold uppercase tracking-wider text-navy/40 px-4 py-3 cursor-pointer hover:text-navy/70 transition-colors select-none ${
                    col.hideOnMobile ? 'hidden lg:table-cell' : ''
                  }`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">{col.label}</span>
                    <span className="sm:hidden">{col.shortLabel}</span>
                    {sortColumn === col.key && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                        <path
                          d={sortDesc ? 'M2 3L5 7L8 3' : 'M2 7L5 3L8 7'}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((city, i) => (
              <tr
                key={city.city}
                onClick={() => onCityClick(city)}
                className="border-b border-sand-dark/5 hover:bg-gold/[0.03] cursor-pointer transition-colors group"
              >
                <td className="px-6 py-3 text-navy/30 text-xs font-medium tabular-nums">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: REGION_COLORS[city.region] }}
                    />
                    <div>
                      <span className="font-medium text-navy group-hover:text-gold-dark transition-colors">
                        {city.flagEmoji} {city.city}
                      </span>
                      <span className="text-navy/30 text-xs ml-1.5 hidden sm:inline">{city.country}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-10 h-7 bg-gold/10 text-gold-dark text-xs font-bold rounded-md tabular-nums">
                    {city.fitScore}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell min-w-[120px]">
                  <ScoreBar value={city.schoolScore} color="#1A8A7D" />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell min-w-[120px]">
                  <ScoreBar value={city.livabilityScore} color="#0F2B46" />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell min-w-[120px]">
                  <ScoreBar value={city.savingsScore} color="#D4A853" />
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold tabular-nums ${
                    city.annualSavings >= 0 ? 'text-green' : 'text-red'
                  }`}>
                    {formatCurrency(city.annualSavings)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
