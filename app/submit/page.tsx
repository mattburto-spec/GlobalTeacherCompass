'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const REGIONS = [
  'Middle East', 'East Asia', 'Southeast Asia', 'Europe',
  'Africa', 'South America', 'Central America', 'South Asia', 'Oceania',
];

const ROLES = [
  { value: 'classroom_teacher', label: 'Classroom Teacher' },
  { value: 'head_of_department', label: 'Head of Department' },
  { value: 'senior_leader', label: 'Senior Leader' },
  { value: 'principal', label: 'Principal / Head of School' },
];

const CURRICULA = ['IB', 'British', 'American', 'Other'];

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'AED', 'QAR', 'SAR', 'SGD', 'HKD',
  'THB', 'MYR', 'CNY', 'JPY', 'KRW', 'INR', 'AUD', 'CHF',
];

export default function SubmitSalaryPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [form, setForm] = useState({
    city: '',
    country: '',
    region: '',
    role: 'classroom_teacher',
    curriculum: 'IB',
    yearsExperience: '',
    salaryAmount: '',
    salaryCurrency: 'USD',
    housingType: 'none',
    housingValueUsd: '',
    flightsCount: '',
    tuitionRemissionPercent: '',
    healthInsurance: 'none',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          salaryAmount: Number(form.salaryAmount) || 0,
          yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
          housingValueUsd: form.housingValueUsd ? Number(form.housingValueUsd) : undefined,
          flightsCount: form.flightsCount ? Number(form.flightsCount) : undefined,
          tuitionRemissionPercent: form.tuitionRemissionPercent ? Number(form.tuitionRemissionPercent) : undefined,
        }),
      });

      const data = await res.json();
      setResult({
        success: res.ok,
        message: data.message || data.error || 'Something went wrong',
      });
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--warm-sand)] pt-24 pb-20">
          <div className="max-w-2xl mx-auto px-6">
            <div className={`rounded-2xl p-8 text-center ${result.success ? 'bg-[#2D8B4E]/10 border border-[#2D8B4E]/30' : 'bg-[#C44536]/10 border border-[#C44536]/30'}`}>
              <div className="text-4xl mb-4">{result.success ? '✓' : '✗'}</div>
              <h2 className="text-2xl font-[family-name:var(--font-fraunces)] text-[var(--deep-navy)] mb-3">
                {result.success ? 'Submission Received' : 'Submission Failed'}
              </h2>
              <p className="text-[var(--deep-navy)]/70">{result.message}</p>
              <button
                onClick={() => { setResult(null); setStep(1); setForm(prev => ({ ...prev })); }}
                className="mt-6 px-6 py-3 bg-[var(--deep-navy)] text-white rounded-xl hover:bg-[var(--deep-navy)]/90 transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--warm-sand)] pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-fraunces)] text-[var(--deep-navy)] mb-3">
              Share Your Package
            </h1>
            <p className="text-[var(--deep-navy)]/60">
              Help fellow teachers by anonymously sharing your compensation data. All submissions are verified and aggregated.
            </p>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-colors ${
                  s === step ? 'bg-[var(--compass-gold)]' : s < step ? 'bg-[var(--deep-navy)]' : 'bg-[var(--deep-navy)]/20'
                }`}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-[family-name:var(--font-fraunces)] text-[var(--deep-navy)] mb-4">
                  Location & Role
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => updateField('city', e.target.value)}
                      placeholder="e.g. Dubai"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Country</label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={e => updateField('country', e.target.value)}
                      placeholder="e.g. UAE"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Region</label>
                  <select
                    value={form.region}
                    onChange={e => updateField('region', e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                  >
                    <option value="">Select region...</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={e => updateField('role', e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    >
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Curriculum</label>
                    <select
                      value={form.curriculum}
                      onChange={e => updateField('curriculum', e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    >
                      {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={form.yearsExperience}
                    onChange={e => updateField('yearsExperience', e.target.value)}
                    placeholder="Optional"
                    min="0"
                    max="40"
                    className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!form.region || !form.role}
                  className="w-full py-3 bg-[var(--compass-gold)] text-[var(--deep-navy)] font-semibold rounded-xl hover:bg-[var(--compass-gold)]/90 transition-colors disabled:opacity-40"
                >
                  Next: Compensation
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-[family-name:var(--font-fraunces)] text-[var(--deep-navy)] mb-4">
                  Compensation
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Annual Salary</label>
                    <input
                      type="number"
                      value={form.salaryAmount}
                      onChange={e => updateField('salaryAmount', e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Currency</label>
                    <select
                      value={form.salaryCurrency}
                      onChange={e => updateField('salaryCurrency', e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Housing</label>
                    <select
                      value={form.housingType}
                      onChange={e => updateField('housingType', e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    >
                      <option value="none">Not provided</option>
                      <option value="provided">Accommodation provided</option>
                      <option value="allowance">Housing allowance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Housing Value (USD/yr)</label>
                    <input
                      type="number"
                      value={form.housingValueUsd}
                      onChange={e => updateField('housingValueUsd', e.target.value)}
                      placeholder="Estimated annual value"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-[var(--deep-navy)]/20 text-[var(--deep-navy)] rounded-xl hover:bg-[var(--deep-navy)]/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.salaryAmount}
                    className="flex-1 py-3 bg-[var(--compass-gold)] text-[var(--deep-navy)] font-semibold rounded-xl hover:bg-[var(--compass-gold)]/90 transition-colors disabled:opacity-40"
                  >
                    Next: Benefits
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-[family-name:var(--font-fraunces)] text-[var(--deep-navy)] mb-4">
                  Benefits
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Annual Flights</label>
                    <input
                      type="number"
                      value={form.flightsCount}
                      onChange={e => updateField('flightsCount', e.target.value)}
                      placeholder="Return flights/yr"
                      min="0"
                      max="10"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Tuition Remission %</label>
                    <input
                      type="number"
                      value={form.tuitionRemissionPercent}
                      onChange={e => updateField('tuitionRemissionPercent', e.target.value)}
                      placeholder="0-100"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)]/70 mb-1">Health Insurance</label>
                  <select
                    value={form.healthInsurance}
                    onChange={e => updateField('healthInsurance', e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--deep-navy)]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--compass-gold)] bg-[var(--warm-sand)]/50"
                  >
                    <option value="none">Not provided</option>
                    <option value="individual">Individual only</option>
                    <option value="partial">Partial coverage</option>
                    <option value="full_family">Full family</option>
                  </select>
                </div>

                <div className="bg-[var(--warm-sand)]/80 rounded-xl p-4 text-sm text-[var(--deep-navy)]/60">
                  Your submission is completely anonymous. We never store IP addresses or personal information.
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-[var(--deep-navy)]/20 text-[var(--deep-navy)] rounded-xl hover:bg-[var(--deep-navy)]/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 bg-[var(--compass-gold)] text-[var(--deep-navy)] font-semibold rounded-xl hover:bg-[var(--compass-gold)]/90 transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Package Data'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
