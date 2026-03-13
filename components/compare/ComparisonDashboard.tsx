'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Scenario } from '@/data/types';
import { projectWealth, findCrossoverYear, estimateMovingCosts, formatCurrency } from '@/lib/calculations';
import ScenarioInput from './ScenarioInput';

const COLORS = ['#D4A853', '#1A8A7D', '#6B8CAE', '#C4956A'];

function createScenario(id: string, label: string, isCurrentSituation = false): Scenario {
  return {
    id,
    label,
    city: '',
    country: '',
    annualIncomeUSD: 0,
    annualExpensesUSD: 0,
    taxRate: 0,
    annualSavingsUSD: 0,
    isCurrentSituation,
  };
}

export default function ComparisonDashboard() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    createScenario('current', 'Current Situation', true),
    createScenario('option-a', 'Option A'),
  ]);
  const [years, setYears] = useState(5);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [returnRate, setReturnRate] = useState(7);

  const updateScenario = (index: number, updated: Scenario) => {
    setScenarios((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const removeScenario = (index: number) => {
    setScenarios((prev) => prev.filter((_, i) => i !== index));
  };

  const addScenario = () => {
    const id = `option-${String.fromCharCode(65 + scenarios.length - 1).toLowerCase()}`;
    const label = `Option ${String.fromCharCode(65 + scenarios.length - 1)}`;
    setScenarios((prev) => [...prev, createScenario(id, label)]);
  };

  // Calculate projections
  const projections = useMemo(() => {
    return scenarios.map((s) =>
      projectWealth(s, years, currentSavings, returnRate / 100),
    );
  }, [scenarios, years, currentSavings, returnRate]);

  // Chart data
  const chartData = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, yearIdx) => {
      const point: Record<string, number | string> = { year: `Year ${yearIdx}` };
      scenarios.forEach((s, i) => {
        const movingCost = s.isCurrentSituation ? 0 : estimateMovingCosts(
          scenarios[0]?.city || '',
          s.city,
        );
        point[s.label] = Math.round(projections[i][yearIdx] - (yearIdx === 0 ? 0 : 0) - (s.isCurrentSituation ? 0 : movingCost));
      });
      return point;
    });
  }, [scenarios, projections, years]);

  // Crossover analysis
  const crossovers = useMemo(() => {
    if (scenarios.length < 2 || !projections[0]) return [];
    return scenarios.slice(1).map((s, i) => {
      const movingCost = estimateMovingCosts(scenarios[0]?.city || '', s.city);
      const crossYear = findCrossoverYear(projections[0], projections[i + 1], movingCost);
      return { label: s.label, crossYear, movingCost };
    });
  }, [scenarios, projections]);

  // Find best scenario
  const bestScenario = useMemo(() => {
    if (projections.length === 0) return null;
    let bestIdx = 0;
    let bestFinal = -Infinity;
    projections.forEach((p, i) => {
      const movingCost = scenarios[i].isCurrentSituation ? 0 : estimateMovingCosts(
        scenarios[0]?.city || '',
        scenarios[i].city,
      );
      const finalWealth = p[p.length - 1] - movingCost;
      if (finalWealth > bestFinal) {
        bestFinal = finalWealth;
        bestIdx = i;
      }
    });
    return { ...scenarios[bestIdx], finalWealth: bestFinal };
  }, [projections, scenarios]);

  const hasData = scenarios.some((s) => s.annualIncomeUSD > 0 && s.city);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {scenarios.map((s, i) => (
          <ScenarioInput
            key={s.id}
            scenario={s}
            onChange={(updated) => updateScenario(i, updated)}
            onRemove={i > 1 ? () => removeScenario(i) : undefined}
            index={i}
          />
        ))}
        {scenarios.length < 4 && (
          <button
            onClick={addScenario}
            className="bg-white/50 border-2 border-dashed border-sand-dark/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-navy/30 hover:text-navy/50 hover:border-gold/30 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium">Add Scenario</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
              Time Horizon: {years} years
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="flex justify-between text-[10px] text-navy/30 mt-1">
              <span>1 year</span>
              <span>10 years</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Current Savings (USD)</label>
            <input
              type="number"
              className="form-input text-sm"
              value={currentSavings || ''}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
              Expected Return: {returnRate}%
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="flex justify-between text-[10px] text-navy/30 mt-1">
              <span>0%</span>
              <span>12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {hasData && (
        <>
          <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
            <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy mb-6">
              Wealth Projection
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B8" opacity={0.5} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: '#0F2B46', opacity: 0.4 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E8D9B8' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#0F2B46', opacity: 0.4 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{
                      background: '#0F2B46',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F5ECD7',
                      fontSize: '13px',
                    }}
                    labelStyle={{ color: '#D4A853', fontWeight: 600 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                  />
                  {scenarios.map((s, i) => (
                    <Line
                      key={s.id}
                      type="monotone"
                      dataKey={s.label}
                      stroke={COLORS[i]}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: COLORS[i] }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crossover Analysis */}
          {crossovers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {crossovers.map((c) => (
                <div key={c.label} className="bg-white rounded-2xl border border-sand-dark/15 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy/40 mb-2">{c.label} vs Current</p>
                  {c.crossYear !== null ? (
                    <p className="text-sm text-navy/70">
                      <span className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-teal">{c.crossYear}</span>{' '}
                      {c.crossYear === 1 ? 'year' : 'years'} to break even
                      <span className="text-navy/40 block text-xs mt-1">
                        Including {formatCurrency(c.movingCost)} estimated moving costs
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-navy/50">
                      Does not overtake current situation within {years} years
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Verdict */}
          {bestScenario && (
            <div className="bg-navy rounded-2xl p-6 text-center noise-bg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  Best Option Over {years} Years
                </p>
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-sand-light mb-1">
                  {bestScenario.label}
                </p>
                <p className="text-sand-dark/40 text-sm">
                  Projected wealth: <span className="text-gold font-semibold">{formatCurrency(bestScenario.finalWealth)}</span>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!hasData && (
        <div className="bg-white/50 rounded-2xl border-2 border-dashed border-sand-dark/15 p-16 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-4 text-navy/15">
            <path d="M24 8V40M8 24H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
          </svg>
          <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy/30 mb-2">
            Enter scenario details to see projections
          </p>
          <p className="text-sm text-navy/20">
            Fill in at least one scenario with a city and income to generate the comparison chart.
          </p>
        </div>
      )}
    </div>
  );
}
