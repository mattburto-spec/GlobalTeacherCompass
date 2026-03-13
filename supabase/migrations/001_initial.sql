-- GlobalTeacherCompass — Initial Schema
-- Merges data from cities.ts + countries.ts + tax-rates.ts into city_profiles
-- Adds school_profiles, salary_data, exchange_rates, scrape_logs

-- ── City Profiles ──────────────────────────────────────────────────────────────
CREATE TABLE city_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  region TEXT NOT NULL,
  currency TEXT,
  currency_code TEXT,
  flag_emoji TEXT,

  -- Cost of living
  cost_of_living_index NUMERIC,
  average_rent_1bed_usd NUMERIC,
  average_rent_3bed_usd NUMERIC,
  average_meal_out_usd NUMERIC,
  monthly_expenses_single_usd NUMERIC,
  monthly_expenses_family_usd NUMERIC,

  -- Tax
  income_tax_rate NUMERIC DEFAULT 0,
  social_security_rate NUMERIC DEFAULT 0,
  tax_free BOOLEAN DEFAULT FALSE,
  tax_notes TEXT,

  -- Quality scores (1-10 scale from legacy data)
  quality_of_life_score NUMERIC,
  safety_score NUMERIC,
  healthcare_score NUMERIC,
  international_school_count INTEGER,

  -- New dimensions (populated by scrapers)
  air_quality_aqi NUMERIC,
  english_proficiency_score NUMERIC,
  internet_speed_mbps NUMERIC,
  flight_hub_score NUMERIC,
  direct_routes_count INTEGER,
  expat_population_estimate INTEGER,
  climate_type TEXT,
  avg_temp_high NUMERIC,
  avg_temp_low NUMERIC,

  -- Computed
  livability_score NUMERIC,

  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(city, country)
);

-- ── School Profiles ────────────────────────────────────────────────────────────
CREATE TABLE school_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  tier INTEGER CHECK (tier BETWEEN 1 AND 4),
  curricula TEXT[] DEFAULT '{}',
  accreditations TEXT[] DEFAULT '{}',
  year_founded INTEGER,
  student_count INTEGER,
  is_nonprofit BOOLEAN,
  avg_ib_score NUMERIC,
  review_sentiment_score NUMERIC,
  review_count INTEGER DEFAULT 0,
  website_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Salary Data ────────────────────────────────────────────────────────────────
CREATE TABLE salary_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES school_profiles(id) ON DELETE SET NULL,
  city TEXT,
  country TEXT,
  region TEXT NOT NULL,
  role TEXT NOT NULL,
  curriculum TEXT,
  years_experience INTEGER,
  salary_amount NUMERIC,
  salary_currency TEXT,
  salary_usd NUMERIC,
  housing_type TEXT,
  housing_value_usd NUMERIC,
  flights_provided BOOLEAN,
  flights_count INTEGER,
  flights_value_usd NUMERIC,
  tuition_remission_percent NUMERIC,
  tuition_children_covered INTEGER,
  health_insurance TEXT,
  other_benefits JSONB DEFAULT '{}',
  total_package_usd NUMERIC,
  source TEXT NOT NULL,
  source_url TEXT,
  report_date DATE,
  confidence_score NUMERIC DEFAULT 0.5,
  validation_status TEXT DEFAULT 'auto_approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Salary Data Staging ────────────────────────────────────────────────────────
CREATE TABLE salary_data_staging (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES school_profiles(id) ON DELETE SET NULL,
  city TEXT,
  country TEXT,
  region TEXT NOT NULL,
  role TEXT NOT NULL,
  curriculum TEXT,
  years_experience INTEGER,
  salary_amount NUMERIC,
  salary_currency TEXT,
  salary_usd NUMERIC,
  housing_type TEXT,
  housing_value_usd NUMERIC,
  flights_provided BOOLEAN,
  flights_count INTEGER,
  flights_value_usd NUMERIC,
  tuition_remission_percent NUMERIC,
  tuition_children_covered INTEGER,
  health_insurance TEXT,
  other_benefits JSONB DEFAULT '{}',
  total_package_usd NUMERIC,
  source TEXT NOT NULL,
  source_url TEXT,
  report_date DATE,
  confidence_score NUMERIC DEFAULT 0.5,
  validation_status TEXT DEFAULT 'pending_review',
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Exchange Rates ─────────────────────────────────────────────────────────────
CREATE TABLE exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code TEXT NOT NULL,
  rate_to_usd NUMERIC NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(currency_code, (fetched_at::date))
);

-- ── Scrape Logs ────────────────────────────────────────────────────────────────
CREATE TABLE scrape_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  records_found INTEGER DEFAULT 0,
  records_added INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  duration_ms INTEGER,
  status TEXT DEFAULT 'success'
);

-- ── Indexes ────────────────────────────────────────────────────────────────────
CREATE INDEX idx_city_profiles_city_country ON city_profiles(city, country);
CREATE INDEX idx_city_profiles_region ON city_profiles(region);
CREATE INDEX idx_salary_data_region_role ON salary_data(region, role);
CREATE INDEX idx_salary_data_city ON salary_data(city);
CREATE INDEX idx_salary_data_source ON salary_data(source);
CREATE INDEX idx_salary_data_validation ON salary_data(validation_status);
CREATE INDEX idx_salary_staging_status ON salary_data_staging(validation_status);
CREATE INDEX idx_school_profiles_city ON school_profiles(city, country);
CREATE INDEX idx_exchange_rates_code ON exchange_rates(currency_code);
CREATE INDEX idx_scrape_logs_source ON scrape_logs(source);

-- ── Salary Aggregates View ─────────────────────────────────────────────────────
CREATE VIEW salary_aggregates AS
SELECT
  region,
  city,
  role,
  curriculum,
  COUNT(*) as data_points,
  PERCENTILE_CONT(0.1) WITHIN GROUP (ORDER BY total_package_usd) as p10,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_package_usd) as p25,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_package_usd) as median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_package_usd) as p75,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY total_package_usd) as p90,
  MIN(salary_usd) as min_salary_usd,
  MAX(salary_usd) as max_salary_usd,
  AVG(housing_value_usd) as avg_housing_usd,
  AVG(tuition_remission_percent) as avg_tuition_percent,
  MAX(report_date) as latest_report
FROM salary_data
WHERE validation_status = 'auto_approved'
  AND report_date > NOW() - INTERVAL '2 years'
GROUP BY region, city, role, curriculum;
