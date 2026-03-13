import { createServerClient } from './supabase';
import type { CityData, SalaryRange, TaxRate } from '@/data/types';
import type { CountryData } from '@/data/countries';

// Static fallbacks
import { cities } from '@/data/cities';
import { salaryRanges } from '@/data/salary-ranges';
import { taxRates } from '@/data/tax-rates';
import { countries } from '@/data/countries';

// Hardcoded exchange rates as fallback
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0, EUR: 1.08, GBP: 1.27, AED: 0.272, QAR: 0.274,
  SAR: 0.267, KWD: 3.25, OMR: 2.60, SGD: 0.74, HKD: 0.128,
  THB: 0.028, MYR: 0.213, VND: 0.000040, IDR: 0.000062,
  CNY: 0.138, KRW: 0.00073, JPY: 0.0067, CHF: 1.12, CZK: 0.044,
  EGP: 0.020, KES: 0.0077, NGN: 0.00065, COP: 0.00024,
  MXN: 0.050, BRL: 0.194, INR: 0.012, AUD: 0.64,
};

// ── City Profiles ──────────────────────────────────────────────────────────────

export async function getCityProfiles(): Promise<CityData[]> {
  try {
    const db = createServerClient();
    if (!db) return cities;

    const { data, error } = await db
      .from('city_profiles')
      .select('*')
      .order('city');

    if (error || !data || data.length === 0) return cities;

    return data.map(mapDbCityToInterface);
  } catch {
    return cities;
  }
}

export async function getCityProfile(city: string): Promise<CityData | undefined> {
  try {
    const db = createServerClient();
    if (!db) return cities.find(c => c.city.toLowerCase() === city.toLowerCase());

    const { data, error } = await db
      .from('city_profiles')
      .select('*')
      .ilike('city', city)
      .single();

    if (error || !data) return cities.find(c => c.city.toLowerCase() === city.toLowerCase());

    return mapDbCityToInterface(data);
  } catch {
    return cities.find(c => c.city.toLowerCase() === city.toLowerCase());
  }
}

function mapDbCityToInterface(row: Record<string, unknown>): CityData {
  return {
    city: row.city as string,
    country: row.country as string,
    region: row.region as CityData['region'],
    costOfLivingIndex: Number(row.cost_of_living_index) || 0,
    averageRentOneBedroomUSD: Number(row.average_rent_1bed_usd) || 0,
    averageMealOutUSD: Number(row.average_meal_out_usd) || 0,
    monthlyExpensesSingleUSD: Number(row.monthly_expenses_single_usd) || 0,
    monthlyExpensesFamilyUSD: Number(row.monthly_expenses_family_usd) || 0,
    qualityOfLifeScore: Number(row.quality_of_life_score) || 0,
    safetyScore: Number(row.safety_score) || 0,
    healthcareScore: Number(row.healthcare_score) || 0,
    internationalSchoolCount: Number(row.international_school_count) || 0,
    currency: (row.currency as string) || '',
    currencyCode: (row.currency_code as string) || '',
  };
}

// ── Tax Rates ──────────────────────────────────────────────────────────────────

export async function getTaxRates(): Promise<TaxRate[]> {
  try {
    const db = createServerClient();
    if (!db) return taxRates;

    const { data, error } = await db
      .from('city_profiles')
      .select('country, country_code, income_tax_rate, social_security_rate, tax_free, tax_notes')
      .not('income_tax_rate', 'is', null);

    if (error || !data || data.length === 0) return taxRates;

    // Deduplicate by country
    const seen = new Set<string>();
    const result: TaxRate[] = [];
    for (const row of data) {
      if (!seen.has(row.country)) {
        seen.add(row.country);
        result.push({
          country: row.country,
          countryCode: row.country_code || '',
          incomeTaxRate: Number(row.income_tax_rate) || 0,
          socialSecurityRate: Number(row.social_security_rate) || 0,
          taxFree: row.tax_free || false,
          notes: row.tax_notes || '',
        });
      }
    }
    return result;
  } catch {
    return taxRates;
  }
}

export async function getTaxRate(country: string): Promise<TaxRate | undefined> {
  try {
    const db = createServerClient();
    if (!db) return taxRates.find(t => t.country === country);

    const { data, error } = await db
      .from('city_profiles')
      .select('country, country_code, income_tax_rate, social_security_rate, tax_free, tax_notes')
      .eq('country', country)
      .limit(1)
      .single();

    if (error || !data) return taxRates.find(t => t.country === country);

    return {
      country: data.country,
      countryCode: data.country_code || '',
      incomeTaxRate: Number(data.income_tax_rate) || 0,
      socialSecurityRate: Number(data.social_security_rate) || 0,
      taxFree: data.tax_free || false,
      notes: data.tax_notes || '',
    };
  } catch {
    return taxRates.find(t => t.country === country);
  }
}

// ── Salary Ranges ──────────────────────────────────────────────────────────────

export async function getSalaryRanges(filters?: {
  region?: string;
  role?: string;
  curriculum?: string;
}): Promise<SalaryRange[]> {
  try {
    const db = createServerClient();
    if (!db) return filterStaticSalaryRanges(filters);

    // Try to get aggregated salary data from the view
    let query = db.from('salary_aggregates').select('*');

    if (filters?.region) query = query.eq('region', filters.region);
    if (filters?.role) query = query.eq('role', filters.role);
    if (filters?.curriculum) query = query.eq('curriculum', filters.curriculum);

    const { data, error } = await query;

    if (error || !data || data.length === 0) return filterStaticSalaryRanges(filters);

    return data.map((row): SalaryRange => ({
      region: row.region,
      role: row.role as SalaryRange['role'],
      curriculumType: (row.curriculum || 'IB') as SalaryRange['curriculumType'],
      minUSD: Number(row.min_salary_usd) || 0,
      maxUSD: Number(row.max_salary_usd) || 0,
      medianUSD: Number(row.median) || 0,
      typicalHousingUSD: Number(row.avg_housing_usd) || 0,
      typicalFlights: 1,
      tuitionRemissionPercent: Number(row.avg_tuition_percent) || 50,
    }));
  } catch {
    return filterStaticSalaryRanges(filters);
  }
}

function filterStaticSalaryRanges(filters?: {
  region?: string;
  role?: string;
  curriculum?: string;
}): SalaryRange[] {
  if (!filters) return salaryRanges;
  return salaryRanges.filter(s => {
    if (filters.region && s.region !== filters.region) return false;
    if (filters.role && s.role !== filters.role) return false;
    if (filters.curriculum && s.curriculumType !== filters.curriculum) return false;
    return true;
  });
}

// ── Exchange Rates ─────────────────────────────────────────────────────────────

export async function getExchangeRate(currencyCode: string): Promise<number> {
  const code = currencyCode.toUpperCase();
  try {
    const db = createServerClient();
    if (!db) return FALLBACK_RATES[code] ?? 1;

    const { data, error } = await db
      .from('exchange_rates')
      .select('rate_to_usd')
      .eq('currency_code', code)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return FALLBACK_RATES[code] ?? 1;
    return Number(data.rate_to_usd);
  } catch {
    return FALLBACK_RATES[code] ?? 1;
  }
}

export async function getAllExchangeRates(): Promise<Record<string, number>> {
  try {
    const db = createServerClient();
    if (!db) return FALLBACK_RATES;

    const { data, error } = await db
      .from('exchange_rates')
      .select('currency_code, rate_to_usd')
      .order('fetched_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_RATES;

    // Take the most recent rate for each currency
    const rates: Record<string, number> = {};
    for (const row of data) {
      if (!rates[row.currency_code]) {
        rates[row.currency_code] = Number(row.rate_to_usd);
      }
    }
    return { ...FALLBACK_RATES, ...rates };
  } catch {
    return FALLBACK_RATES;
  }
}

// ── Countries ──────────────────────────────────────────────────────────────────

export async function getCountries(): Promise<CountryData[]> {
  try {
    const db = createServerClient();
    if (!db) return countries;

    const { data, error } = await db
      .from('city_profiles')
      .select('country, country_code, currency, currency_code, region, flag_emoji')
      .order('country');

    if (error || !data || data.length === 0) return countries;

    // Deduplicate by country
    const seen = new Set<string>();
    const result: CountryData[] = [];
    for (const row of data) {
      if (!seen.has(row.country)) {
        seen.add(row.country);
        result.push({
          name: row.country,
          code: row.country_code || '',
          currency: row.currency || '',
          currencyCode: row.currency_code || '',
          region: row.region as CountryData['region'],
          flagEmoji: row.flag_emoji || '',
        });
      }
    }
    return result;
  } catch {
    return countries;
  }
}

// ── Salary Aggregates (for data freshness indicators) ──────────────────────────

export interface SalaryAggregate {
  region: string;
  city: string | null;
  role: string;
  curriculum: string;
  dataPoints: number;
  median: number;
  p25: number;
  p75: number;
  latestReport: string | null;
}

export async function getSalaryAggregates(filters: {
  city?: string;
  region?: string;
  role?: string;
  curriculum?: string;
}): Promise<SalaryAggregate[]> {
  try {
    const db = createServerClient();
    if (!db) return [];

    let query = db.from('salary_aggregates').select('*');
    if (filters.city) query = query.eq('city', filters.city);
    if (filters.region) query = query.eq('region', filters.region);
    if (filters.role) query = query.eq('role', filters.role);
    if (filters.curriculum) query = query.eq('curriculum', filters.curriculum);

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(row => ({
      region: row.region,
      city: row.city,
      role: row.role,
      curriculum: row.curriculum,
      dataPoints: Number(row.data_points),
      median: Number(row.median),
      p25: Number(row.p25),
      p75: Number(row.p75),
      latestReport: row.latest_report,
    }));
  } catch {
    return [];
  }
}
