import type { PackageInput, PackageReport, PackageFlag, CityData, SalaryRange } from '@/data/types';
import { cities } from '@/data/cities';
import { salaryRanges } from '@/data/salary-ranges';
import { taxRates } from '@/data/tax-rates';

// ── Exchange rates to USD ────────────────────────────────────────────────────
// Approximate mid-market rates. 1 unit of each currency = N USD.
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.27,
  AED: 0.272,
  QAR: 0.274,
  SAR: 0.267,
  KWD: 3.25,
  OMR: 2.60,
  SGD: 0.74,
  HKD: 0.128,
  THB: 0.028,
  MYR: 0.213,
  VND: 0.000040,
  IDR: 0.000062,
  CNY: 0.138,
  KRW: 0.00073,
  JPY: 0.0067,
  CHF: 1.12,
  CZK: 0.044,
  EGP: 0.020,
  KES: 0.0077,
  NGN: 0.00065,
  COP: 0.00024,
  MXN: 0.050,
  BRL: 0.194,
  INR: 0.012,
  AUD: 0.64,
};

// ── Flight cost constants ────────────────────────────────────────────────────
const ECONOMY_FLIGHT_USD = 800;
const BUSINESS_FLIGHT_USD = 3500;

// ── Health insurance value constants ────────────────────────────────────────
const HEALTH_FULL_FAMILY_USD = 15000;
const HEALTH_INDIVIDUAL_USD = 5000;
const HEALTH_PARTIAL_USD = 10000;

// ── Per-child tuition estimate used when school doesn't specify ──────────────
const ESTIMATED_ANNUAL_TUITION_PER_CHILD_USD = 20000;

// ── Salary benchmark thresholds ─────────────────────────────────────────────
const PERCENTILE_GREEN = 60;
const PERCENTILE_YELLOW_LOW = 40;

export function convertToUSD(amount: number, currencyCode: string): number {
  const rate = exchangeRates[currencyCode.toUpperCase()];
  if (!rate) {
    console.warn(`Unknown currency code: ${currencyCode}. Treating as USD.`);
    return amount;
  }
  return amount * rate;
}

export function calculatePercentile(
  totalCompUSD: number,
  region: string,
  role: string,
  curriculumType: string,
): number {
  // Find matching salary range — try exact curriculum match first, then fall back to any
  let match = salaryRanges.find(
    (s) => s.region === region && s.role === role && s.curriculumType === curriculumType,
  );

  if (!match) {
    // Fallback: same region + role, any curriculum
    match = salaryRanges.find((s) => s.region === region && s.role === role);
  }

  if (!match) {
    // Last resort: role only, across all regions
    match = salaryRanges.find((s) => s.role === role);
  }

  if (!match) {
    return 50; // No data — assume median
  }

  const { minUSD, maxUSD, medianUSD } = match;

  if (totalCompUSD <= minUSD) return 10;
  if (totalCompUSD >= maxUSD) return 95;

  // Linear interpolation: map the range [min → median → max] to [10 → 50 → 90]
  if (totalCompUSD <= medianUSD) {
    return 10 + ((totalCompUSD - minUSD) / (medianUSD - minUSD)) * 40;
  } else {
    return 50 + ((totalCompUSD - medianUSD) / (maxUSD - medianUSD)) * 40;
  }
}

export function generateFlags(
  input: PackageInput,
  breakdown: PackageReport['breakdown'],
  cityData: CityData | undefined,
  salaryData: SalaryRange | undefined,
): PackageFlag[] {
  const flags: PackageFlag[] = [];

  // ── Housing ────────────────────────────────────────────────────────────────
  if (input.housingType === 'none') {
    flags.push({
      type: 'red',
      category: 'Housing',
      message: 'No housing benefit included. This is non-standard for most international packages.',
    });
  } else {
    const typicalHousing = salaryData?.typicalHousingUSD ?? 15000;
    if (breakdown.housingValueUSD >= typicalHousing) {
      flags.push({
        type: 'green',
        category: 'Housing',
        message: `Housing value ($${breakdown.housingValueUSD.toLocaleString()}) is at or above the regional benchmark ($${typicalHousing.toLocaleString()}).`,
      });
    } else {
      flags.push({
        type: 'yellow',
        category: 'Housing',
        message: `Housing value ($${breakdown.housingValueUSD.toLocaleString()}) is below the regional benchmark ($${typicalHousing.toLocaleString()}).`,
      });
    }
  }

  // ── Flights ────────────────────────────────────────────────────────────────
  if (input.annualFlights === 0) {
    flags.push({
      type: 'red',
      category: 'Flights',
      message: 'No annual flights provided. Most international packages include at least one return flight home per year.',
    });
  } else if (input.annualFlights === 1) {
    flags.push({
      type: 'yellow',
      category: 'Flights',
      message: 'Only one return flight per year included. Two is standard in Middle East and Africa packages.',
    });
  } else {
    flags.push({
      type: 'green',
      category: 'Flights',
      message: `${input.annualFlights} return flights per year — meets or exceeds the regional standard.`,
    });
  }

  // ── Health insurance ────────────────────────────────────────────────────────
  if (input.healthInsurance === 'none') {
    flags.push({
      type: 'red',
      category: 'Health Insurance',
      message: 'No health insurance provided. This is a serious gap — private health cover abroad can cost $5,000–$15,000 per year.',
    });
  } else if (input.healthInsurance === 'individual') {
    flags.push({
      type: 'yellow',
      category: 'Health Insurance',
      message: 'Individual-only health insurance. If you have a family, you will need to cover dependants privately.',
    });
  } else if (input.healthInsurance === 'partial') {
    flags.push({
      type: 'yellow',
      category: 'Health Insurance',
      message: 'Partial health insurance coverage. Confirm exactly what is and is not covered before accepting.',
    });
  } else {
    flags.push({
      type: 'green',
      category: 'Health Insurance',
      message: 'Full family health insurance included — this is a significant benefit worth $10,000–$15,000 annually.',
    });
  }

  // ── Tuition remission ───────────────────────────────────────────────────────
  if (input.numberOfKids > 0) {
    if (input.tuitionRemissionPercent === 100) {
      flags.push({
        type: 'green',
        category: 'Tuition Remission',
        message: `Full 100% tuition remission for ${input.numberOfKids} child${input.numberOfKids > 1 ? 'ren' : ''} — a major benefit worth $${(input.numberOfKids * ESTIMATED_ANNUAL_TUITION_PER_CHILD_USD).toLocaleString()}+ annually.`,
      });
    } else if (input.tuitionRemissionPercent >= 50) {
      flags.push({
        type: 'yellow',
        category: 'Tuition Remission',
        message: `${input.tuitionRemissionPercent}% tuition remission. The remaining ${100 - input.tuitionRemissionPercent}% out-of-pocket cost is significant with ${input.numberOfKids} child${input.numberOfKids > 1 ? 'ren' : ''}.`,
      });
    } else {
      flags.push({
        type: 'red',
        category: 'Tuition Remission',
        message: `Only ${input.tuitionRemissionPercent}% tuition remission for ${input.numberOfKids} child${input.numberOfKids > 1 ? 'ren' : ''}. Out-of-pocket tuition costs will substantially reduce your savings.`,
      });
    }
  }

  // ── Salary percentile ───────────────────────────────────────────────────────
  const cityRegion = cityData?.region ?? '';
  const percentile = calculatePercentile(
    breakdown.baseSalaryUSD,
    cityRegion,
    input.role,
    input.curriculumType,
  );

  if (percentile >= PERCENTILE_GREEN) {
    flags.push({
      type: 'green',
      category: 'Base Salary',
      message: `Your base salary is in approximately the ${Math.round(percentile)}th percentile for ${input.role.replace(/_/g, ' ')} roles in this region.`,
    });
  } else if (percentile >= PERCENTILE_YELLOW_LOW) {
    flags.push({
      type: 'yellow',
      category: 'Base Salary',
      message: `Your base salary is around the ${Math.round(percentile)}th percentile — near the median but room to negotiate upward.`,
    });
  } else {
    flags.push({
      type: 'red',
      category: 'Base Salary',
      message: `Your base salary is in approximately the ${Math.round(percentile)}th percentile — below the 40th percentile for this region and role.`,
    });
  }

  // ── Tax environment ─────────────────────────────────────────────────────────
  const taxData = taxRates.find((t) => t.country === input.country);
  if (taxData) {
    if (taxData.taxFree) {
      flags.push({
        type: 'green',
        category: 'Tax',
        message: `${input.country} is a tax-free environment for expat teachers — every dollar earned is a dollar kept.`,
      });
    } else if (taxData.incomeTaxRate < 0.20) {
      flags.push({
        type: 'yellow',
        category: 'Tax',
        message: `Effective income tax rate in ${input.country} is approximately ${Math.round(taxData.incomeTaxRate * 100)}% — relatively low but not zero.`,
      });
    } else {
      flags.push({
        type: 'yellow',
        category: 'Tax',
        message: `Effective income tax rate in ${input.country} is approximately ${Math.round(taxData.incomeTaxRate * 100)}% — factor this into your take-home calculations.`,
      });
    }
  }

  // ── End of contract bonus ───────────────────────────────────────────────────
  if (input.endOfContractBonusUSD > 0) {
    flags.push({
      type: 'green',
      category: 'End of Contract Bonus',
      message: `End-of-contract bonus of $${input.endOfContractBonusUSD.toLocaleString()} included (annualised: $${breakdown.bonusAnnualizedUSD.toLocaleString()}/year).`,
    });
  } else {
    flags.push({
      type: 'yellow',
      category: 'End of Contract Bonus',
      message: 'No end-of-contract or gratuity bonus listed. This is worth negotiating — common in Middle East and Asia packages.',
    });
  }

  // ── Professional development budget ────────────────────────────────────────
  if (input.pdBudgetUSD > 0) {
    flags.push({
      type: 'green',
      category: 'PD Budget',
      message: `Professional development budget of $${input.pdBudgetUSD.toLocaleString()} per year included.`,
    });
  }

  // ── Utilities ───────────────────────────────────────────────────────────────
  if (input.utilitiesCovered) {
    flags.push({
      type: 'green',
      category: 'Utilities',
      message: 'Utilities covered by the school — saves approximately $1,200–$3,600/year depending on location.',
    });
  }

  return flags;
}

export function generateNegotiationTips(
  input: PackageInput,
  flags: PackageFlag[],
): string[] {
  const tips: string[] = [];
  const redAndYellowCategories = flags
    .filter((f) => f.type === 'red' || f.type === 'yellow')
    .map((f) => f.category);

  if (redAndYellowCategories.includes('Housing')) {
    if (input.housingType === 'none') {
      tips.push(
        'Request a housing allowance — this is the single most important benefit to negotiate in an international package. Aim for at least 12 months of local rent covered.',
      );
    } else {
      tips.push(
        'Negotiate a higher housing allowance. Research local rents and present data to show the current allowance falls short of covering a suitable property.',
      );
    }
  }

  if (redAndYellowCategories.includes('Flights')) {
    if (input.annualFlights === 0) {
      tips.push(
        'Request at least one annual return flight to your home country. Frame it as standard industry practice — almost all international packages include this.',
      );
    } else {
      tips.push(
        'Ask for a second annual return flight, especially if you have family. This is standard in Middle East and Africa contracts.',
      );
    }
  }

  if (redAndYellowCategories.includes('Health Insurance')) {
    if (input.healthInsurance === 'none') {
      tips.push(
        'Health insurance is a non-negotiable — request full coverage before accepting. Without it, a single hospitalisation abroad could cost tens of thousands.',
      );
    } else if (input.healthInsurance === 'individual' && input.numberOfKids > 0) {
      tips.push(
        'Negotiate family health insurance coverage for your dependants. If the school cannot provide it, request an additional allowance to purchase a family policy independently.',
      );
    } else {
      tips.push(
        'Clarify the exact coverage level and any exclusions in the health insurance policy before signing.',
      );
    }
  }

  if (redAndYellowCategories.includes('Tuition Remission') && input.numberOfKids > 0) {
    tips.push(
      `Push for 100% tuition remission for your ${input.numberOfKids} child${input.numberOfKids > 1 ? 'ren' : ''}. Most competitive international schools offer full tuition as standard. If they resist, negotiate to at least 75% or request a dedicated education allowance.`,
    );
  }

  if (redAndYellowCategories.includes('Base Salary')) {
    tips.push(
      'Your base salary is below the regional median. Come to negotiations with salary data (international teacher surveys, ISS, Search Associates benchmarks) and make a clear case for a higher base. Aim for at least the 50th percentile.',
    );
  }

  if (redAndYellowCategories.includes('End of Contract Bonus')) {
    tips.push(
      'Ask about an end-of-contract gratuity or loyalty bonus. In the Middle East this is legally required; elsewhere, a $5,000–$15,000 completion bonus is a reasonable ask for a 2-year contract.',
    );
  }

  if (input.relocationAllowanceUSD === 0) {
    tips.push(
      'No relocation allowance listed. Request reimbursement for moving costs — $3,000–$8,000 is typical for international relocations.',
    );
  }

  if (input.shippingAllowanceUSD === 0 && input.relocationAllowanceUSD === 0) {
    tips.push(
      'Ask for a shipping allowance to cover the cost of moving personal belongings. Even a partial contribution (e.g., one container or a set weight allowance) meaningfully reduces upfront costs.',
    );
  }

  if (!input.utilitiesCovered) {
    tips.push(
      'If utilities are not covered, factor in $100–$300/month for electricity, water, and internet when assessing your net savings — and consider asking the school to include this.',
    );
  }

  if (input.pdBudgetUSD === 0) {
    tips.push(
      'Request a professional development allowance ($500–$2,000/year is typical). Framing it around your growth benefits the school too — most administrators respond positively to this ask.',
    );
  }

  if (input.pensionContributionPercent === 0) {
    tips.push(
      'No pension or retirement contribution listed. If your home country requires contributions, confirm how this is handled. Some schools offer a pension substitute or a cash supplement.',
    );
  }

  return tips;
}

export function analyzePackage(
  input: PackageInput,
): Omit<PackageReport, 'aiSummary'> {
  // ── Convert base salary to USD ─────────────────────────────────────────────
  const baseSalaryUSD = convertToUSD(input.baseSalaryAmount, input.baseSalaryCurrency);

  // ── Housing ────────────────────────────────────────────────────────────────
  let housingValueUSD = 0;
  if (input.housingType === 'allowance' && input.housingAllowanceAmount && input.housingAllowanceCurrency) {
    housingValueUSD = convertToUSD(input.housingAllowanceAmount, input.housingAllowanceCurrency);
  } else if (input.housingType === 'provided' && input.housingEstimatedValue) {
    housingValueUSD = input.housingEstimatedValue; // assumed USD
  }

  // ── Flights ────────────────────────────────────────────────────────────────
  const flightCostPerTrip = input.flightClass === 'business' ? BUSINESS_FLIGHT_USD : ECONOMY_FLIGHT_USD;
  const flightsValueUSD = input.annualFlights * flightCostPerTrip;

  // ── Health insurance ────────────────────────────────────────────────────────
  let healthInsuranceValueUSD = 0;
  switch (input.healthInsurance) {
    case 'full_family':
      healthInsuranceValueUSD = HEALTH_FULL_FAMILY_USD;
      break;
    case 'individual':
      healthInsuranceValueUSD = HEALTH_INDIVIDUAL_USD;
      break;
    case 'partial':
      healthInsuranceValueUSD = HEALTH_PARTIAL_USD;
      break;
    case 'none':
    default:
      healthInsuranceValueUSD = 0;
  }

  // ── Tuition ────────────────────────────────────────────────────────────────
  const tuitionValueUSD =
    input.numberOfKids > 0
      ? (input.tuitionRemissionPercent / 100) *
        ESTIMATED_ANNUAL_TUITION_PER_CHILD_USD *
        input.numberOfKids
      : 0;

  // ── End of contract bonus (annualised) ─────────────────────────────────────
  const bonusAnnualizedUSD =
    input.contractLengthYears > 0
      ? input.endOfContractBonusUSD / input.contractLengthYears
      : 0;

  // ── Other benefits (one-time grants spread over contract, PD, pension) ─────
  const settlingInAnnualised =
    input.contractLengthYears > 0
      ? input.settlingInGrantUSD / input.contractLengthYears
      : 0;
  const shippingAnnualised =
    input.contractLengthYears > 0
      ? input.shippingAllowanceUSD / input.contractLengthYears
      : 0;

  // Utilities estimated value: ~$2,400/yr if covered (conservative mid-range)
  const utilitiesValueUSD = input.utilitiesCovered ? 2400 : 0;

  const pensionValueUSD = (input.pensionContributionPercent / 100) * baseSalaryUSD;

  const otherBenefitsUSD =
    settlingInAnnualised +
    shippingAnnualised +
    utilitiesValueUSD +
    pensionValueUSD +
    input.pdBudgetUSD;

  // ── Total compensation ──────────────────────────────────────────────────────
  const totalCompensationUSD =
    baseSalaryUSD +
    housingValueUSD +
    flightsValueUSD +
    healthInsuranceValueUSD +
    tuitionValueUSD +
    bonusAnnualizedUSD +
    otherBenefitsUSD;

  // ── Build the breakdown ────────────────────────────────────────────────────
  const breakdown: PackageReport['breakdown'] = {
    baseSalaryUSD: Math.round(baseSalaryUSD),
    housingValueUSD: Math.round(housingValueUSD),
    flightsValueUSD: Math.round(flightsValueUSD),
    healthInsuranceValueUSD: Math.round(healthInsuranceValueUSD),
    tuitionValueUSD: Math.round(tuitionValueUSD),
    bonusAnnualizedUSD: Math.round(bonusAnnualizedUSD),
    otherBenefitsUSD: Math.round(otherBenefitsUSD),
  };

  // ── Look up city and salary data ───────────────────────────────────────────
  const cityData = cities.find(
    (c) => c.city.toLowerCase() === input.city.toLowerCase(),
  );

  const salaryData =
    salaryRanges.find(
      (s) =>
        s.region === cityData?.region &&
        s.role === input.role &&
        s.curriculumType === input.curriculumType,
    ) ??
    salaryRanges.find(
      (s) => s.region === cityData?.region && s.role === input.role,
    );

  // ── Estimated annual savings ────────────────────────────────────────────────
  // Use city expenses if available; fall back to a rough global estimate
  const taxData = taxRates.find((t) => t.country === input.country);
  const effectiveTaxRate = taxData
    ? taxData.incomeTaxRate + taxData.socialSecurityRate
    : 0.15;

  const netSalaryUSD = baseSalaryUSD * (1 - effectiveTaxRate);

  let annualLivingExpensesUSD: number;
  if (cityData) {
    const isFamily = input.numberOfKids > 0 || false;
    annualLivingExpensesUSD = isFamily
      ? cityData.monthlyExpensesFamilyUSD * 12
      : cityData.monthlyExpensesSingleUSD * 12;
  } else {
    // Generic fallback
    annualLivingExpensesUSD = 30000;
  }

  // Subtract housing from living expenses if housing is provided — already covered
  const livingExpensesAfterBenefits = Math.max(
    0,
    annualLivingExpensesUSD - housingValueUSD - utilitiesValueUSD,
  );

  const estimatedAnnualSavingsUSD = Math.round(
    netSalaryUSD - livingExpensesAfterBenefits,
  );

  // ── Percentile ─────────────────────────────────────────────────────────────
  const percentile = Math.round(
    calculatePercentile(
      totalCompensationUSD,
      cityData?.region ?? '',
      input.role,
      input.curriculumType,
    ),
  );

  // ── Flags and negotiation tips ─────────────────────────────────────────────
  const flags = generateFlags(input, breakdown, cityData, salaryData);
  const negotiationTips = generateNegotiationTips(input, flags);

  return {
    totalCompensationUSD: Math.round(totalCompensationUSD),
    estimatedAnnualSavingsUSD,
    percentile,
    flags,
    negotiationTips,
    breakdown,
  };
}
