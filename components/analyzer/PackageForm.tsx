'use client';

import { useState, useMemo } from 'react';
import type { PackageInput, PackageReport } from '@/data/types';
import { cities } from '@/data/cities';
import { countries } from '@/data/countries';

const STEPS = [
  { label: 'School', icon: '01' },
  { label: 'Compensation', icon: '02' },
  { label: 'Benefits', icon: '03' },
  { label: 'Other', icon: '04' },
];

const CURRENCY_OPTIONS = [
  'USD', 'EUR', 'GBP', 'AED', 'QAR', 'SAR', 'KWD', 'OMR',
  'SGD', 'HKD', 'THB', 'MYR', 'VND', 'IDR', 'CNY', 'KRW',
  'JPY', 'CHF', 'CZK', 'EGP', 'KES', 'NGN', 'COP', 'MXN',
  'BRL', 'INR', 'AUD',
];

const ROLE_LABELS: Record<string, string> = {
  classroom_teacher: 'Classroom Teacher',
  head_of_department: 'Head of Department',
  senior_leader: 'Senior Leader',
  principal: 'Principal / Head of School',
};

interface Props {
  onComplete: (report: PackageReport) => void;
}

const defaultInput: PackageInput = {
  country: '',
  city: '',
  curriculumType: 'IB',
  role: 'classroom_teacher',
  baseSalaryAmount: 0,
  baseSalaryCurrency: 'USD',
  housingType: 'allowance',
  housingAllowanceAmount: 0,
  housingAllowanceCurrency: 'USD',
  housingEstimatedValue: 0,
  annualFlights: 1,
  flightClass: 'economy',
  relocationAllowanceUSD: 0,
  healthInsurance: 'full_family',
  tuitionRemissionPercent: 100,
  numberOfKids: 0,
  contractLengthYears: 2,
  endOfContractBonusUSD: 0,
  pensionContributionPercent: 0,
  shippingAllowanceUSD: 0,
  settlingInGrantUSD: 0,
  pdBudgetUSD: 0,
  utilitiesCovered: false,
};

export default function PackageForm({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<PackageInput>(defaultInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof PackageInput>(key: K, value: PackageInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const filteredCities = useMemo(() => {
    if (!input.country) return cities;
    return cities.filter((c) => c.country === input.country);
  }, [input.country]);

  // Auto-set currency when country changes
  const handleCountryChange = (country: string) => {
    update('country', country);
    update('city', '');
    const countryData = countries.find((c) => c.name === country);
    if (countryData) {
      update('baseSalaryCurrency', countryData.currencyCode);
      update('housingAllowanceCurrency', countryData.currencyCode);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const report: PackageReport = await res.json();
      onComplete(report);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canAdvance = () => {
    if (step === 0) return input.country && input.city;
    if (step === 1) return input.baseSalaryAmount > 0;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1 last:flex-initial">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2.5 progress-step ${
                i === step ? 'opacity-100' : i < step ? 'opacity-60 cursor-pointer' : 'opacity-25'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? 'bg-gold text-navy' : 'bg-sand-dark/20 text-navy/40'
              }`}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : s.icon}
              </span>
              <span className="text-sm font-medium text-navy hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-gold/40' : 'bg-sand-dark/15'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 p-8 shadow-sm">
        {/* Step 1: School Info */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-navy mb-1">School Information</h3>
              <p className="text-sm text-navy/40">Where is the position located?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Country</label>
                <select
                  className="form-select"
                  value={input.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  <option value="">Select country...</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.flagEmoji} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">City</label>
                <select
                  className="form-select"
                  value={input.city}
                  onChange={(e) => update('city', e.target.value)}
                >
                  <option value="">Select city...</option>
                  {filteredCities.map((c) => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Curriculum</label>
                <select
                  className="form-select"
                  value={input.curriculumType}
                  onChange={(e) => update('curriculumType', e.target.value as PackageInput['curriculumType'])}
                >
                  <option value="IB">IB (International Baccalaureate)</option>
                  <option value="British">British Curriculum</option>
                  <option value="American">American Curriculum</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Role</label>
                <select
                  className="form-select"
                  value={input.role}
                  onChange={(e) => update('role', e.target.value as PackageInput['role'])}
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Compensation */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-navy mb-1">Compensation</h3>
              <p className="text-sm text-navy/40">Base salary, housing, and flights.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Annual Base Salary</label>
              <div className="flex gap-3">
                <select
                  className="form-select !w-28 shrink-0"
                  value={input.baseSalaryCurrency}
                  onChange={(e) => update('baseSalaryCurrency', e.target.value)}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 55000"
                  value={input.baseSalaryAmount || ''}
                  onChange={(e) => update('baseSalaryAmount', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Housing</label>
              <div className="flex gap-2 mb-3">
                {(['allowance', 'provided', 'none'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => update('housingType', type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      input.housingType === type
                        ? 'bg-navy text-sand-light'
                        : 'bg-sand-dark/10 text-navy/50 hover:bg-sand-dark/20'
                    }`}
                  >
                    {type === 'allowance' ? 'Allowance' : type === 'provided' ? 'Provided' : 'Not included'}
                  </button>
                ))}
              </div>
              {input.housingType === 'allowance' && (
                <div className="flex gap-3">
                  <select
                    className="form-select !w-28 shrink-0"
                    value={input.housingAllowanceCurrency}
                    onChange={(e) => update('housingAllowanceCurrency', e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Annual housing allowance"
                    value={input.housingAllowanceAmount || ''}
                    onChange={(e) => update('housingAllowanceAmount', Number(e.target.value))}
                  />
                </div>
              )}
              {input.housingType === 'provided' && (
                <input
                  type="number"
                  className="form-input"
                  placeholder="Estimated annual value in USD"
                  value={input.housingEstimatedValue || ''}
                  onChange={(e) => update('housingEstimatedValue', Number(e.target.value))}
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Annual Return Flights</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="10"
                  value={input.annualFlights}
                  onChange={(e) => update('annualFlights', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Flight Class</label>
                <select
                  className="form-select"
                  value={input.flightClass}
                  onChange={(e) => update('flightClass', e.target.value as 'economy' | 'business')}
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Benefits */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-navy mb-1">Benefits</h3>
              <p className="text-sm text-navy/40">Insurance, tuition, contract terms.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Health Insurance</label>
              <select
                className="form-select"
                value={input.healthInsurance}
                onChange={(e) => update('healthInsurance', e.target.value as PackageInput['healthInsurance'])}
              >
                <option value="full_family">Full Family Coverage</option>
                <option value="individual">Individual Only</option>
                <option value="partial">Partial Coverage</option>
                <option value="none">Not Included</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Tuition Remission %</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="100"
                  value={input.tuitionRemissionPercent}
                  onChange={(e) => update('tuitionRemissionPercent', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Number of Kids</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="10"
                  value={input.numberOfKids}
                  onChange={(e) => update('numberOfKids', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Contract Length (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="5"
                  value={input.contractLengthYears}
                  onChange={(e) => update('contractLengthYears', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">End of Contract Bonus (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000"
                  value={input.endOfContractBonusUSD || ''}
                  onChange={(e) => update('endOfContractBonusUSD', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Pension Contribution %</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="30"
                placeholder="School's contribution %, e.g. 5"
                value={input.pensionContributionPercent || ''}
                onChange={(e) => update('pensionContributionPercent', Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Step 4: Other */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-navy mb-1">Additional Benefits</h3>
              <p className="text-sm text-navy/40">Relocation, professional development, and extras.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Relocation Allowance (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 3000"
                  value={input.relocationAllowanceUSD || ''}
                  onChange={(e) => update('relocationAllowanceUSD', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Shipping Allowance (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2000"
                  value={input.shippingAllowanceUSD || ''}
                  onChange={(e) => update('shippingAllowanceUSD', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Settling-in Grant (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 1000"
                  value={input.settlingInGrantUSD || ''}
                  onChange={(e) => update('settlingInGrantUSD', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">PD Budget (USD/year)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 1500"
                  value={input.pdBudgetUSD || ''}
                  onChange={(e) => update('pdBudgetUSD', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    input.utilitiesCovered ? 'bg-green' : 'bg-sand-dark/25'
                  }`}
                  onClick={() => update('utilitiesCovered', !input.utilitiesCovered)}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    input.utilitiesCovered ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`} />
                </div>
                <span className="text-sm font-medium text-navy">Utilities covered by school</span>
              </label>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red/5 border border-red/20 rounded-lg text-sm text-red">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-sand-dark/10">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-sm font-medium text-navy/50 hover:text-navy transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-30 disabled:cursor-not-allowed text-sand-light px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-50 text-navy px-7 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Package
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
