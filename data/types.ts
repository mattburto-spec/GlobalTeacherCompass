export interface CityData {
  city: string;
  country: string;
  region:
    | 'Middle East'
    | 'East Asia'
    | 'Southeast Asia'
    | 'Europe'
    | 'Africa'
    | 'South America'
    | 'Central America'
    | 'South Asia'
    | 'Central Asia'
    | 'Oceania';
  costOfLivingIndex: number; // relative to NYC = 100
  averageRentOneBedroomUSD: number;
  averageMealOutUSD: number;
  monthlyExpensesSingleUSD: number; // estimated monthly living costs for a single teacher
  monthlyExpensesFamilyUSD: number; // for a family of 4
  qualityOfLifeScore: number; // 1-10
  safetyScore: number; // 1-10
  healthcareScore: number; // 1-10
  internationalSchoolCount: number;
  currency: string;
  currencyCode: string;
}

export interface SalaryRange {
  region: string;
  role: 'classroom_teacher' | 'head_of_department' | 'senior_leader' | 'principal';
  curriculumType: 'IB' | 'British' | 'American' | 'other';
  minUSD: number;
  maxUSD: number;
  medianUSD: number;
  typicalHousingUSD: number; // annual housing allowance or value
  typicalFlights: number; // annual return flights
  tuitionRemissionPercent: number; // typical %
}

export interface TaxRate {
  country: string;
  countryCode: string;
  incomeTaxRate: number; // effective rate for teacher salary range (0 = tax free)
  socialSecurityRate: number;
  notes: string;
  taxFree: boolean;
}

export interface PackageInput {
  country: string;
  city: string;
  curriculumType: 'IB' | 'British' | 'American' | 'other';
  role: 'classroom_teacher' | 'head_of_department' | 'senior_leader' | 'principal';
  baseSalaryAmount: number;
  baseSalaryCurrency: string;
  housingType: 'allowance' | 'provided' | 'none';
  housingAllowanceAmount?: number;
  housingAllowanceCurrency?: string;
  housingEstimatedValue?: number;
  annualFlights: number;
  flightClass: 'economy' | 'business';
  relocationAllowanceUSD: number;
  healthInsurance: 'full_family' | 'individual' | 'partial' | 'none';
  tuitionRemissionPercent: number;
  numberOfKids: number;
  contractLengthYears: number;
  endOfContractBonusUSD: number;
  pensionContributionPercent: number;
  shippingAllowanceUSD: number;
  settlingInGrantUSD: number;
  pdBudgetUSD: number;
  utilitiesCovered: boolean;
}

export interface PackageFlag {
  type: 'green' | 'yellow' | 'red';
  category: string;
  message: string;
}

export interface PackageReport {
  totalCompensationUSD: number;
  estimatedAnnualSavingsUSD: number;
  percentile: number;
  flags: PackageFlag[];
  aiSummary?: string;
  negotiationTips: string[];
  breakdown: {
    baseSalaryUSD: number;
    housingValueUSD: number;
    flightsValueUSD: number;
    healthInsuranceValueUSD: number;
    tuitionValueUSD: number;
    bonusAnnualizedUSD: number;
    otherBenefitsUSD: number;
  };
}

export interface Scenario {
  id: string;
  label: string;
  city: string;
  country: string;
  annualIncomeUSD: number;
  annualExpensesUSD: number;
  taxRate: number;
  annualSavingsUSD: number;
  isCurrentSituation?: boolean;
}
