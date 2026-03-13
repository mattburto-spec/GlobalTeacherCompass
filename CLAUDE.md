# Global Teacher Compass

## Project
Financial decision-making platform for international school teachers. Helps evaluate job offers, compare "stay vs go" scenarios, and get AI-powered financial guidance.

## Stack
- Next.js 15 (App Router, Turbopack) — NO src/ directory, app/ at root
- Tailwind CSS v4
- Recharts for data visualization
- Anthropic Claude SDK for AI features
- Supabase (Postgres) for database
- TypeScript throughout

## Dev Server
```bash
npm run dev  # runs on port 3000
```

## Brand Colors
- Deep Navy `#0F2B46` — primary
- Compass Gold `#D4A853` — accent
- Ocean Teal `#1A8A7D` — secondary
- Warm Sand `#F5ECD7` / `#FAF6ED` — backgrounds
- Alert Red `#C44536`
- Success Green `#2D8B4E`

## Fonts
- **Fraunces** — display/headings (use `font-[family-name:var(--font-fraunces)]`)
- **Inter** — body text (default)

## Key Directories
- `app/` — Pages and API routes
- `components/` — React components (layout, analyzer, compare, chat, explorer)
- `data/` — Static data (cities, salary ranges, tax rates, types) — used as fallback when DB unavailable
- `lib/` — Business logic (analyzer engine, financial calculations, data-service, validation, supabase client)
- `supabase/migrations/` — Database schema migrations
- `scripts/` — Seed scripts, standalone scrapers
- `docs/` — Roadmap, data strategy

## Environment Variables
- `ANTHROPIC_API_KEY` — Required for AI features (package analysis AI summary + chat + Reddit extraction). App works without it using fallback responses.
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL. App falls back to static data files without it.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key for client-side queries.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key for server-side operations (scrapers, seed).
- `CRON_SECRET` — Protects cron endpoints from unauthorized access.

## Database
- Schema in `supabase/migrations/001_initial.sql`
- Tables: `city_profiles`, `school_profiles`, `salary_data`, `salary_data_staging`, `exchange_rates`, `scrape_logs`
- View: `salary_aggregates` — percentile aggregations from salary_data
- Seed from static data: `npx tsx scripts/seed-from-static.ts`

## Data Architecture
- `lib/data-service.ts` — Async data access layer. Queries DB first, falls back to static `data/*.ts` files.
- `lib/validation.ts` — Salary data validation (range, outlier, duplicate, completeness checks)
- `lib/supabase.ts` — Browser + server Supabase clients (returns null if env vars missing)

## Cron Scrapers (Vercel Cron)
- `/api/cron/exchange-rates` — Daily at 6am UTC, fetches from open.er-api.com
- `/api/cron/reddit` — Daily at 8am UTC, extracts salary data from r/internationalteachers using Claude Haiku

## Data Files (Static Fallbacks)
All in `data/`:
- `types.ts` — All TypeScript interfaces
- `cities.ts` — 30 cities with cost-of-living data
- `salary-ranges.ts` — Salary benchmarks by region/role/curriculum
- `tax-rates.ts` — Country tax rates with expat-specific notes
- `countries.ts` — Country metadata with flag emojis
