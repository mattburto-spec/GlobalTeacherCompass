/**
 * Seed script: populates Supabase from existing static data files.
 *
 * Usage:
 *   npx tsx scripts/seed-from-static.ts
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(url, key);

// ── Static data (inline to avoid TS path alias issues in scripts) ──────────

// Cities
const cities = [
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', costOfLivingIndex: 72, averageRentOneBedroomUSD: 2200, averageMealOutUSD: 18, monthlyExpensesSingleUSD: 3200, monthlyExpensesFamilyUSD: 6800, qualityOfLifeScore: 8.0, safetyScore: 9.0, healthcareScore: 8.5, internationalSchoolCount: 170, currency: 'UAE Dirham', currencyCode: 'AED' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', costOfLivingIndex: 68, averageRentOneBedroomUSD: 1900, averageMealOutUSD: 16, monthlyExpensesSingleUSD: 2900, monthlyExpensesFamilyUSD: 6200, qualityOfLifeScore: 7.8, safetyScore: 9.2, healthcareScore: 8.5, internationalSchoolCount: 70, currency: 'UAE Dirham', currencyCode: 'AED' },
  { city: 'Doha', country: 'Qatar', region: 'Middle East', costOfLivingIndex: 65, averageRentOneBedroomUSD: 1800, averageMealOutUSD: 14, monthlyExpensesSingleUSD: 2700, monthlyExpensesFamilyUSD: 5800, qualityOfLifeScore: 7.5, safetyScore: 9.0, healthcareScore: 8.0, internationalSchoolCount: 55, currency: 'Qatari Riyal', currencyCode: 'QAR' },
  { city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East', costOfLivingIndex: 55, averageRentOneBedroomUSD: 1400, averageMealOutUSD: 10, monthlyExpensesSingleUSD: 2200, monthlyExpensesFamilyUSD: 4900, qualityOfLifeScore: 6.5, safetyScore: 7.5, healthcareScore: 7.5, internationalSchoolCount: 60, currency: 'Saudi Riyal', currencyCode: 'SAR' },
  { city: 'Kuwait City', country: 'Kuwait', region: 'Middle East', costOfLivingIndex: 58, averageRentOneBedroomUSD: 1500, averageMealOutUSD: 11, monthlyExpensesSingleUSD: 2400, monthlyExpensesFamilyUSD: 5200, qualityOfLifeScore: 6.8, safetyScore: 8.0, healthcareScore: 7.5, internationalSchoolCount: 45, currency: 'Kuwaiti Dinar', currencyCode: 'KWD' },
  { city: 'Muscat', country: 'Oman', region: 'Middle East', costOfLivingIndex: 52, averageRentOneBedroomUSD: 1100, averageMealOutUSD: 9, monthlyExpensesSingleUSD: 1900, monthlyExpensesFamilyUSD: 4200, qualityOfLifeScore: 7.2, safetyScore: 9.0, healthcareScore: 7.0, internationalSchoolCount: 30, currency: 'Omani Rial', currencyCode: 'OMR' },
  { city: 'Singapore', country: 'Singapore', region: 'Southeast Asia', costOfLivingIndex: 85, averageRentOneBedroomUSD: 2800, averageMealOutUSD: 12, monthlyExpensesSingleUSD: 3800, monthlyExpensesFamilyUSD: 8500, qualityOfLifeScore: 9.0, safetyScore: 9.5, healthcareScore: 9.5, internationalSchoolCount: 60, currency: 'Singapore Dollar', currencyCode: 'SGD' },
  { city: 'Hong Kong', country: 'Hong Kong', region: 'East Asia', costOfLivingIndex: 95, averageRentOneBedroomUSD: 3200, averageMealOutUSD: 14, monthlyExpensesSingleUSD: 4500, monthlyExpensesFamilyUSD: 9500, qualityOfLifeScore: 7.5, safetyScore: 8.0, healthcareScore: 8.5, internationalSchoolCount: 55, currency: 'Hong Kong Dollar', currencyCode: 'HKD' },
  { city: 'Shanghai', country: 'China', region: 'East Asia', costOfLivingIndex: 62, averageRentOneBedroomUSD: 1600, averageMealOutUSD: 8, monthlyExpensesSingleUSD: 2600, monthlyExpensesFamilyUSD: 5500, qualityOfLifeScore: 7.0, safetyScore: 8.5, healthcareScore: 7.5, internationalSchoolCount: 60, currency: 'Chinese Yuan', currencyCode: 'CNY' },
  { city: 'Beijing', country: 'China', region: 'East Asia', costOfLivingIndex: 58, averageRentOneBedroomUSD: 1400, averageMealOutUSD: 7, monthlyExpensesSingleUSD: 2400, monthlyExpensesFamilyUSD: 5100, qualityOfLifeScore: 6.8, safetyScore: 8.0, healthcareScore: 7.5, internationalSchoolCount: 55, currency: 'Chinese Yuan', currencyCode: 'CNY' },
  { city: 'Seoul', country: 'South Korea', region: 'East Asia', costOfLivingIndex: 75, averageRentOneBedroomUSD: 1500, averageMealOutUSD: 10, monthlyExpensesSingleUSD: 2800, monthlyExpensesFamilyUSD: 5900, qualityOfLifeScore: 8.2, safetyScore: 8.8, healthcareScore: 9.0, internationalSchoolCount: 40, currency: 'South Korean Won', currencyCode: 'KRW' },
  { city: 'Tokyo', country: 'Japan', region: 'East Asia', costOfLivingIndex: 90, averageRentOneBedroomUSD: 1800, averageMealOutUSD: 12, monthlyExpensesSingleUSD: 3200, monthlyExpensesFamilyUSD: 6800, qualityOfLifeScore: 8.5, safetyScore: 9.5, healthcareScore: 9.0, internationalSchoolCount: 35, currency: 'Japanese Yen', currencyCode: 'JPY' },
  { city: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', costOfLivingIndex: 38, averageRentOneBedroomUSD: 700, averageMealOutUSD: 5, monthlyExpensesSingleUSD: 1400, monthlyExpensesFamilyUSD: 3200, qualityOfLifeScore: 7.8, safetyScore: 7.0, healthcareScore: 8.0, internationalSchoolCount: 80, currency: 'Thai Baht', currencyCode: 'THB' },
  { city: 'Kuala Lumpur', country: 'Malaysia', region: 'Southeast Asia', costOfLivingIndex: 35, averageRentOneBedroomUSD: 600, averageMealOutUSD: 5, monthlyExpensesSingleUSD: 1300, monthlyExpensesFamilyUSD: 2900, qualityOfLifeScore: 7.5, safetyScore: 6.8, healthcareScore: 7.5, internationalSchoolCount: 65, currency: 'Malaysian Ringgit', currencyCode: 'MYR' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Southeast Asia', costOfLivingIndex: 30, averageRentOneBedroomUSD: 550, averageMealOutUSD: 4, monthlyExpensesSingleUSD: 1100, monthlyExpensesFamilyUSD: 2600, qualityOfLifeScore: 7.0, safetyScore: 7.5, healthcareScore: 6.5, internationalSchoolCount: 50, currency: 'Vietnamese Dong', currencyCode: 'VND' },
  { city: 'Jakarta', country: 'Indonesia', region: 'Southeast Asia', costOfLivingIndex: 33, averageRentOneBedroomUSD: 600, averageMealOutUSD: 4, monthlyExpensesSingleUSD: 1200, monthlyExpensesFamilyUSD: 2800, qualityOfLifeScore: 6.5, safetyScore: 6.5, healthcareScore: 6.5, internationalSchoolCount: 55, currency: 'Indonesian Rupiah', currencyCode: 'IDR' },
  { city: 'London', country: 'United Kingdom', region: 'Europe', costOfLivingIndex: 105, averageRentOneBedroomUSD: 2800, averageMealOutUSD: 22, monthlyExpensesSingleUSD: 4200, monthlyExpensesFamilyUSD: 9000, qualityOfLifeScore: 8.0, safetyScore: 7.0, healthcareScore: 8.5, internationalSchoolCount: 75, currency: 'British Pound', currencyCode: 'GBP' },
  { city: 'Zurich', country: 'Switzerland', region: 'Europe', costOfLivingIndex: 130, averageRentOneBedroomUSD: 3500, averageMealOutUSD: 30, monthlyExpensesSingleUSD: 5500, monthlyExpensesFamilyUSD: 11000, qualityOfLifeScore: 9.5, safetyScore: 9.5, healthcareScore: 9.5, internationalSchoolCount: 20, currency: 'Swiss Franc', currencyCode: 'CHF' },
  { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', costOfLivingIndex: 92, averageRentOneBedroomUSD: 2200, averageMealOutUSD: 18, monthlyExpensesSingleUSD: 3500, monthlyExpensesFamilyUSD: 7500, qualityOfLifeScore: 8.8, safetyScore: 8.5, healthcareScore: 9.0, internationalSchoolCount: 25, currency: 'Euro', currencyCode: 'EUR' },
  { city: 'Madrid', country: 'Spain', region: 'Europe', costOfLivingIndex: 62, averageRentOneBedroomUSD: 1300, averageMealOutUSD: 14, monthlyExpensesSingleUSD: 2400, monthlyExpensesFamilyUSD: 5200, qualityOfLifeScore: 8.5, safetyScore: 8.0, healthcareScore: 8.5, internationalSchoolCount: 30, currency: 'Euro', currencyCode: 'EUR' },
  { city: 'Prague', country: 'Czech Republic', region: 'Europe', costOfLivingIndex: 52, averageRentOneBedroomUSD: 1000, averageMealOutUSD: 10, monthlyExpensesSingleUSD: 1900, monthlyExpensesFamilyUSD: 4100, qualityOfLifeScore: 8.2, safetyScore: 8.5, healthcareScore: 8.0, internationalSchoolCount: 20, currency: 'Czech Koruna', currencyCode: 'CZK' },
  { city: 'Cairo', country: 'Egypt', region: 'Africa', costOfLivingIndex: 25, averageRentOneBedroomUSD: 350, averageMealOutUSD: 4, monthlyExpensesSingleUSD: 900, monthlyExpensesFamilyUSD: 2100, qualityOfLifeScore: 5.5, safetyScore: 5.5, healthcareScore: 5.5, internationalSchoolCount: 40, currency: 'Egyptian Pound', currencyCode: 'EGP' },
  { city: 'Nairobi', country: 'Kenya', region: 'Africa', costOfLivingIndex: 32, averageRentOneBedroomUSD: 700, averageMealOutUSD: 7, monthlyExpensesSingleUSD: 1400, monthlyExpensesFamilyUSD: 3100, qualityOfLifeScore: 6.0, safetyScore: 5.5, healthcareScore: 6.0, internationalSchoolCount: 35, currency: 'Kenyan Shilling', currencyCode: 'KES' },
  { city: 'Lagos', country: 'Nigeria', region: 'Africa', costOfLivingIndex: 30, averageRentOneBedroomUSD: 800, averageMealOutUSD: 6, monthlyExpensesSingleUSD: 1600, monthlyExpensesFamilyUSD: 3500, qualityOfLifeScore: 5.0, safetyScore: 4.5, healthcareScore: 5.0, internationalSchoolCount: 30, currency: 'Nigerian Naira', currencyCode: 'NGN' },
  { city: 'Bogota', country: 'Colombia', region: 'South America', costOfLivingIndex: 30, averageRentOneBedroomUSD: 550, averageMealOutUSD: 6, monthlyExpensesSingleUSD: 1100, monthlyExpensesFamilyUSD: 2600, qualityOfLifeScore: 6.5, safetyScore: 5.5, healthcareScore: 7.0, internationalSchoolCount: 30, currency: 'Colombian Peso', currencyCode: 'COP' },
  { city: 'Mexico City', country: 'Mexico', region: 'Central America', costOfLivingIndex: 38, averageRentOneBedroomUSD: 750, averageMealOutUSD: 7, monthlyExpensesSingleUSD: 1500, monthlyExpensesFamilyUSD: 3400, qualityOfLifeScore: 7.0, safetyScore: 5.5, healthcareScore: 7.0, internationalSchoolCount: 55, currency: 'Mexican Peso', currencyCode: 'MXN' },
  { city: 'Sao Paulo', country: 'Brazil', region: 'South America', costOfLivingIndex: 42, averageRentOneBedroomUSD: 700, averageMealOutUSD: 8, monthlyExpensesSingleUSD: 1600, monthlyExpensesFamilyUSD: 3600, qualityOfLifeScore: 6.5, safetyScore: 5.0, healthcareScore: 7.0, internationalSchoolCount: 50, currency: 'Brazilian Real', currencyCode: 'BRL' },
  { city: 'Mumbai', country: 'India', region: 'South Asia', costOfLivingIndex: 30, averageRentOneBedroomUSD: 600, averageMealOutUSD: 5, monthlyExpensesSingleUSD: 1200, monthlyExpensesFamilyUSD: 2800, qualityOfLifeScore: 6.0, safetyScore: 6.0, healthcareScore: 6.5, internationalSchoolCount: 35, currency: 'Indian Rupee', currencyCode: 'INR' },
  { city: 'Bangalore', country: 'India', region: 'South Asia', costOfLivingIndex: 28, averageRentOneBedroomUSD: 500, averageMealOutUSD: 5, monthlyExpensesSingleUSD: 1100, monthlyExpensesFamilyUSD: 2500, qualityOfLifeScore: 6.5, safetyScore: 6.5, healthcareScore: 7.0, internationalSchoolCount: 40, currency: 'Indian Rupee', currencyCode: 'INR' },
  { city: 'Sydney', country: 'Australia', region: 'Oceania', costOfLivingIndex: 88, averageRentOneBedroomUSD: 2000, averageMealOutUSD: 18, monthlyExpensesSingleUSD: 3400, monthlyExpensesFamilyUSD: 7200, qualityOfLifeScore: 9.0, safetyScore: 9.0, healthcareScore: 9.0, internationalSchoolCount: 25, currency: 'Australian Dollar', currencyCode: 'AUD' },
];

// Tax rates by country
const taxRates: Record<string, { countryCode: string; incomeTaxRate: number; socialSecurityRate: number; taxFree: boolean; notes: string }> = {
  'United Arab Emirates': { countryCode: 'AE', incomeTaxRate: 0, socialSecurityRate: 0, taxFree: true, notes: 'UAE levies no personal income tax. There is no social-security scheme applicable to expat employees. VAT of 5% applies to goods and services.' },
  'Qatar': { countryCode: 'QA', incomeTaxRate: 0, socialSecurityRate: 0, taxFree: true, notes: 'Qatar has no personal income tax for individuals. Expats are not enrolled in the national social-insurance scheme.' },
  'Saudi Arabia': { countryCode: 'SA', incomeTaxRate: 0, socialSecurityRate: 0, taxFree: true, notes: 'No personal income tax for non-Saudi employees. Saudi nationals contribute to GOSI (22% combined), but expats pay no social insurance. VAT is 15%.' },
  'Kuwait': { countryCode: 'KW', incomeTaxRate: 0, socialSecurityRate: 0, taxFree: true, notes: 'No personal income tax and no social-security obligation for expat employees.' },
  'Oman': { countryCode: 'OM', incomeTaxRate: 0, socialSecurityRate: 0, taxFree: true, notes: 'No income tax on employment income. Expat teachers are exempt from the Public Authority for Social Insurance scheme.' },
  'Hong Kong': { countryCode: 'HK', incomeTaxRate: 0.10, socialSecurityRate: 0.05, taxFree: false, notes: 'Salaries tax is capped at 15% of gross income before deductions; effective rate for most teachers is roughly 8-12%. MPF requires a 5% employee contribution on the first HKD 30,000/month.' },
  'China': { countryCode: 'CN', incomeTaxRate: 0.18, socialSecurityRate: 0.105, taxFree: false, notes: 'Progressive IIT with 7 brackets (3-45%). Expat teachers benefit from monthly expense allowances that reduce taxable income significantly.' },
  'South Korea': { countryCode: 'KR', incomeTaxRate: 0.17, socialSecurityRate: 0.08, taxFree: false, notes: 'Expat employees can elect a flat 19% income tax rate for the first 20 years. National health insurance and pension contributions are generally required.' },
  'Japan': { countryCode: 'JP', incomeTaxRate: 0.22, socialSecurityRate: 0.145, taxFree: false, notes: 'National income tax + 10% inhabitant tax combine to create a high effective rate. Social insurance adds approximately 14-15% for the employee.' },
  'Singapore': { countryCode: 'SG', incomeTaxRate: 0.11, socialSecurityRate: 0.0, taxFree: false, notes: 'Progressive resident rates from 0-22%. Employment Pass holders are not required to contribute to CPF.' },
  'Thailand': { countryCode: 'TH', incomeTaxRate: 0.17, socialSecurityRate: 0.05, taxFree: false, notes: 'Progressive rates 0-35%. Social Security Fund contribution is 5% (capped at THB 750/month).' },
  'Malaysia': { countryCode: 'MY', incomeTaxRate: 0.14, socialSecurityRate: 0.09, taxFree: false, notes: 'Progressive rates 0-30% on Malaysian-sourced income. EPF contributions are mandatory for residents; expats can opt out.' },
  'Vietnam': { countryCode: 'VN', incomeTaxRate: 0.20, socialSecurityRate: 0.08, taxFree: false, notes: 'Personal income tax applies to Vietnamese-sourced income at progressive rates 5-35%. Social insurance for expats has been mandatory since 2018.' },
  'Indonesia': { countryCode: 'ID', incomeTaxRate: 0.20, socialSecurityRate: 0.03, taxFree: false, notes: 'Progressive rates 5-35% for tax residents. Many schools gross up tax obligations for senior hires.' },
  'United Kingdom': { countryCode: 'GB', incomeTaxRate: 0.28, socialSecurityRate: 0.08, taxFree: false, notes: 'Income Tax at 20% (basic) / 40% (higher) rate. National Insurance is approximately 8%.' },
  'Switzerland': { countryCode: 'CH', incomeTaxRate: 0.25, socialSecurityRate: 0.065, taxFree: false, notes: 'Federal, cantonal, and communal taxes combined. AHV/IV/EO employee contributions are approximately 6.5%.' },
  'Netherlands': { countryCode: 'NL', incomeTaxRate: 0.37, socialSecurityRate: 0.0, taxFree: false, notes: 'Box 1 income tax: 36.97% up to EUR 73,031, 49.5% above. The 30% ruling can substantially reduce effective rate.' },
  'Spain': { countryCode: 'ES', incomeTaxRate: 0.28, socialSecurityRate: 0.064, taxFree: false, notes: 'National + regional income tax combined. The Beckham Law allows new tax residents to pay a flat 24% for 6 years.' },
  'Czech Republic': { countryCode: 'CZ', incomeTaxRate: 0.20, socialSecurityRate: 0.115, taxFree: false, notes: 'Flat 15% income tax (23% above 4x average wage). Health + social security bring employee deductions to ~11.5%.' },
  'Egypt': { countryCode: 'EG', incomeTaxRate: 0.20, socialSecurityRate: 0.11, taxFree: false, notes: 'Progressive rates 0-27.5% on Egyptian-sourced income. Social Insurance contributions apply for all employees.' },
  'Kenya': { countryCode: 'KE', incomeTaxRate: 0.25, socialSecurityRate: 0.06, taxFree: false, notes: 'PAYE at progressive rates 10-35%. NSSF and NHIF contributions apply.' },
  'Nigeria': { countryCode: 'NG', incomeTaxRate: 0.21, socialSecurityRate: 0.08, taxFree: false, notes: 'Personal Income Tax Act applies at progressive rates up to 24%. Pension Reform Act mandates 8% employee contribution.' },
  'Colombia': { countryCode: 'CO', incomeTaxRate: 0.19, socialSecurityRate: 0.04, taxFree: false, notes: 'Progressive rates 0-39% for tax residents. Employee health and pension contributions are approximately 4% each.' },
  'Mexico': { countryCode: 'MX', incomeTaxRate: 0.24, socialSecurityRate: 0.02, taxFree: false, notes: 'ISR at progressive rates 1.9-35%. IMSS employee-side contributions are relatively low (~2%).' },
  'Brazil': { countryCode: 'BR', incomeTaxRate: 0.22, socialSecurityRate: 0.09, taxFree: false, notes: 'IRPF at progressive rates 0-27.5%. INSS employee contribution is 7.5-14% on a sliding scale.' },
  'India': { countryCode: 'IN', incomeTaxRate: 0.22, socialSecurityRate: 0.12, taxFree: false, notes: 'New tax regime: slab rates 0-30% with standard deduction. EPF contribution is 12% of basic salary.' },
  'Australia': { countryCode: 'AU', incomeTaxRate: 0.32, socialSecurityRate: 0.0, taxFree: false, notes: 'Income tax at progressive rates 0-45% plus 2% Medicare levy. Superannuation is 11% on top of salary (employer-paid).' },
};

// Countries (flag + code data)
const countryMeta: Record<string, { code: string; flagEmoji: string }> = {
  'United Arab Emirates': { code: 'AE', flagEmoji: '🇦🇪' },
  'Qatar': { code: 'QA', flagEmoji: '🇶🇦' },
  'Saudi Arabia': { code: 'SA', flagEmoji: '🇸🇦' },
  'Kuwait': { code: 'KW', flagEmoji: '🇰🇼' },
  'Oman': { code: 'OM', flagEmoji: '🇴🇲' },
  'Hong Kong': { code: 'HK', flagEmoji: '🇭🇰' },
  'China': { code: 'CN', flagEmoji: '🇨🇳' },
  'South Korea': { code: 'KR', flagEmoji: '🇰🇷' },
  'Japan': { code: 'JP', flagEmoji: '🇯🇵' },
  'Singapore': { code: 'SG', flagEmoji: '🇸🇬' },
  'Thailand': { code: 'TH', flagEmoji: '🇹🇭' },
  'Malaysia': { code: 'MY', flagEmoji: '🇲🇾' },
  'Vietnam': { code: 'VN', flagEmoji: '🇻🇳' },
  'Indonesia': { code: 'ID', flagEmoji: '🇮🇩' },
  'United Kingdom': { code: 'GB', flagEmoji: '🇬🇧' },
  'Switzerland': { code: 'CH', flagEmoji: '🇨🇭' },
  'Netherlands': { code: 'NL', flagEmoji: '🇳🇱' },
  'Spain': { code: 'ES', flagEmoji: '🇪🇸' },
  'Czech Republic': { code: 'CZ', flagEmoji: '🇨🇿' },
  'Egypt': { code: 'EG', flagEmoji: '🇪🇬' },
  'Kenya': { code: 'KE', flagEmoji: '🇰🇪' },
  'Nigeria': { code: 'NG', flagEmoji: '🇳🇬' },
  'Colombia': { code: 'CO', flagEmoji: '🇨🇴' },
  'Mexico': { code: 'MX', flagEmoji: '🇲🇽' },
  'Brazil': { code: 'BR', flagEmoji: '🇧🇷' },
  'India': { code: 'IN', flagEmoji: '🇮🇳' },
  'Australia': { code: 'AU', flagEmoji: '🇦🇺' },
};

// Salary ranges
const salaryRanges = [
  { region: 'Middle East', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 36000, maxUSD: 65000, medianUSD: 50000, typicalHousingUSD: 24000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'head_of_department', curriculumType: 'IB', minUSD: 55000, maxUSD: 85000, medianUSD: 68000, typicalHousingUSD: 26000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'senior_leader', curriculumType: 'IB', minUSD: 75000, maxUSD: 115000, medianUSD: 92000, typicalHousingUSD: 32000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'principal', curriculumType: 'IB', minUSD: 100000, maxUSD: 160000, medianUSD: 128000, typicalHousingUSD: 40000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'classroom_teacher', curriculumType: 'British', minUSD: 32000, maxUSD: 60000, medianUSD: 46000, typicalHousingUSD: 22000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'head_of_department', curriculumType: 'British', minUSD: 50000, maxUSD: 80000, medianUSD: 63000, typicalHousingUSD: 24000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Middle East', role: 'principal', curriculumType: 'British', minUSD: 90000, maxUSD: 150000, medianUSD: 118000, typicalHousingUSD: 38000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'East Asia', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 40000, maxUSD: 80000, medianUSD: 58000, typicalHousingUSD: 20000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'East Asia', role: 'head_of_department', curriculumType: 'IB', minUSD: 58000, maxUSD: 100000, medianUSD: 76000, typicalHousingUSD: 24000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'East Asia', role: 'senior_leader', curriculumType: 'IB', minUSD: 80000, maxUSD: 130000, medianUSD: 103000, typicalHousingUSD: 30000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'East Asia', role: 'principal', curriculumType: 'IB', minUSD: 110000, maxUSD: 180000, medianUSD: 142000, typicalHousingUSD: 40000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'East Asia', role: 'classroom_teacher', curriculumType: 'British', minUSD: 38000, maxUSD: 75000, medianUSD: 55000, typicalHousingUSD: 18000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'East Asia', role: 'head_of_department', curriculumType: 'British', minUSD: 55000, maxUSD: 95000, medianUSD: 72000, typicalHousingUSD: 22000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'Southeast Asia', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 28000, maxUSD: 60000, medianUSD: 42000, typicalHousingUSD: 10000, typicalFlights: 1, tuitionRemissionPercent: 50 },
  { region: 'Southeast Asia', role: 'head_of_department', curriculumType: 'IB', minUSD: 42000, maxUSD: 75000, medianUSD: 57000, typicalHousingUSD: 12000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'Southeast Asia', role: 'senior_leader', curriculumType: 'IB', minUSD: 60000, maxUSD: 105000, medianUSD: 80000, typicalHousingUSD: 18000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Southeast Asia', role: 'principal', curriculumType: 'IB', minUSD: 85000, maxUSD: 145000, medianUSD: 112000, typicalHousingUSD: 28000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Southeast Asia', role: 'classroom_teacher', curriculumType: 'British', minUSD: 26000, maxUSD: 55000, medianUSD: 39000, typicalHousingUSD: 9000, typicalFlights: 1, tuitionRemissionPercent: 50 },
  { region: 'Southeast Asia', role: 'head_of_department', curriculumType: 'British', minUSD: 38000, maxUSD: 68000, medianUSD: 52000, typicalHousingUSD: 11000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'Europe', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 35000, maxUSD: 75000, medianUSD: 52000, typicalHousingUSD: 0, typicalFlights: 0, tuitionRemissionPercent: 50 },
  { region: 'Europe', role: 'head_of_department', curriculumType: 'IB', minUSD: 50000, maxUSD: 95000, medianUSD: 70000, typicalHousingUSD: 0, typicalFlights: 0, tuitionRemissionPercent: 50 },
  { region: 'Europe', role: 'senior_leader', curriculumType: 'IB', minUSD: 70000, maxUSD: 125000, medianUSD: 95000, typicalHousingUSD: 0, typicalFlights: 0, tuitionRemissionPercent: 75 },
  { region: 'Europe', role: 'principal', curriculumType: 'IB', minUSD: 95000, maxUSD: 160000, medianUSD: 125000, typicalHousingUSD: 0, typicalFlights: 0, tuitionRemissionPercent: 100 },
  { region: 'Africa', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 22000, maxUSD: 50000, medianUSD: 34000, typicalHousingUSD: 12000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Africa', role: 'head_of_department', curriculumType: 'IB', minUSD: 34000, maxUSD: 65000, medianUSD: 48000, typicalHousingUSD: 14000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'Africa', role: 'principal', curriculumType: 'IB', minUSD: 70000, maxUSD: 120000, medianUSD: 92000, typicalHousingUSD: 24000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'South America', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 18000, maxUSD: 42000, medianUSD: 28000, typicalHousingUSD: 6000, typicalFlights: 1, tuitionRemissionPercent: 50 },
  { region: 'South America', role: 'head_of_department', curriculumType: 'IB', minUSD: 28000, maxUSD: 58000, medianUSD: 41000, typicalHousingUSD: 7000, typicalFlights: 1, tuitionRemissionPercent: 50 },
  { region: 'South America', role: 'principal', curriculumType: 'IB', minUSD: 55000, maxUSD: 95000, medianUSD: 73000, typicalHousingUSD: 15000, typicalFlights: 2, tuitionRemissionPercent: 100 },
  { region: 'South Asia', role: 'classroom_teacher', curriculumType: 'IB', minUSD: 20000, maxUSD: 48000, medianUSD: 32000, typicalHousingUSD: 9000, typicalFlights: 1, tuitionRemissionPercent: 75 },
  { region: 'South Asia', role: 'head_of_department', curriculumType: 'IB', minUSD: 32000, maxUSD: 65000, medianUSD: 46000, typicalHousingUSD: 11000, typicalFlights: 2, tuitionRemissionPercent: 75 },
  { region: 'South Asia', role: 'principal', curriculumType: 'IB', minUSD: 60000, maxUSD: 110000, medianUSD: 82000, typicalHousingUSD: 20000, typicalFlights: 2, tuitionRemissionPercent: 100 },
];

// Exchange rates
const exchangeRates: Record<string, number> = {
  USD: 1.0, EUR: 1.08, GBP: 1.27, AED: 0.272, QAR: 0.274,
  SAR: 0.267, KWD: 3.25, OMR: 2.60, SGD: 0.74, HKD: 0.128,
  THB: 0.028, MYR: 0.213, VND: 0.000040, IDR: 0.000062,
  CNY: 0.138, KRW: 0.00073, JPY: 0.0067, CHF: 1.12, CZK: 0.044,
  EGP: 0.020, KES: 0.0077, NGN: 0.00065, COP: 0.00024,
  MXN: 0.050, BRL: 0.194, INR: 0.012, AUD: 0.64,
};

// ── Seed functions ─────────────────────────────────────────────────────────────

async function seedCityProfiles() {
  console.log('Seeding city_profiles...');

  const rows = cities.map(c => {
    const tax = taxRates[c.country];
    const meta = countryMeta[c.country];
    return {
      city: c.city,
      country: c.country,
      country_code: meta?.code || tax?.countryCode || null,
      region: c.region,
      currency: c.currency,
      currency_code: c.currencyCode,
      flag_emoji: meta?.flagEmoji || null,
      cost_of_living_index: c.costOfLivingIndex,
      average_rent_1bed_usd: c.averageRentOneBedroomUSD,
      average_meal_out_usd: c.averageMealOutUSD,
      monthly_expenses_single_usd: c.monthlyExpensesSingleUSD,
      monthly_expenses_family_usd: c.monthlyExpensesFamilyUSD,
      income_tax_rate: tax?.incomeTaxRate ?? null,
      social_security_rate: tax?.socialSecurityRate ?? null,
      tax_free: tax?.taxFree ?? false,
      tax_notes: tax?.notes ?? null,
      quality_of_life_score: c.qualityOfLifeScore,
      safety_score: c.safetyScore,
      healthcare_score: c.healthcareScore,
      international_school_count: c.internationalSchoolCount,
    };
  });

  const { error } = await db.from('city_profiles').upsert(rows, { onConflict: 'city,country' });

  if (error) {
    console.error('Error seeding city_profiles:', error.message);
  } else {
    console.log(`  Seeded ${rows.length} city profiles`);
  }
}

async function seedSalaryData() {
  console.log('Seeding salary_data from salary ranges...');

  const today = new Date().toISOString().split('T')[0];
  const rows = salaryRanges.map(s => ({
    region: s.region,
    role: s.role,
    curriculum: s.curriculumType,
    salary_usd: s.medianUSD,
    housing_type: s.typicalHousingUSD > 0 ? 'allowance' : 'none',
    housing_value_usd: s.typicalHousingUSD,
    flights_provided: s.typicalFlights > 0,
    flights_count: s.typicalFlights,
    flights_value_usd: s.typicalFlights * 800,
    tuition_remission_percent: s.tuitionRemissionPercent,
    total_package_usd: s.medianUSD + s.typicalHousingUSD + (s.typicalFlights * 800),
    source: 'seed',
    report_date: today,
    confidence_score: 0.8,
    validation_status: 'auto_approved',
  }));

  // Also add min and max as separate data points for percentile calculations
  const minMaxRows = salaryRanges.flatMap(s => [
    {
      region: s.region, role: s.role, curriculum: s.curriculumType,
      salary_usd: s.minUSD,
      housing_value_usd: s.typicalHousingUSD * 0.8,
      total_package_usd: s.minUSD + (s.typicalHousingUSD * 0.8),
      source: 'seed', report_date: today, confidence_score: 0.6,
      validation_status: 'auto_approved',
    },
    {
      region: s.region, role: s.role, curriculum: s.curriculumType,
      salary_usd: s.maxUSD,
      housing_value_usd: s.typicalHousingUSD * 1.2,
      total_package_usd: s.maxUSD + (s.typicalHousingUSD * 1.2),
      source: 'seed', report_date: today, confidence_score: 0.6,
      validation_status: 'auto_approved',
    },
  ]);

  const allRows = [...rows, ...minMaxRows];
  const { error } = await db.from('salary_data').insert(allRows);

  if (error) {
    console.error('Error seeding salary_data:', error.message);
  } else {
    console.log(`  Seeded ${allRows.length} salary data points`);
  }
}

async function seedExchangeRates() {
  console.log('Seeding exchange_rates...');

  const rows = Object.entries(exchangeRates).map(([code, rate]) => ({
    currency_code: code,
    rate_to_usd: rate,
  }));

  const { error } = await db.from('exchange_rates').insert(rows);

  if (error) {
    console.error('Error seeding exchange_rates:', error.message);
  } else {
    console.log(`  Seeded ${rows.length} exchange rates`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Starting seed...\n');
  await seedCityProfiles();
  await seedSalaryData();
  await seedExchangeRates();
  console.log('\nSeed complete!');
}

main().catch(console.error);
