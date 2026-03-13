import { NextResponse } from 'next/server';
import type { PackageInput } from '@/data/types';
import { analyzePackage } from '@/lib/analyzer';

export async function POST(request: Request) {
  try {
    const input: PackageInput = await request.json();
    const report = analyzePackage(input);

    // Try AI summary if API key is available
    let aiSummary: string | undefined;
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const client = new Anthropic();

        const flagsSummary = report.flags
          .map((f) => `[${f.type.toUpperCase()}] ${f.category}: ${f.message}`)
          .join('\n');

        const message = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content: `You are an expert financial advisor for international school teachers. Analyze this compensation package and provide a 2-3 paragraph assessment.

Package Details:
- Location: ${input.city}, ${input.country}
- Role: ${input.role.replace(/_/g, ' ')}
- Curriculum: ${input.curriculumType}
- Total Compensation: $${report.totalCompensationUSD.toLocaleString()} USD/year
- Estimated Annual Savings: $${report.estimatedAnnualSavingsUSD.toLocaleString()} USD
- Percentile: ${report.percentile}th

Breakdown:
- Base Salary: $${report.breakdown.baseSalaryUSD.toLocaleString()}
- Housing: $${report.breakdown.housingValueUSD.toLocaleString()}
- Flights: $${report.breakdown.flightsValueUSD.toLocaleString()}
- Health Insurance: $${report.breakdown.healthInsuranceValueUSD.toLocaleString()}
- Tuition Value: $${report.breakdown.tuitionValueUSD.toLocaleString()}
- Bonus (annualized): $${report.breakdown.bonusAnnualizedUSD.toLocaleString()}
- Other: $${report.breakdown.otherBenefitsUSD.toLocaleString()}

Flags:
${flagsSummary}

Provide a concise, helpful assessment. Focus on the overall picture, key strengths and concerns, and one or two specific actionable suggestions. Be encouraging but honest. Do not repeat the numbers — the teacher can see those. Focus on what the numbers mean for their financial future.`,
            },
          ],
        });

        const textBlock = message.content.find((b) => b.type === 'text');
        aiSummary = textBlock?.text;
      } catch (err) {
        console.warn('AI summary failed, returning report without it:', err);
      }
    }

    return NextResponse.json({
      ...report,
      aiSummary,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to analyze package' }, { status: 500 });
  }
}
