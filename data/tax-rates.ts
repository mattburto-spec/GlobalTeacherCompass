import type { TaxRate } from './types';

// incomeTaxRate  = effective (blended) income tax rate for a teacher earning ~USD 45–80k equivalent
//                  after standard expat/personal deductions where applicable.
// socialSecurityRate = employee-side social insurance / provident fund contribution rate.
//                      0 where expat teachers are typically exempt or the scheme does not exist.
// Notes contain practical info for internationally-hired teachers specifically.

export const taxRates: TaxRate[] = [
  // ── Middle East ──────────────────────────────────────────────────────────────
  {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    incomeTaxRate: 0,
    socialSecurityRate: 0,
    notes:
      'UAE levies no personal income tax. There is no social-security scheme applicable to expat employees. VAT of 5% applies to goods and services.',
    taxFree: true,
  },
  {
    country: 'Qatar',
    countryCode: 'QA',
    incomeTaxRate: 0,
    socialSecurityRate: 0,
    notes:
      'Qatar has no personal income tax for individuals. Expats are not enrolled in the national social-insurance scheme.',
    taxFree: true,
  },
  {
    country: 'Saudi Arabia',
    countryCode: 'SA',
    incomeTaxRate: 0,
    socialSecurityRate: 0,
    notes:
      'No personal income tax for non-Saudi employees. Saudi nationals contribute to GOSI (22% combined), but expats pay no social insurance. VAT is 15%.',
    taxFree: true,
  },
  {
    country: 'Kuwait',
    countryCode: 'KW',
    incomeTaxRate: 0,
    socialSecurityRate: 0,
    notes:
      'No personal income tax and no social-security obligation for expat employees. One of the most generous tax environments in the region.',
    taxFree: true,
  },
  {
    country: 'Oman',
    countryCode: 'OM',
    incomeTaxRate: 0,
    socialSecurityRate: 0,
    notes:
      'No income tax on employment income. Expat teachers are exempt from the Public Authority for Social Insurance scheme.',
    taxFree: true,
  },

  // ── East Asia ────────────────────────────────────────────────────────────────
  {
    country: 'Hong Kong',
    countryCode: 'HK',
    incomeTaxRate: 0.10,
    socialSecurityRate: 0.05,
    notes:
      'Salaries tax is capped at 15% of gross income before deductions; effective rate for most teachers is roughly 8–12%. MPF (Mandatory Provident Fund) requires a 5% employee contribution on the first HKD 30,000/month.',
    taxFree: false,
  },
  {
    country: 'China',
    countryCode: 'CN',
    incomeTaxRate: 0.18,
    socialSecurityRate: 0.105,
    notes:
      'Progressive IIT with 7 brackets (3–45%). Expat teachers benefit from monthly expense allowances (housing, language tuition, etc.) that reduce taxable income significantly. Social insurance applies; some cities exempt new expat hires under bilateral agreements. Effective rate varies widely by city and contract structure.',
    taxFree: false,
  },
  {
    country: 'South Korea',
    countryCode: 'KR',
    incomeTaxRate: 0.17,
    socialSecurityRate: 0.08,
    notes:
      'Expat employees can elect a flat 19% income tax rate (instead of progressive rates) for the first 20 years. National health insurance and pension contributions are generally required; combined employee-side rate is approximately 8%.',
    taxFree: false,
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    incomeTaxRate: 0.22,
    socialSecurityRate: 0.145,
    notes:
      'National income tax + 10% inhabitant tax combine to create a high effective rate. Social insurance (pension, health, employment) adds approximately 14–15% for the employee. Japan has tax treaties with many countries that can reduce or eliminate double taxation.',
    taxFree: false,
  },

  // ── Southeast Asia ───────────────────────────────────────────────────────────
  {
    country: 'Singapore',
    countryCode: 'SG',
    incomeTaxRate: 0.11,
    socialSecurityRate: 0.0,
    notes:
      'Progressive resident rates from 0–22%. Effective rate for teachers earning SGD 80–140k is typically 10–14%. Employment Pass holders are not required to contribute to CPF, so the social-security burden for expats is effectively 0. Singapore taxes only Singapore-sourced income.',
    taxFree: false,
  },
  {
    country: 'Thailand',
    countryCode: 'TH',
    incomeTaxRate: 0.17,
    socialSecurityRate: 0.05,
    notes:
      'Progressive rates 0–35%. Foreign income remitted to Thailand in the same tax year it was earned is taxable. Income remitted in a later year was historically exempt, but new 2024 rules mean foreign income remitted from 1 Jan 2024 is taxable regardless of timing. Social Security Fund contribution is 5% (capped at THB 750/month).',
    taxFree: false,
  },
  {
    country: 'Malaysia',
    countryCode: 'MY',
    incomeTaxRate: 0.14,
    socialSecurityRate: 0.09,
    notes:
      'Progressive rates 0–30% on Malaysian-sourced income. EPF (Employees Provident Fund) contributions are mandatory for residents; expats can opt out. SOCSO (social security) is required for most employees at ~1.75% employer / 0.5% employee. Effective income tax for a mid-career teacher is around 12–16%.',
    taxFree: false,
  },
  {
    country: 'Vietnam',
    countryCode: 'VN',
    incomeTaxRate: 0.20,
    socialSecurityRate: 0.08,
    notes:
      'Personal income tax applies to Vietnamese-sourced income at progressive rates 5–35%. Tax resident expats (183+ days) benefit from allowances for housing and relocation. Social insurance for expats has been mandatory since 2018 at 8% employee contribution.',
    taxFree: false,
  },
  {
    country: 'Indonesia',
    countryCode: 'ID',
    incomeTaxRate: 0.20,
    socialSecurityRate: 0.03,
    notes:
      'Progressive rates 5–35% for tax residents. Expat teachers resident for 183+ days in 12 months are taxed on worldwide income. BPJS Ketenagakerjaan (social security) requires ~3% employee contribution; BPJS Kesehatan (health) is also mandatory. Many schools gross up tax obligations for senior hires.',
    taxFree: false,
  },

  // ── Europe ───────────────────────────────────────────────────────────────────
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    incomeTaxRate: 0.28,
    socialSecurityRate: 0.08,
    notes:
      'Income Tax at 20% (basic) / 40% (higher) rate applies above the personal allowance. National Insurance (Class 1) is approximately 8% on earnings between £12,570–£50,270 and 2% above that. No special expat regime for most teachers; full UK tax residency rules apply.',
    taxFree: false,
  },
  {
    country: 'Switzerland',
    countryCode: 'CH',
    incomeTaxRate: 0.25,
    socialSecurityRate: 0.065,
    notes:
      'Federal, cantonal, and communal taxes combined; Zurich effective rate for a teacher salary is typically 22–28%. AHV/IV/EO employee contributions are approximately 6.5%. Switzerland has tax treaties with most countries. Withholding tax (Quellensteuer) applies to foreigners without a C permit.',
    taxFree: false,
  },
  {
    country: 'Netherlands',
    countryCode: 'NL',
    incomeTaxRate: 0.37,
    socialSecurityRate: 0.0,
    notes:
      'Box 1 income tax: 36.97% on income up to €73,031, 49.5% above. However, the 30% ruling allows qualifying expats to receive 30% of gross salary tax-free for up to 5 years, substantially reducing effective rate. Social contributions are included in the Box 1 rate above.',
    taxFree: false,
  },
  {
    country: 'Spain',
    countryCode: 'ES',
    incomeTaxRate: 0.28,
    socialSecurityRate: 0.064,
    notes:
      'National + regional income tax combined; Madrid effective rate ~24–30%. The Beckham Law (Régimen especial de trabajadores desplazados) allows new tax residents to pay a flat 24% on Spanish income for 6 years — ideal for internationally recruited teachers. Social Security employee contribution approximately 6.4%.',
    taxFree: false,
  },
  {
    country: 'Czech Republic',
    countryCode: 'CZ',
    incomeTaxRate: 0.20,
    socialSecurityRate: 0.115,
    notes:
      'Flat 15% income tax (23% above 4× average wage). Health insurance (4.5%) and social security (7.1%) bring employee deductions to ~11.5%. Czech Republic taxes worldwide income for tax residents.',
    taxFree: false,
  },

  // ── Africa ───────────────────────────────────────────────────────────────────
  {
    country: 'Egypt',
    countryCode: 'EG',
    incomeTaxRate: 0.20,
    socialSecurityRate: 0.11,
    notes:
      'Progressive rates 0–27.5% on Egyptian-sourced income. Social Insurance contributions apply for all employees. Expat teachers at international schools are usually employed locally and subject to Egyptian income tax. Housing allowances paid by the school may be partially exempt.',
    taxFree: false,
  },
  {
    country: 'Kenya',
    countryCode: 'KE',
    incomeTaxRate: 0.25,
    socialSecurityRate: 0.06,
    notes:
      'PAYE (Pay As You Earn) at progressive rates 10–35% on Kenyan income. NSSF (National Social Security Fund) capped contributions apply. NHIF (National Hospital Insurance Fund) is also deducted. Most expat teachers file as resident taxpayers after 183 days.',
    taxFree: false,
  },
  {
    country: 'Nigeria',
    countryCode: 'NG',
    incomeTaxRate: 0.21,
    socialSecurityRate: 0.08,
    notes:
      'Personal Income Tax Act applies at progressive rates up to 24%. Pension Reform Act mandates 8% employee contribution to a Retirement Savings Account (RSA). NHF contributions may also apply. Expatriates can be subject to double taxation without treaty relief.',
    taxFree: false,
  },

  // ── South America / Central America ─────────────────────────────────────────
  {
    country: 'Colombia',
    countryCode: 'CO',
    incomeTaxRate: 0.19,
    socialSecurityRate: 0.04,
    notes:
      'Progressive rates 0–39% for tax residents. Non-residents taxed at flat 35% on Colombian-source income. Employee health and pension contributions are approximately 4% each. Teachers at premium international schools are often offered tax-equalisation packages.',
    taxFree: false,
  },
  {
    country: 'Mexico',
    countryCode: 'MX',
    incomeTaxRate: 0.24,
    socialSecurityRate: 0.02,
    notes:
      'ISR (Impuesto sobre la Renta) at progressive rates 1.9–35%. Effective rate for most teacher salary bands is 20–27%. IMSS (social security) employee-side contributions are relatively low (~2% for most earners). Meal vouchers (vales de despensa) and other non-cash benefits are partially exempt.',
    taxFree: false,
  },
  {
    country: 'Brazil',
    countryCode: 'BR',
    incomeTaxRate: 0.22,
    socialSecurityRate: 0.09,
    notes:
      'IRPF at progressive rates 0–27.5%. INSS (social security) employee contribution is 7.5–14% on a sliding scale, capped at approximately R$908/month. Brazil has a broad tax treaty network; expats on assignment may apply for treaty relief on home-country pension income.',
    taxFree: false,
  },

  // ── South Asia ───────────────────────────────────────────────────────────────
  {
    country: 'India',
    countryCode: 'IN',
    incomeTaxRate: 0.22,
    socialSecurityRate: 0.12,
    notes:
      'New tax regime (FY2023–24 onwards): slab rates 0–30% with standard deduction. Old regime allows HRA, LTA, and 80C deductions which can significantly reduce liability. EPF contribution is 12% of basic salary for employee and employer. Expat teachers on assignment may be covered under totalization agreements that exempt home-country social-security obligations.',
    taxFree: false,
  },

  // ── Oceania ──────────────────────────────────────────────────────────────────
  {
    country: 'Australia',
    countryCode: 'AU',
    incomeTaxRate: 0.32,
    socialSecurityRate: 0.0,
    notes:
      'Income tax at progressive rates 0–45% plus 2% Medicare levy. Effective rate for a teacher earning AUD 80–110k is approximately 28–34%. Superannuation (employer-mandated pension) is 11% on top of salary — not deducted from take-home pay — making packages more valuable than salary alone implies. Australia taxes worldwide income for residents.',
    taxFree: false,
  },
];
