import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { validateSalaryData } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SALARY_KEYWORDS = [
  'salary', 'package', 'offer', 'compensation', 'pay', 'housing',
  'contract', 'benefits', '$', 'usd', 'allowance', 'bonus',
];

const EXTRACTION_PROMPT = `Extract salary/package data from this Reddit post about international teaching.
Return ONLY valid JSON with these fields (use null for unknown values):
{
  "extractable": true,
  "city": "city name or null",
  "country": "country name or null",
  "region": "one of: Middle East, East Asia, Southeast Asia, Europe, Africa, South America, Central America, South Asia, Oceania, or null",
  "school_name": "school name if mentioned or null",
  "role": "one of: classroom_teacher, head_of_department, senior_leader, principal, or null",
  "curriculum": "one of: IB, British, American, other, or null",
  "years_experience": "number or null",
  "salary_amount": "annual salary number or null",
  "salary_currency": "3-letter currency code or null",
  "housing_type": "one of: provided, allowance, none, or null",
  "housing_value_usd": "annual housing value in USD or null",
  "flights_count": "return flights per year or null",
  "tuition_remission_percent": "number 0-100 or null",
  "health_insurance": "one of: full_family, individual, partial, none, or null",
  "sentiment": "one of: positive, negative, neutral",
  "confidence": "0.0 to 1.0 — how confident you are in the extracted data"
}
If the post doesn't contain any extractable salary/package information, return: { "extractable": false }`;

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    created_utc: number;
    permalink: string;
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const db = createServerClient();

  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Fetch recent posts from r/internationalteachers
    const subreddits = ['internationalteachers', 'teachingabroad'];
    let allPosts: RedditPost[] = [];

    for (const sub of subreddits) {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/new.json?limit=25`,
        { headers: { 'User-Agent': 'GlobalTeacherCompass/1.0' } }
      );

      if (res.ok) {
        const json = await res.json();
        allPosts = allPosts.concat(json.data?.children || []);
      }
    }

    // Filter for salary-relevant posts
    const relevantPosts = allPosts.filter(post => {
      const text = `${post.data.title} ${post.data.selftext}`.toLowerCase();
      return SALARY_KEYWORDS.some(kw => text.includes(kw));
    });

    let recordsAdded = 0;
    const errors: string[] = [];

    // Process each post with Claude
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey });

    for (const post of relevantPosts.slice(0, 10)) { // Max 10 per run
      try {
        const postText = `Title: ${post.data.title}\n\n${post.data.selftext}`.slice(0, 3000);

        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          messages: [
            { role: 'user', content: `${EXTRACTION_PROMPT}\n\nReddit post:\n${postText}` },
          ],
        });

        const content = response.content[0];
        if (content.type !== 'text') continue;

        const extracted = JSON.parse(content.text);
        if (!extracted.extractable) continue;

        // Convert salary to USD if needed
        let salaryUsd = extracted.salary_amount;
        if (extracted.salary_currency && extracted.salary_currency !== 'USD' && salaryUsd) {
          // Use exchange rates from DB
          const { data: rateData } = await db
            .from('exchange_rates')
            .select('rate_to_usd')
            .eq('currency_code', extracted.salary_currency)
            .order('fetched_at', { ascending: false })
            .limit(1)
            .single();

          if (rateData) {
            salaryUsd = Math.round(extracted.salary_amount * Number(rateData.rate_to_usd));
          }
        }

        if (!salaryUsd || !extracted.region) continue;

        const submission = {
          city: extracted.city,
          country: extracted.country,
          region: extracted.region,
          role: extracted.role || 'classroom_teacher',
          curriculum: extracted.curriculum,
          years_experience: extracted.years_experience,
          salary_amount: extracted.salary_amount,
          salary_currency: extracted.salary_currency,
          salary_usd: salaryUsd,
          housing_type: extracted.housing_type,
          housing_value_usd: extracted.housing_value_usd,
          flights_count: extracted.flights_count,
          tuition_remission_percent: extracted.tuition_remission_percent,
          health_insurance: extracted.health_insurance,
          total_package_usd: salaryUsd + (extracted.housing_value_usd || 0),
          source: 'reddit',
          source_url: `https://reddit.com${post.data.permalink}`,
          confidence_score: extracted.confidence || 0.5,
        };

        // Validate
        const validation = await validateSalaryData(submission);

        // Insert based on validation status
        const table = validation.status === 'auto_approved' ? 'salary_data' : 'salary_data_staging';
        const { error } = await db.from(table).insert({
          ...submission,
          report_date: new Date(post.data.created_utc * 1000).toISOString().split('T')[0],
          validation_status: validation.status,
        });

        if (!error) recordsAdded++;
        else errors.push(`Insert error for post ${post.data.id}: ${error.message}`);
      } catch (postErr) {
        errors.push(`Error processing post ${post.data.id}: ${postErr instanceof Error ? postErr.message : 'Unknown'}`);
      }
    }

    const durationMs = Date.now() - startTime;

    await db.from('scrape_logs').insert({
      source: 'reddit',
      records_found: relevantPosts.length,
      records_added: recordsAdded,
      errors: errors.length > 0 ? errors : [],
      duration_ms: durationMs,
      status: errors.length > 0 && recordsAdded === 0 ? 'failed' : errors.length > 0 ? 'partial' : 'success',
    });

    return NextResponse.json({
      success: true,
      posts_scanned: allPosts.length,
      relevant_posts: relevantPosts.length,
      records_added: recordsAdded,
      errors: errors.length,
      duration_ms: durationMs,
    });
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : 'Unknown error';

    await db.from('scrape_logs').insert({
      source: 'reddit',
      records_found: 0,
      records_added: 0,
      errors: [message],
      duration_ms: durationMs,
      status: 'failed',
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
