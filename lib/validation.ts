import { createServerClient } from './supabase';

export interface ValidationResult {
  valid: boolean;
  status: 'auto_approved' | 'flagged' | 'rejected';
  reasons: string[];
}

export interface SalarySubmission {
  city?: string;
  country?: string;
  region: string;
  role: string;
  curriculum?: string;
  years_experience?: number;
  salary_amount?: number;
  salary_currency?: string;
  salary_usd: number;
  housing_type?: string;
  housing_value_usd?: number;
  flights_count?: number;
  tuition_remission_percent?: number;
  health_insurance?: string;
  total_package_usd: number;
  source: string;
  source_url?: string;
  confidence_score?: number;
}

const VALID_ROLES = ['classroom_teacher', 'head_of_department', 'senior_leader', 'principal'];
const VALID_REGIONS = ['Middle East', 'East Asia', 'Southeast Asia', 'Europe', 'Africa', 'South America', 'Central America', 'South Asia', 'Central Asia', 'Oceania'];

// ── Range check ────────────────────────────────────────────────────────────────

function checkRange(data: SalarySubmission): string[] {
  const issues: string[] = [];

  if (data.salary_usd < 10000) {
    issues.push(`Salary too low: $${data.salary_usd} (min $10,000)`);
  }
  if (data.salary_usd > 300000) {
    issues.push(`Salary too high: $${data.salary_usd} (max $300,000)`);
  }
  if (data.total_package_usd < 10000) {
    issues.push(`Total package too low: $${data.total_package_usd}`);
  }
  if (data.total_package_usd > 500000) {
    issues.push(`Total package too high: $${data.total_package_usd}`);
  }
  if (data.housing_value_usd !== undefined && data.housing_value_usd > 100000) {
    issues.push(`Housing value unusually high: $${data.housing_value_usd}`);
  }

  return issues;
}

// ── Completeness score ─────────────────────────────────────────────────────────

export function calculateCompleteness(data: SalarySubmission): number {
  const fields = [
    data.city, data.country, data.region, data.role, data.curriculum,
    data.salary_usd, data.housing_type, data.housing_value_usd,
    data.flights_count, data.tuition_remission_percent,
    data.health_insurance, data.years_experience,
  ];
  const filled = fields.filter(f => f !== undefined && f !== null && f !== '').length;
  return filled / fields.length;
}

// ── Field validation ───────────────────────────────────────────────────────────

function checkFields(data: SalarySubmission): string[] {
  const issues: string[] = [];

  if (!VALID_ROLES.includes(data.role)) {
    issues.push(`Invalid role: ${data.role}`);
  }
  if (!VALID_REGIONS.includes(data.region)) {
    issues.push(`Invalid region: ${data.region}`);
  }
  if (data.tuition_remission_percent !== undefined) {
    if (data.tuition_remission_percent < 0 || data.tuition_remission_percent > 100) {
      issues.push(`Invalid tuition remission: ${data.tuition_remission_percent}%`);
    }
  }

  return issues;
}

// ── Statistical outlier check ──────────────────────────────────────────────────

async function checkOutlier(data: SalarySubmission): Promise<string[]> {
  const issues: string[] = [];

  try {
    const db = createServerClient();
    if (!db) return issues;

    // Get existing salary data for the same region + role
    const { data: existing } = await db
      .from('salary_data')
      .select('salary_usd')
      .eq('region', data.region)
      .eq('role', data.role)
      .eq('validation_status', 'auto_approved')
      .not('salary_usd', 'is', null);

    if (!existing || existing.length < 5) return issues; // Not enough data to judge

    const values = existing.map(r => Number(r.salary_usd));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);

    if (stdDev > 0 && Math.abs(data.salary_usd - mean) > 3 * stdDev) {
      issues.push(
        `Salary $${data.salary_usd} is >3 standard deviations from mean $${Math.round(mean)} for ${data.region} ${data.role}`
      );
    }
  } catch {
    // Silently skip if DB unavailable
  }

  return issues;
}

// ── Duplicate detection ────────────────────────────────────────────────────────

async function checkDuplicate(data: SalarySubmission): Promise<string[]> {
  const issues: string[] = [];

  try {
    const db = createServerClient();
    if (!db) return issues;

    let query = db
      .from('salary_data')
      .select('id, salary_usd')
      .eq('region', data.region)
      .eq('role', data.role);

    if (data.city) query = query.eq('city', data.city);

    const { data: matches } = await query;

    if (matches) {
      const nearDupes = matches.filter(m => {
        const diff = Math.abs(Number(m.salary_usd) - data.salary_usd);
        return diff / data.salary_usd < 0.05; // Within 5%
      });
      if (nearDupes.length > 0) {
        issues.push(`Possible duplicate: ${nearDupes.length} existing entries with salary within 5%`);
      }
    }
  } catch {
    // Silently skip
  }

  return issues;
}

// ── Main validation function ───────────────────────────────────────────────────

export async function validateSalaryData(data: SalarySubmission): Promise<ValidationResult> {
  const allIssues: string[] = [];

  // Field validation (sync)
  allIssues.push(...checkFields(data));

  // Reject immediately on invalid fields
  if (allIssues.length > 0) {
    return { valid: false, status: 'rejected', reasons: allIssues };
  }

  // Range check (sync)
  const rangeIssues = checkRange(data);
  allIssues.push(...rangeIssues);

  // Statistical outlier (async)
  const outlierIssues = await checkOutlier(data);
  allIssues.push(...outlierIssues);

  // Duplicate detection (async)
  const dupeIssues = await checkDuplicate(data);
  allIssues.push(...dupeIssues);

  // Determine status
  if (allIssues.length === 0) {
    const completeness = calculateCompleteness(data);
    const confidence = data.confidence_score ?? completeness;
    if (confidence >= 0.6) {
      return { valid: true, status: 'auto_approved', reasons: [] };
    }
    return { valid: true, status: 'flagged', reasons: ['Low confidence score'] };
  }

  // Range issues or outliers → flag for review (don't reject)
  return { valid: true, status: 'flagged', reasons: allIssues };
}
