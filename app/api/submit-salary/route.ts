import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getExchangeRate } from '@/lib/data-service';
import { validateSalaryData, calculateCompleteness } from '@/lib/validation';

export async function POST(request: Request) {
  const db = createServerClient();
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    const {
      city, country, region, role, curriculum,
      yearsExperience, salaryAmount, salaryCurrency,
      housingType, housingValueUsd, flightsCount,
      tuitionRemissionPercent, healthInsurance,
    } = body;

    if (!region || !role) {
      return NextResponse.json({ error: 'Region and role are required' }, { status: 400 });
    }

    // Convert salary to USD
    let salaryUsd = salaryAmount;
    if (salaryCurrency && salaryCurrency !== 'USD' && salaryAmount) {
      const rate = await getExchangeRate(salaryCurrency);
      salaryUsd = Math.round(salaryAmount * rate);
    }

    if (!salaryUsd || salaryUsd <= 0) {
      return NextResponse.json({ error: 'Valid salary amount is required' }, { status: 400 });
    }

    const totalPackageUsd = salaryUsd + (housingValueUsd || 0) + (flightsCount || 0) * 800;

    const submission = {
      city, country, region, role, curriculum,
      years_experience: yearsExperience,
      salary_amount: salaryAmount,
      salary_currency: salaryCurrency,
      salary_usd: salaryUsd,
      housing_type: housingType,
      housing_value_usd: housingValueUsd,
      flights_count: flightsCount,
      tuition_remission_percent: tuitionRemissionPercent,
      health_insurance: healthInsurance,
      total_package_usd: totalPackageUsd,
      source: 'user_submission' as const,
      confidence_score: calculateCompleteness({
        city, country, region, role, curriculum,
        salary_usd: salaryUsd, housing_type: housingType,
        housing_value_usd: housingValueUsd, flights_count: flightsCount,
        tuition_remission_percent: tuitionRemissionPercent,
        health_insurance: healthInsurance, years_experience: yearsExperience,
        total_package_usd: totalPackageUsd, source: 'user_submission',
      }),
    };

    // Validate
    const validation = await validateSalaryData(submission);

    if (!validation.valid) {
      return NextResponse.json({
        error: 'Validation failed',
        reasons: validation.reasons,
      }, { status: 400 });
    }

    // Insert into appropriate table
    const table = validation.status === 'auto_approved' ? 'salary_data' : 'salary_data_staging';
    const { error } = await db.from(table).insert({
      ...submission,
      report_date: new Date().toISOString().split('T')[0],
      validation_status: validation.status,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: validation.status,
      message: validation.status === 'auto_approved'
        ? 'Thank you! Your salary data has been added to our database.'
        : 'Thank you! Your submission is being reviewed.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
