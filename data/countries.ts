export interface CountryData {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  currency: string;
  currencyCode: string; // ISO 4217
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
  flagEmoji: string;
}

export const countries: CountryData[] = [
  // ── Middle East ──────────────────────────────────────────────────────────────
  {
    name: 'United Arab Emirates',
    code: 'AE',
    currency: 'UAE Dirham',
    currencyCode: 'AED',
    region: 'Middle East',
    flagEmoji: '🇦🇪',
  },
  {
    name: 'Qatar',
    code: 'QA',
    currency: 'Qatari Riyal',
    currencyCode: 'QAR',
    region: 'Middle East',
    flagEmoji: '🇶🇦',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    currency: 'Saudi Riyal',
    currencyCode: 'SAR',
    region: 'Middle East',
    flagEmoji: '🇸🇦',
  },
  {
    name: 'Kuwait',
    code: 'KW',
    currency: 'Kuwaiti Dinar',
    currencyCode: 'KWD',
    region: 'Middle East',
    flagEmoji: '🇰🇼',
  },
  {
    name: 'Oman',
    code: 'OM',
    currency: 'Omani Rial',
    currencyCode: 'OMR',
    region: 'Middle East',
    flagEmoji: '🇴🇲',
  },

  // ── East Asia ────────────────────────────────────────────────────────────────
  {
    name: 'Hong Kong',
    code: 'HK',
    currency: 'Hong Kong Dollar',
    currencyCode: 'HKD',
    region: 'East Asia',
    flagEmoji: '🇭🇰',
  },
  {
    name: 'China',
    code: 'CN',
    currency: 'Chinese Yuan',
    currencyCode: 'CNY',
    region: 'East Asia',
    flagEmoji: '🇨🇳',
  },
  {
    name: 'South Korea',
    code: 'KR',
    currency: 'South Korean Won',
    currencyCode: 'KRW',
    region: 'East Asia',
    flagEmoji: '🇰🇷',
  },
  {
    name: 'Japan',
    code: 'JP',
    currency: 'Japanese Yen',
    currencyCode: 'JPY',
    region: 'East Asia',
    flagEmoji: '🇯🇵',
  },

  // ── Southeast Asia ───────────────────────────────────────────────────────────
  {
    name: 'Singapore',
    code: 'SG',
    currency: 'Singapore Dollar',
    currencyCode: 'SGD',
    region: 'Southeast Asia',
    flagEmoji: '🇸🇬',
  },
  {
    name: 'Thailand',
    code: 'TH',
    currency: 'Thai Baht',
    currencyCode: 'THB',
    region: 'Southeast Asia',
    flagEmoji: '🇹🇭',
  },
  {
    name: 'Malaysia',
    code: 'MY',
    currency: 'Malaysian Ringgit',
    currencyCode: 'MYR',
    region: 'Southeast Asia',
    flagEmoji: '🇲🇾',
  },
  {
    name: 'Vietnam',
    code: 'VN',
    currency: 'Vietnamese Dong',
    currencyCode: 'VND',
    region: 'Southeast Asia',
    flagEmoji: '🇻🇳',
  },
  {
    name: 'Indonesia',
    code: 'ID',
    currency: 'Indonesian Rupiah',
    currencyCode: 'IDR',
    region: 'Southeast Asia',
    flagEmoji: '🇮🇩',
  },

  // ── Europe ───────────────────────────────────────────────────────────────────
  {
    name: 'United Kingdom',
    code: 'GB',
    currency: 'British Pound',
    currencyCode: 'GBP',
    region: 'Europe',
    flagEmoji: '🇬🇧',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    currency: 'Swiss Franc',
    currencyCode: 'CHF',
    region: 'Europe',
    flagEmoji: '🇨🇭',
  },
  {
    name: 'Netherlands',
    code: 'NL',
    currency: 'Euro',
    currencyCode: 'EUR',
    region: 'Europe',
    flagEmoji: '🇳🇱',
  },
  {
    name: 'Spain',
    code: 'ES',
    currency: 'Euro',
    currencyCode: 'EUR',
    region: 'Europe',
    flagEmoji: '🇪🇸',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    currency: 'Czech Koruna',
    currencyCode: 'CZK',
    region: 'Europe',
    flagEmoji: '🇨🇿',
  },

  // ── Africa ───────────────────────────────────────────────────────────────────
  {
    name: 'Egypt',
    code: 'EG',
    currency: 'Egyptian Pound',
    currencyCode: 'EGP',
    region: 'Africa',
    flagEmoji: '🇪🇬',
  },
  {
    name: 'Kenya',
    code: 'KE',
    currency: 'Kenyan Shilling',
    currencyCode: 'KES',
    region: 'Africa',
    flagEmoji: '🇰🇪',
  },
  {
    name: 'Nigeria',
    code: 'NG',
    currency: 'Nigerian Naira',
    currencyCode: 'NGN',
    region: 'Africa',
    flagEmoji: '🇳🇬',
  },

  // ── South America ────────────────────────────────────────────────────────────
  {
    name: 'Colombia',
    code: 'CO',
    currency: 'Colombian Peso',
    currencyCode: 'COP',
    region: 'South America',
    flagEmoji: '🇨🇴',
  },
  {
    name: 'Brazil',
    code: 'BR',
    currency: 'Brazilian Real',
    currencyCode: 'BRL',
    region: 'South America',
    flagEmoji: '🇧🇷',
  },

  // ── Central America ──────────────────────────────────────────────────────────
  {
    name: 'Mexico',
    code: 'MX',
    currency: 'Mexican Peso',
    currencyCode: 'MXN',
    region: 'Central America',
    flagEmoji: '🇲🇽',
  },

  // ── South Asia ───────────────────────────────────────────────────────────────
  {
    name: 'India',
    code: 'IN',
    currency: 'Indian Rupee',
    currencyCode: 'INR',
    region: 'South Asia',
    flagEmoji: '🇮🇳',
  },

  // ── Oceania ──────────────────────────────────────────────────────────────────
  {
    name: 'Australia',
    code: 'AU',
    currency: 'Australian Dollar',
    currencyCode: 'AUD',
    region: 'Oceania',
    flagEmoji: '🇦🇺',
  },
];
