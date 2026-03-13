'use client';

import { useEffect } from 'react';
import type { Scenario } from '@/data/types';
import { cities } from '@/data/cities';
import { countries } from '@/data/countries';
import { taxRates } from '@/data/tax-rates';
import { calculateAnnualSavings, formatCurrency } from '@/lib/calculations';

interface Props {
  scenario: Scenario;
  onChange: (s: Scenario) => void;
  onRemove?: () => void;
  index: number;
}

const SCENARIO_COLORS = ['#D4A853', '#1A8A7D', '#6B8CAE', '#C4956A'];

export default function ScenarioInput({ scenario, onChange, onRemove, index }: Props) {
  const update = <K extends keyof Scenario>(key: K, value: Scenario[K]) => {
    onChange({ ...scenario, [key]: value });
  };

  // Auto-populate expenses and tax when city/country changes
  useEffect(() => {
    if (scenario.city) {
      const cityData = cities.find((c) => c.city === scenario.city);
      if (cityData) {
        const country = cityData.country;
        const tax = taxRates.find((t) => t.country === country);
        const expenses = cityData.monthlyExpensesSingleUSD * 12;
        onChange({
          ...scenario,
          country,
          annualExpensesUSD: expenses,
          taxRate: tax ? tax.incomeTaxRate + tax.socialSecurityRate : 0.15,
          annualSavingsUSD: calculateAnnualSavings(
            scenario.annualIncomeUSD,
            expenses,
            tax ? tax.incomeTaxRate + tax.socialSecurityRate : 0.15,
          ),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.city]);

  // Recalculate savings on income/expense/tax change
  useEffect(() => {
    const savings = calculateAnnualSavings(
      scenario.annualIncomeUSD,
      scenario.annualExpensesUSD,
      scenario.taxRate,
    );
    if (savings !== scenario.annualSavingsUSD) {
      update('annualSavingsUSD', savings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.annualIncomeUSD, scenario.annualExpensesUSD, scenario.taxRate]);

  const accentColor = SCENARIO_COLORS[index % SCENARIO_COLORS.length];

  return (
    <div className="bg-white rounded-2xl border border-sand-dark/15 p-5 relative">
      {/* Color accent bar */}
      <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full" style={{ backgroundColor: accentColor }} />

      <div className="flex items-center justify-between mb-4 mt-1">
        <input
          type="text"
          value={scenario.label}
          onChange={(e) => update('label', e.target.value)}
          className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-navy bg-transparent border-none outline-none w-full"
          placeholder="Scenario name..."
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-navy/20 hover:text-red transition-colors p-1 shrink-0"
            title="Remove scenario"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-navy/40 mb-1.5">City</label>
          <select
            className="form-select text-sm !py-2.5"
            value={scenario.city}
            onChange={(e) => update('city', e.target.value)}
          >
            <option value="">Select city...</option>
            {cities.map((c) => {
              const country = countries.find((co) => co.name === c.country);
              return (
                <option key={c.city} value={c.city}>
                  {country?.flagEmoji} {c.city}, {c.country}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-navy/40 mb-1.5">Annual Income (USD)</label>
          <input
            type="number"
            className="form-input text-sm !py-2.5"
            placeholder="e.g. 55000"
            value={scenario.annualIncomeUSD || ''}
            onChange={(e) => update('annualIncomeUSD', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-navy/40 mb-1.5">
            Annual Expenses (USD)
            {scenario.city && <span className="text-teal/60 normal-case tracking-normal ml-1">auto-populated</span>}
          </label>
          <input
            type="number"
            className="form-input text-sm !py-2.5"
            value={scenario.annualExpensesUSD || ''}
            onChange={(e) => update('annualExpensesUSD', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-navy/40 mb-1.5">
            Effective Tax Rate
            {scenario.city && <span className="text-teal/60 normal-case tracking-normal ml-1">auto-populated</span>}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="form-input text-sm !py-2.5"
              min="0"
              max="60"
              step="0.5"
              value={Math.round(scenario.taxRate * 100) || ''}
              onChange={(e) => update('taxRate', Number(e.target.value) / 100)}
            />
            <span className="text-navy/40 text-sm">%</span>
          </div>
        </div>

        {/* Savings result */}
        <div className={`rounded-xl p-3 ${scenario.annualSavingsUSD >= 0 ? 'bg-green/5' : 'bg-red/5'}`}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-navy/40 mb-1">Est. Annual Savings</p>
          <p className={`font-[family-name:var(--font-fraunces)] text-xl font-bold ${
            scenario.annualSavingsUSD >= 0 ? 'text-green' : 'text-red'
          }`}>
            {formatCurrency(scenario.annualSavingsUSD)}
          </p>
        </div>
      </div>
    </div>
  );
}
