import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const db = createServerClient();

  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    // Fetch rates from free API
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error(`Exchange rate API returned ${res.status}`);

    const json = await res.json();
    const rates = json.rates as Record<string, number>;

    // Only insert the currencies we care about
    const targetCurrencies = [
      'EUR', 'GBP', 'AED', 'QAR', 'SAR', 'KWD', 'OMR', 'SGD', 'HKD',
      'THB', 'MYR', 'VND', 'IDR', 'CNY', 'KRW', 'JPY', 'CHF', 'CZK',
      'EGP', 'KES', 'NGN', 'COP', 'MXN', 'BRL', 'INR', 'AUD',
    ];

    const rows = targetCurrencies
      .filter(code => rates[code])
      .map(code => ({
        currency_code: code,
        // API gives "1 USD = N units of currency", we want "1 unit = N USD"
        rate_to_usd: 1 / rates[code],
      }));

    // Always add USD = 1
    rows.push({ currency_code: 'USD', rate_to_usd: 1 });

    const { error } = await db.from('exchange_rates').insert(rows);

    const durationMs = Date.now() - startTime;

    // Log the scrape
    await db.from('scrape_logs').insert({
      source: 'exchange_rates',
      records_found: rows.length,
      records_added: error ? 0 : rows.length,
      errors: error ? [error.message] : [],
      duration_ms: durationMs,
      status: error ? 'failed' : 'success',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      rates_updated: rows.length,
      duration_ms: durationMs,
    });
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : 'Unknown error';

    await db.from('scrape_logs').insert({
      source: 'exchange_rates',
      records_found: 0,
      records_added: 0,
      errors: [message],
      duration_ms: durationMs,
      status: 'failed',
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
