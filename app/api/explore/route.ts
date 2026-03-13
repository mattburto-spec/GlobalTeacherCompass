import { NextResponse } from 'next/server';
import { getCityProfiles, getSalaryRanges, getTaxRates } from '@/lib/data-service';
import type { CityData, SalaryRange, TaxRate } from '@/data/types';

export const dynamic = 'force-dynamic';

interface ScoredCity {
  city: string;
  country: string;
  region: string;
  flagEmoji: string;
  schoolScore: number;
  livabilityScore: number;
  savingsScore: number;
  fitScore: number;
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

interface TriangleWeights {
  school: number;
  livability: number;
  savings: number;
}

type RoleType = 'classroom_teacher' | 'head_of_department' | 'senior_leader' | 'principal';
type FamilyStatus = 'single' | 'family';

const REGION_FALLBACKS: Record<string, string> = {
  'Central America': 'South America',
  'Oceania': 'East Asia',
  'Central Asia': 'South Asia',
};

function findSalaryMatch(
  allRanges: SalaryRange[],
  region: string,
  role: RoleType,
  curriculum: string,
): SalaryRange | undefined {
  // Exact match
  let match = allRanges.find(
    s => s.region === region && s.role === role && s.curriculumType === curriculum,
  );
  if (match) return match;

  // Try IB
  match = allRanges.find(s => s.region === region && s.role === role && s.curriculumType === 'IB');
  if (match) return match;

  // Try British
  match = allRanges.find(s => s.region === region && s.role === role && s.curriculumType === 'British');
  if (match) return match;

  // Any curriculum
  match = allRanges.find(s => s.region === region && s.role === role);
  if (match) return match;

  // Region fallback
  const fallback = REGION_FALLBACKS[region];
  if (fallback) {
    return findSalaryMatch(allRanges, fallback, role, curriculum);
  }

  // Any role in region
  match = allRanges.find(s => s.region === region);
  return match;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function computeSchoolScore(city: CityData): number {
  const schoolNorm = normalize(city.internationalSchoolCount, 20, 170);
  const qolNorm = (city.qualityOfLifeScore / 10) * 100;
  const healthNorm = (city.healthcareScore / 10) * 100;
  return schoolNorm * 0.5 + qolNorm * 0.25 + healthNorm * 0.25;
}

function computeLivabilityScore(city: CityData): number {
  const qolNorm = (city.qualityOfLifeScore / 10) * 100;
  const safetyNorm = (city.safetyScore / 10) * 100;
  const healthNorm = (city.healthcareScore / 10) * 100;
  const colInverted = normalize(130 - city.costOfLivingIndex, 0, 130);
  return qolNorm * 0.35 + safetyNorm * 0.25 + healthNorm * 0.2 + colInverted * 0.2;
}

function computeFitScore(
  school: number,
  livability: number,
  savings: number,
  weights: TriangleWeights,
): number {
  const total = weights.school + weights.livability + weights.savings;
  if (total === 0) return (school + livability + savings) / 3;
  return (
    (school * weights.school + livability * weights.livability + savings * weights.savings) / total
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get('role') || 'classroom_teacher') as RoleType;
  const curriculum = searchParams.get('curriculum') || 'IB';
  const familyStatus = (searchParams.get('family') || 'single') as FamilyStatus;
  const weights: TriangleWeights = {
    school: Number(searchParams.get('school') || 33),
    livability: Number(searchParams.get('livability') || 33),
    savings: Number(searchParams.get('savings') || 33),
  };

  // Fetch data from DB (falls back to static)
  const [allCities, allRanges, allTax] = await Promise.all([
    getCityProfiles(),
    getSalaryRanges(),
    getTaxRates(),
  ]);

  // Country → flag emoji lookup
  const flagMap: Record<string, string> = {};
  for (const city of allCities) {
    // We'll build this from the DB city_profiles which include flag_emoji
  }

  // For flag emojis, we need to fetch from city_profiles directly
  let dbFlags: Record<string, string> = {};
  try {
    const { createServerClient } = await import('@/lib/supabase');
    const db = createServerClient();
    if (db) {
      const { data } = await db.from('city_profiles').select('country, flag_emoji');
      if (data) {
        for (const row of data) {
          if (row.flag_emoji) dbFlags[row.country] = row.flag_emoji;
        }
      }
    }
  } catch {
    // Use static fallback
    const { countries } = await import('@/data/countries');
    for (const c of countries) {
      dbFlags[c.name] = c.flagEmoji;
    }
  }

  if (Object.keys(dbFlags).length === 0) {
    const { countries } = await import('@/data/countries');
    for (const c of countries) {
      dbFlags[c.name] = c.flagEmoji;
    }
  }

  // Score each city
  const rawSavings: number[] = [];
  const cityData: Array<{
    city: CityData;
    salaryMatch: SalaryRange | undefined;
    taxData: TaxRate | undefined;
    schoolScore: number;
    livabilityScore: number;
    rawSaving: number;
    monthlyExpenses: number;
  }> = [];

  for (const city of allCities) {
    const salaryMatch = findSalaryMatch(allRanges, city.region, role, curriculum);
    const taxData = allTax.find(t => t.country === city.country);

    const schoolScore = computeSchoolScore(city);
    const livabilityScore = computeLivabilityScore(city);

    const medianSalary = salaryMatch?.medianUSD || 40000;
    const housing = salaryMatch?.typicalHousingUSD || 0;
    const taxRate = taxData ? taxData.incomeTaxRate + taxData.socialSecurityRate : 0.15;
    const monthlyExpenses = familyStatus === 'family'
      ? city.monthlyExpensesFamilyUSD
      : city.monthlyExpensesSingleUSD;

    const rawSaving = (medianSalary + housing) * (1 - taxRate) - monthlyExpenses * 12;
    rawSavings.push(rawSaving);

    cityData.push({ city, salaryMatch, taxData, schoolScore, livabilityScore, rawSaving, monthlyExpenses });
  }

  // Normalize savings scores
  const minSaving = Math.min(...rawSavings);
  const maxSaving = Math.max(...rawSavings);

  const scored: ScoredCity[] = cityData.map(d => {
    const savingsScore = normalize(d.rawSaving, minSaving, maxSaving);
    const fitScore = computeFitScore(d.schoolScore, d.livabilityScore, savingsScore, weights);
    const taxData = d.taxData;

    return {
      city: d.city.city,
      country: d.city.country,
      region: d.city.region,
      flagEmoji: dbFlags[d.city.country] || '',
      schoolScore: Math.round(d.schoolScore),
      livabilityScore: Math.round(d.livabilityScore),
      savingsScore: Math.round(savingsScore),
      fitScore: Math.round(fitScore),
      medianSalary: d.salaryMatch?.medianUSD || 40000,
      typicalHousing: d.salaryMatch?.typicalHousingUSD || 0,
      taxRate: taxData ? taxData.incomeTaxRate + taxData.socialSecurityRate : 0.15,
      taxFree: taxData?.taxFree || false,
      monthlyExpenses: d.monthlyExpenses,
      schoolCount: d.city.internationalSchoolCount,
      qualityOfLife: d.city.qualityOfLifeScore,
      safetyScore: d.city.safetyScore,
      healthcareScore: d.city.healthcareScore,
      annualSavings: Math.round(d.rawSaving),
    };
  });

  scored.sort((a, b) => b.fitScore - a.fitScore);

  return NextResponse.json(scored, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
  });
}
