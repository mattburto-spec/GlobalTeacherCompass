import type { Scenario } from '@/data/types';

// ── Regional city lists used for moving cost estimates ───────────────────────
// Cities are grouped by broad geographic region; an inter-region move costs more.
const regionMap: Record<string, string> = {
  // Middle East
  Dubai: 'middle_east',
  'Abu Dhabi': 'middle_east',
  Doha: 'middle_east',
  Riyadh: 'middle_east',
  'Kuwait City': 'middle_east',
  Muscat: 'middle_east',
  // East / Southeast Asia
  Singapore: 'asia',
  'Hong Kong': 'asia',
  Shanghai: 'asia',
  Beijing: 'asia',
  Seoul: 'asia',
  Tokyo: 'asia',
  Bangkok: 'asia',
  'Kuala Lumpur': 'asia',
  'Ho Chi Minh City': 'asia',
  Jakarta: 'asia',
  // Europe
  London: 'europe',
  Zurich: 'europe',
  Amsterdam: 'europe',
  Madrid: 'europe',
  Prague: 'europe',
  // Africa
  Cairo: 'africa',
  Nairobi: 'africa',
  Lagos: 'africa',
  // Americas
  Bogota: 'americas',
  'Mexico City': 'americas',
  'Sao Paulo': 'americas',
  // South Asia / Oceania
  Mumbai: 'south_asia',
  Bangalore: 'south_asia',
  Sydney: 'oceania',
};

/**
 * Projects wealth over `years` years for a given scenario.
 *
 * @param scenario          - The financial scenario (contains annual savings).
 * @param years             - Number of years to project.
 * @param currentSavings    - Starting wealth / savings balance (USD).
 * @param annualReturnRate  - Annual investment return rate, e.g. 0.07 for 7%.
 * @returns Array of length `years + 1` where index 0 = current savings.
 */
export function projectWealth(
  scenario: Scenario,
  years: number,
  currentSavings: number,
  annualReturnRate: number,
): number[] {
  const projection: number[] = new Array(years + 1);
  projection[0] = currentSavings;

  for (let year = 1; year <= years; year++) {
    // Compound existing balance, then add this year's savings
    projection[year] =
      projection[year - 1] * (1 + annualReturnRate) + scenario.annualSavingsUSD;
  }

  return projection;
}

/**
 * Finds the year at which `comparisonProjection` overtakes `baseProjection`,
 * accounting for an upfront moving cost deducted at year 0.
 *
 * @param baseProjection        - Wealth array for the stay/base scenario.
 * @param comparisonProjection  - Wealth array for the go/comparison scenario.
 * @param movingCostUSD         - One-time moving cost deducted from year 0 of comparison.
 * @returns The crossover year index, or null if it never crosses within the array length.
 */
export function findCrossoverYear(
  baseProjection: number[],
  comparisonProjection: number[],
  movingCostUSD: number,
): number | null {
  const years = Math.min(baseProjection.length, comparisonProjection.length);

  for (let year = 0; year < years; year++) {
    // Adjust comparison wealth by moving costs (only affects year 0 start, but we apply
    // it as a consistent offset across all years since it was a one-time outlay at year 0)
    const adjustedComparison = comparisonProjection[year] - movingCostUSD;
    if (adjustedComparison >= baseProjection[year]) {
      return year;
    }
  }

  return null; // No crossover within the projection window
}

/**
 * Calculates simple net annual savings after tax and expenses.
 *
 * @param annualIncomeUSD    - Gross annual income in USD.
 * @param annualExpensesUSD  - Total annual living expenses in USD.
 * @param taxRate            - Combined effective tax rate (e.g. 0.25 for 25%).
 * @returns Net annual savings in USD.
 */
export function calculateAnnualSavings(
  annualIncomeUSD: number,
  annualExpensesUSD: number,
  taxRate: number,
): number {
  const netIncome = annualIncomeUSD * (1 - taxRate);
  return netIncome - annualExpensesUSD;
}

/**
 * Estimates one-way moving costs between two cities based on geographic distance.
 * Returns a value in the $3,000–$12,000 range.
 *
 * Logic:
 *  - Same city: $0 (no move)
 *  - Same region: $3,000–$5,000
 *  - Adjacent regions (e.g. Middle East ↔ Asia, Europe ↔ Americas): $6,000–$8,000
 *  - Long-haul / cross-continental: $8,000–$12,000
 *
 * @param fromCity - Name of the origin city (as it appears in the cities data).
 * @param toCity   - Name of the destination city.
 * @returns Estimated moving cost in USD.
 */
export function estimateMovingCosts(fromCity: string, toCity: string): number {
  if (fromCity === toCity) return 0;

  const fromRegion = regionMap[fromCity];
  const toRegion = regionMap[toCity];

  // If we don't recognise one or both cities, return a mid-range estimate
  if (!fromRegion || !toRegion) return 7000;

  if (fromRegion === toRegion) {
    // Intra-regional move (e.g. Dubai → Abu Dhabi or Bangkok → Singapore)
    return 3500;
  }

  // Adjacent regions — closer together geographically
  const adjacentPairs: [string, string][] = [
    ['middle_east', 'asia'],
    ['middle_east', 'europe'],
    ['middle_east', 'africa'],
    ['europe', 'africa'],
    ['europe', 'americas'],
    ['asia', 'oceania'],
    ['south_asia', 'asia'],
    ['south_asia', 'middle_east'],
    ['americas', 'south_asia'],
  ];

  const isAdjacent = adjacentPairs.some(
    ([a, b]) =>
      (fromRegion === a && toRegion === b) ||
      (fromRegion === b && toRegion === a),
  );

  if (isAdjacent) {
    return 7000;
  }

  // Long-haul move (e.g. Asia → Americas, Oceania → Europe)
  return 10500;
}

/**
 * Formats a number as a currency string.
 *
 * @param amount       - The numeric amount to format.
 * @param currencyCode - Optional ISO 4217 currency code (defaults to USD).
 * @returns Formatted string, e.g. "$1,234" (USD) or "AED 1,234" (other).
 */
export function formatCurrency(amount: number, currencyCode?: string): string {
  const code = (currencyCode ?? 'USD').toUpperCase();
  const rounded = Math.round(amount);
  const formatted = Math.abs(rounded).toLocaleString('en-US');
  const sign = rounded < 0 ? '-' : '';

  if (code === 'USD') {
    return `${sign}$${formatted}`;
  }

  return `${sign}${code} ${formatted}`;
}
