# Data Strategy — GlobalTeacherCompass

## The Thesis
The site that has the freshest, most accurate data wins. Teachers make life-changing decisions based on this information. If our data is stale or wrong, they'll leave and never come back. If it's reliably better than what's available elsewhere, we become the default tool.

---

## Part 1: What Actually Drives Teacher Relocation Decisions

### Tier 1 — Deal Breakers
| Factor | Why It Matters | Data Source |
|--------|---------------|-------------|
| **Total compensation** | The headline number — salary + housing + flights + tuition | Salary submissions, job listings, ISR |
| **Savings potential** | What you actually keep after tax, rent, food | Calculated: comp - tax - COL |
| **School reputation/tier** | Teachers avoid "resume burners" — a bad school can set your career back | ISR reviews, IB results, accreditation status, years established |
| **Safety & political stability** | Non-negotiable for most, especially families | Global Peace Index, FCO/State Dept advisories |
| **Partner situation** | Can my partner work? Will they be miserable? | Visa rules, spousal work permit data, expat community size |

### Tier 2 — Strong Preferences
| Factor | Why It Matters | Data Source |
|--------|---------------|-------------|
| **Flight hub quality** | Can I get home without 3 connections? Cheap weekend trips? | OAG/flight route data, hub scores |
| **Children's education** | If my kids can't attend my school, what are the alternatives? | School directories, tuition data |
| **Housing quality** | "Furnished apartment" can mean very different things in Dubai vs Bogotá | Teacher reports, photos, neighborhood data |
| **Air quality** | Dealbreaker for some (Beijing, Delhi, Bangkok in burning season) | IQAir historical averages |
| **Healthcare quality** | Especially for families and older teachers | WHO data, hospital rankings, insurance coverage norms |
| **Professional development** | IB workshops, curriculum leadership opportunities, career growth | School websites, accreditation body data |

### Tier 3 — Quality of Life Multipliers
| Factor | Why It Matters | Data Source |
|--------|---------------|-------------|
| **Climate** | Some people can't do 45°C summers or dark Nordic winters | Historical climate data |
| **Expat community size** | First-timers want a safety net; veterans might not care | Expat population estimates |
| **Weekend travel opportunities** | Europe and SE Asia win here; Central Asia and parts of Africa lose | Geographic proximity scoring |
| **Food & lifestyle** | Vague but real — "Is it a fun place to live?" | Livability indices, teacher sentiment |
| **Internet quality** | Remote work, staying connected with family | Speedtest global index |
| **Language barrier** | English-friendly cities are easier for first-timers | EF English Proficiency Index |
| **Time zone** | How painful are calls home? | Simple calculation from home country |
| **Visa/bureaucracy** | Some countries make it easy (UAE), others are painful (China, Saudi) | Teacher reports, visa policy databases |

---

## Part 2: Data Sources & Scraping Plan

### Primary Sources (High Value, Regular Scraping)

#### 1. Job Listings — The Freshest Salary Data
| Source | What We Get | Frequency | Method |
|--------|------------|-----------|--------|
| **TES International** | Job postings with salary ranges, benefits listed | Daily | Scrape listings pages |
| **Search Associates** | Some public listings, salary ranges | Weekly | Scrape public listings |
| **Schrole** | Job postings, school profiles | Weekly | Scrape public listings |
| **School websites** | Direct job postings, often more detailed than aggregators | Monthly per school | Crawl career pages of top 500 schools |
| **Indeed/LinkedIn** | International school postings | Daily | API or scrape |

**What to extract from each listing:**
- School name, city, country
- Role (teacher, HoD, SLT, principal)
- Salary range (and currency)
- Housing: provided / allowance / amount
- Flights: paid / number / allowance
- Tuition: remission % / number of children
- Health insurance: included / family / level
- Contract length
- Start date
- Other benefits (PD budget, shipping, gratuity, end-of-service)

#### 2. School Quality & Reputation
| Source | What We Get | Method |
|--------|------------|--------|
| **IB Results** | Average IB diploma scores by school (publicly shared by some schools) | Scrape school websites, IB stats pages |
| **ISC Research** | School profiles, student counts, fee levels, accreditation | Paid API or partnership (gold standard) |
| **IBO school directory** | All IB World Schools with programmes offered | Scrape ibo.org/school-search |
| **CIS directory** | CIS-accredited schools | Scrape cis.org |
| **COBIS directory** | British international schools | Scrape cobis.org.uk |
| **Accreditation bodies** | WASC, NEASC, MSA — accreditation status signals quality | Scrape directories |
| **School websites** | Year founded, campus size, student count, university placements | Crawl |
| **Google Reviews** | Parent and teacher sentiment | Google Places API |

**School Tier Model (derived, not scraped):**
A school's tier is a composite:
- Accreditation count and type (dual/triple accredited = higher tier)
- Years established (longevity signals stability)
- IB results (if available)
- Teacher review sentiment (ISR, Google, Reddit)
- Package competitiveness (salary percentile for that region)
- Student enrollment trends (growing = good sign)
- Non-profit vs for-profit (non-profit generally higher tier)
- University placement data (if available)

#### 3. Cost of Living — Must Be Current
| Source | What We Get | Frequency | Method |
|--------|------------|-----------|--------|
| **Numbeo** | Rent, groceries, restaurants, transport — city level | Monthly | Scrape or API |
| **Expatistan** | Expat-focused COL comparisons | Monthly | Scrape |
| **Wise/XE** | Exchange rates | Daily | API (free tier) |
| **Local sources** | Rent listings (PropertyFinder, 99.co, etc.) for key cities | Monthly | Scrape 2-3 per region |

#### 4. Teacher Sentiment & Reviews
| Source | What We Get | Frequency | Method |
|--------|------------|-----------|--------|
| **Reddit r/internationalteachers** | Candid salary reports, school reviews, city comparisons | Daily | Reddit API (free) |
| **Reddit r/teachingabroad** | Broader but useful | Daily | Reddit API |
| **International Schools Review** | School-specific reviews with salary data | Weekly | Scrape (respect ToS) |
| **Facebook groups** | International Teachers, TES forums | Manual / quarterly | Not scrapable — use for validation |

**Reddit is gold.** Teachers post things like:
- "Just got offered $X at [school] in [city], is this good?"
- "Leaving [city] after 3 years, here's the real breakdown..."
- Annual salary survey threads

We can extract structured data from these with Claude:
```
Input: Reddit post text
Output: { city, country, school (if named), role, salary, currency, housing, flights, sentiment, year }
```

#### 5. Flight Connectivity
| Source | What We Get | Method |
|--------|------------|--------|
| **OAG / FlightConnections.com** | Direct routes from each city, number of airlines | Scrape or API |
| **Google Flights** | Route availability, typical prices to major hubs | Scrape (careful) |
| **Airport rankings** | Hub scores (Skytrax, ACI) | Annual scrape |

**Flight Hub Score (calculated):**
- Number of direct international routes
- Connections to major teacher-origin hubs (London, NYC, Sydney, Toronto, Dublin)
- Average flight cost to 3 nearest major hubs
- Low-cost carrier availability (weekend travel factor)

#### 6. Livability & Safety
| Source | What We Get | Frequency |
|--------|------------|-----------|
| **Global Peace Index** | Country-level safety ranking | Annual |
| **Mercer Quality of Living** | City-level livability | Annual |
| **IQAir** | Air quality by city, historical trends | Monthly |
| **WHO** | Healthcare quality indicators | Annual |
| **EF EPI** | English proficiency by country | Annual |
| **Speedtest Global Index** | Internet speed by country | Monthly |
| **Climate data** | Temperature, rainfall, humidity averages | Static (one-time) |

---

## Part 3: The Data Model

### Core Entity: City Profile
```
city_profiles:
  - city, country, region
  - cost_of_living_index (updated monthly)
  - monthly_expenses_single, monthly_expenses_family
  - average_rent_1bed, average_rent_3bed
  - tax_rate, social_security_rate, tax_free
  - safety_score (0-100)
  - healthcare_score (0-100)
  - air_quality_aqi (annual average)
  - english_proficiency_score
  - internet_speed_mbps
  - flight_hub_score (0-100)
  - direct_routes_count
  - expat_population_estimate
  - climate_type (tropical, arid, temperate, continental, polar)
  - avg_temp_high, avg_temp_low (annual)
  - livability_score (composite)
  - last_updated
```

### Core Entity: School Profile
```
school_profiles:
  - name, city, country
  - tier (1-4, calculated)
  - curricula_offered (IB, British, American, etc.)
  - accreditations (CIS, WASC, NEASC, etc.)
  - year_founded
  - student_count
  - is_nonprofit
  - avg_ib_score (if IB school)
  - review_sentiment_score (0-100, from ISR/Reddit/Google)
  - review_count
  - website_url
  - last_updated
```

### Core Entity: Salary Data Points
```
salary_data:
  - school_id (nullable — some reports are anonymous)
  - city, country, region
  - role (classroom_teacher, hod, slt, principal)
  - curriculum (IB, British, American, etc.)
  - years_experience
  - salary_amount, salary_currency, salary_usd
  - housing_type (provided, allowance, included_in_salary)
  - housing_value_usd
  - flights_provided, flights_count, flights_value_usd
  - tuition_remission_percent, tuition_children_covered
  - health_insurance (individual, family, none)
  - other_benefits (PD budget, shipping, gratuity, bonus)
  - total_package_usd (calculated)
  - source (reddit, isr, job_listing, user_submission)
  - source_url
  - report_date
  - confidence_score (how complete/reliable is this data point)
```

### Derived: Savings Model
```
For each city × role × curriculum × family_status:
  median_salary = percentile(salary_data, 50)
  housing_value = median(housing_values) OR city_profile.avg_rent
  tax_burden = salary × effective_tax_rate
  living_costs = city_profile.monthly_expenses × 12
  annual_savings = median_salary + housing_value - tax_burden - living_costs
```

---

## Part 4: Scraping Architecture

### Tech Stack
- **Scraper runtime**: Node.js scripts (or Python with BeautifulSoup/Scrapy)
- **Browser automation**: Playwright (for JS-rendered pages)
- **Scheduling**: Cron jobs or Vercel Cron
- **Storage**: Supabase (Postgres)
- **AI extraction**: Claude Haiku for unstructured text → structured data
- **Monitoring**: Alert if a scraper fails or data looks anomalous

### Scraping Schedule
| Source | Frequency | Priority |
|--------|-----------|----------|
| Job listings (TES, Schrole) | Daily | High |
| Reddit threads | Daily | High |
| Exchange rates | Daily | Medium |
| Numbeo/Expatistan COL | Monthly | High |
| School directories (IBO, CIS) | Quarterly | Medium |
| IQAir, Speedtest | Monthly | Low |
| Global Peace Index, Mercer | Annually | Low |
| School websites (careers pages) | Monthly | Medium |

### Data Quality Pipeline
```
Raw scrape → AI extraction (Claude) → Validation rules → Staging table → Review → Production
```

Validation rules:
- Salary must be within 3σ of existing data for that city/role
- COL changes > 15% month-over-month get flagged for review
- Duplicate detection (same school + role + date range)
- Currency conversion sanity check
- Completeness score (how many fields are filled)

### Dealing with Messy Data
Reddit posts and reviews are unstructured. Pipeline:
1. Scrape raw text
2. Send to Claude Haiku with extraction prompt
3. Claude returns structured JSON with confidence scores
4. Low-confidence extractions get queued for human review
5. High-confidence data goes straight to staging

---

## Part 5: Building the Moat

### Flywheel
```
More data → Better recommendations → More users → More salary submissions → More data
```

### User-Submitted Data (Phase 3)
- Anonymous salary submission form (takes 2 minutes)
- Incentive: "Submit your package → unlock full city comparison data"
- Verification: cross-reference submissions against known school data
- Gamification: "You're one of 47 teachers who've shared data from Dubai"

### What Makes Us Better Than Alternatives
| Competitor | Their Weakness | Our Advantage |
|-----------|---------------|---------------|
| ISR | Paywalled, stale reviews, no financial modeling | Free core tools, real-time data, AI analysis |
| Reddit | Scattered, unsearchable, no aggregation | We aggregate and structure Reddit data |
| Search/Schrole | Recruitment platforms, not financial tools | We're teacher-first, not school-first |
| Numbeo | Generic COL, not teacher-specific | Teacher-specific expenses (no car, school housing, etc.) |

### Data Freshness Targets
| Data Type | Freshness Target | Current State |
|-----------|-----------------|---------------|
| Salary ranges | < 3 months old | Static (needs scraping) |
| COL data | < 1 month old | Static (needs scraping) |
| Exchange rates | < 1 day old | Not implemented |
| School profiles | < 6 months old | Not implemented |
| Flight connectivity | < 3 months old | Not implemented |
| Tax rates | < 1 year old | Static (manual) |

---

## Part 6: Implementation Priority

### Sprint 1 — Foundation (Week 1-2)
- [ ] Set up Supabase with schema for city_profiles, school_profiles, salary_data
- [ ] Build Reddit scraper (r/internationalteachers) with Claude extraction
- [ ] Build TES job listing scraper
- [ ] Daily exchange rate API integration
- [ ] Replace static data files with DB queries

### Sprint 2 — School Intelligence (Week 3-4)
- [ ] Scrape IBO school directory (~6,000 IB schools)
- [ ] Scrape CIS + COBIS directories
- [ ] Build school tier scoring model
- [ ] School profile pages on the site

### Sprint 3 — Fresh COL (Week 5-6)
- [ ] Numbeo scraper (monthly)
- [ ] Flight connectivity scoring (FlightConnections.com)
- [ ] Air quality integration (IQAir API)
- [ ] Replace static city data with live DB data

### Sprint 4 — Community (Week 7-8)
- [ ] Salary submission form
- [ ] "Unlock with your data" gating
- [ ] Data validation pipeline
- [ ] School review aggregation (Google Reviews API)

### Sprint 5 — Accuracy (Week 9-10)
- [ ] Teacher-specific COL adjustments (no car, school housing, etc.)
- [ ] Confidence scoring on all data points
- [ ] Anomaly detection alerts
- [ ] Data freshness dashboard (internal)
