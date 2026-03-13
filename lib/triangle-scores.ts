import type { CityData, SalaryRange } from '@/data/types';
import { cities } from '@/data/cities';
import { salaryRanges } from '@/data/salary-ranges';
import { taxRates } from '@/data/tax-rates';
import { countries } from '@/data/countries';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ScoredCity {
  city: string;
  country: string;
  region: string;
  flagEmoji: string;
  schoolScore: number;
  livabilityScore: number;
  savingsScore: number;
  fitScore: number;
  // Raw data for tooltips/detail panel
  medianSalary: number;
  typicalHousing: number;
  taxRate: number;
  taxFree: boolean;
  monthlyExpenses: number;
  schoolCount: number;
  qualityOfLife: number;
  safetyScore: number;
  healthcareScore: number;
  annualSavings: number;
}

export interface TriangleWeights {
  school: number;
  livability: number;
  savings: number;
}

export type RoleType = 'classroom_teacher' | 'head_of_department' | 'senior_leader' | 'principal';
export type CurriculumFilter = 'IB' | 'British' | 'All';
export type FamilyStatus = 'single' | 'family';

// ── Region fallback map ────────────────────────────────────────────────────────
// Some city regions don't have direct salary data matches
const REGION_FALLBACKS: Record<string, string[]> = {
  'Central America': ['South America'],
  Oceania: ['East Asia', 'Southeast Asia'],
};

// ── Normalization ──────────────────────────────────────────────────────────────

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ── School Quality Score (0-100) ───────────────────────────────────────────────
// 50% school count + 25% quality of life + 25% healthcare

export function computeSchoolQualityScore(city: CityData): number {
  const schoolCountNorm = normalize(city.internationalSchoolCount, 20, 170);
  const qolNorm = normalize(city.qualityOfLifeScore, 1, 10);
  const healthNorm = normalize(city.healthcareScore, 1, 10);
  return Math.round((schoolCountNorm * 0.5 + qolNorm * 0.25 + healthNorm * 0.25) * 100);
}

// ── City Livability Score (0-100) ──────────────────────────────────────────────
// 35% quality of life + 25% safety + 20% healthcare + 20% inverted cost of living

export function computeLivabilityScore(city: CityData): number {
  const qolNorm = normalize(city.qualityOfLifeScore, 1, 10);
  const safetyNorm = normalize(city.safetyScore, 1, 10);
  const healthNorm = normalize(city.healthcareScore, 1, 10);
  const invertedCOL = 1 - normalize(city.costOfLivingIndex, 25, 130);
  return Math.round(
    (qolNorm * 0.35 + safetyNorm * 0.25 + healthNorm * 0.2 + invertedCOL * 0.2) * 100,
  );
}

// ── Find best salary match ─────────────────────────────────────────────────────

function findSalaryMatch(
  region: string,
  role: RoleType,
  curriculum: CurriculumFilter,
): SalaryRange | null {
  const regionsToTry = [region, ...(REGION_FALLBACKS[region] || [])];

  for (const r of regionsToTry) {
    // Try exact curriculum match first
    if (curriculum !== 'All') {
      const exact = salaryRanges.find(
        (s) => s.region === r && s.role === role && s.curriculumType === curriculum,
      );
      if (exact) return exact;
    }

    // Try IB first (most common), then British, then any
    for (const fallbackCurr of ['IB', 'British'] as const) {
      const match = salaryRanges.find(
        (s) => s.region === r && s.role === role && s.curriculumType === fallbackCurr,
      );
      if (match) return match;
    }

    // Any match for this region and role
    const any = salaryRanges.find((s) => s.region === r && s.role === role);
    if (any) return any;
  }

  // Last resort: any match for this role anywhere
  return salaryRanges.find((s) => s.role === role) || null;
}

// ── Compute raw annual savings for a city ──────────────────────────────────────

function computeRawSavings(
  city: CityData,
  role: RoleType,
  curriculum: CurriculumFilter,
  familyStatus: FamilyStatus,
): { savings: number; salary: SalaryRange | null } {
  const salary = findSalaryMatch(city.region, role, curriculum);
  if (!salary) return { savings: 0, salary: null };

  const grossAnnual = salary.medianUSD + salary.typicalHousingUSD;
  const tax = taxRates.find((t) => t.country === city.country);
  const effectiveTaxRate = tax ? tax.incomeTaxRate + tax.socialSecurityRate : 0.15;
  const netAnnual = grossAnnual * (1 - effectiveTaxRate);

  const annualExpenses =
    (familyStatus === 'single'
      ? city.monthlyExpensesSingleUSD
      : city.monthlyExpensesFamilyUSD) * 12;

  return { savings: netAnnual - annualExpenses, salary };
}

// ── Compute Fit Score ──────────────────────────────────────────────────────────

export function computeFitScore(
  schoolScore: number,
  livabilityScore: number,
  savingsScore: number,
  weights: TriangleWeights,
): number {
  const totalWeight = weights.school + weights.livability + weights.savings;
  if (totalWeight === 0) {
    // Equal weighting fallback
    return Math.round((schoolScore + livabilityScore + savingsScore) / 3);
  }
  return Math.round(
    (weights.school * schoolScore +
      weights.livability * livabilityScore +
      weights.savings * savingsScore) /
      totalWeight,
  );
}

// ── Main: Score all cities ─────────────────────────────────────────────────────

export function scoreAllCities(
  role: RoleType,
  curriculum: CurriculumFilter,
  familyStatus: FamilyStatus,
  weights: TriangleWeights,
): ScoredCity[] {
  // First pass: compute raw savings for all cities
  const rawData = cities.map((city) => {
    const schoolScore = computeSchoolQualityScore(city);
    const livabilityScore = computeLivabilityScore(city);
    const { savings, salary } = computeRawSavings(city, role, curriculum, familyStatus);
    const tax = taxRates.find((t) => t.country === city.country);
    const country = countries.find((c) => c.name === city.country);

    return {
      city,
      schoolScore,
      livabilityScore,
      rawSavings: savings,
      salary,
      tax,
      flagEmoji: country?.flagEmoji || '',
    };
  });

  // Second pass: normalize savings across all cities
  const savingsValues = rawData.map((d) => d.rawSavings);
  const minSavings = Math.min(...savingsValues);
  const maxSavings = Math.max(...savingsValues);

  return rawData.map((d) => {
    const savingsScore = Math.round(normalize(d.rawSavings, minSavings, maxSavings) * 100);
    const fitScore = computeFitScore(d.schoolScore, d.livabilityScore, savingsScore, weights);

    const monthlyExpenses =
      familyStatus === 'single'
        ? d.city.monthlyExpensesSingleUSD
        : d.city.monthlyExpensesFamilyUSD;

    return {
      city: d.city.city,
      country: d.city.country,
      region: d.city.region,
      flagEmoji: d.flagEmoji,
      schoolScore: d.schoolScore,
      livabilityScore: d.livabilityScore,
      savingsScore,
      fitScore,
      medianSalary: d.salary?.medianUSD || 0,
      typicalHousing: d.salary?.typicalHousingUSD || 0,
      taxRate: d.tax ? d.tax.incomeTaxRate + d.tax.socialSecurityRate : 0,
      taxFree: d.tax?.taxFree || false,
      monthlyExpenses,
      schoolCount: d.city.internationalSchoolCount,
      qualityOfLife: d.city.qualityOfLifeScore,
      safetyScore: d.city.safetyScore,
      healthcareScore: d.city.healthcareScore,
      annualSavings: d.rawSavings,
    };
  });
}

// ── Region colors ──────────────────────────────────────────────────────────────

export const REGION_COLORS: Record<string, string> = {
  'Middle East': '#D4A853',
  'East Asia': '#1a3d5c',
  'Southeast Asia': '#1A8A7D',
  Europe: '#0F2B46',
  Africa: '#C44536',
  'South America': '#2D8B4E',
  'Central America': '#2D8B4E',
  'South Asia': '#6B8CAE',
  Oceania: '#C4956A',
};

export const REGION_LABELS: Record<string, string> = {
  'Middle East': 'Middle East',
  'East Asia': 'East Asia',
  'Southeast Asia': 'SE Asia',
  Europe: 'Europe',
  Africa: 'Africa',
  'South America': 'S. America',
  'Central America': 'C. America',
  'South Asia': 'South Asia',
  Oceania: 'Oceania',
};
