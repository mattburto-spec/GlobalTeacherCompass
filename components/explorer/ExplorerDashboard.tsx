'use client';

import { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  scoreAllCities,
  REGION_COLORS,
  REGION_LABELS,
  type RoleType,
  type CurriculumFilter,
  type FamilyStatus,
  type TriangleWeights,
  type ScoredCity,
} from '@/lib/triangle-scores';
import { formatCurrency } from '@/lib/calculations';
import RankingTable from './RankingTable';
import CityDetailPanel from './CityDetailPanel';

const ROLE_LABELS: Record<RoleType, string> = {
  classroom_teacher: 'Classroom Teacher',
  head_of_department: 'Head of Department',
  senior_leader: 'Senior Leader',
  principal: 'Principal',
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ScoredCity;
  onClick?: (city: ScoredCity) => void;
}

function CustomDot({ cx, cy, payload, onClick }: CustomDotProps) {
  if (!cx || !cy || !payload) return null;
  const r = 5 + (payload.schoolScore / 100) * 12;
  const color = REGION_COLORS[payload.region] || '#999';
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      fillOpacity={0.7}
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.9}
      style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
      onClick={() => onClick?.(payload)}
      onMouseEnter={(e) => {
        (e.target as SVGCircleElement).setAttribute('r', String(r + 3));
        (e.target as SVGCircleElement).setAttribute('fill-opacity', '1');
      }}
      onMouseLeave={(e) => {
        (e.target as SVGCircleElement).setAttribute('r', String(r));
        (e.target as SVGCircleElement).setAttribute('fill-opacity', '0.7');
      }}
    />
  );
}

function CustomTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScoredCity }> }) {
  if (!active || !payload?.[0]) return null;
  const city = payload[0].payload;
  return (
    <div className="bg-navy text-sand-light rounded-lg px-4 py-3 shadow-xl border border-white/10 max-w-[220px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-lg leading-none">{city.flagEmoji}</span>
        <div>
          <p className="font-semibold text-sm">{city.city}</p>
          <p className="text-sand-dark/40 text-[10px]">{city.country}</p>
        </div>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-sand-dark/50">Fit Score</span>
          <span className="font-bold text-gold">{city.fitScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sand-dark/50">School</span>
          <span>{city.schoolScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sand-dark/50">Livability</span>
          <span>{city.livabilityScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sand-dark/50">Savings</span>
          <span>{city.savingsScore}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-white/10">
          <span className="text-sand-dark/50">Salary</span>
          <span>{formatCurrency(city.medianSalary)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ExplorerDashboard() {
  const [role, setRole] = useState<RoleType>('classroom_teacher');
  const [curriculum, setCurriculum] = useState<CurriculumFilter>('IB');
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus>('single');
  const [weights, setWeights] = useState<TriangleWeights>({
    school: 50,
    livability: 50,
    savings: 50,
  });
  const [selectedCity, setSelectedCity] = useState<ScoredCity | null>(null);

  const scoredCities = useMemo(
    () => scoreAllCities(role, curriculum, familyStatus, weights),
    [role, curriculum, familyStatus, weights],
  );

  // Group cities by region for legend
  const regionGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    scoredCities.forEach((c) => {
      groups[c.region] = (groups[c.region] || 0) + 1;
    });
    return groups;
  }, [scoredCities]);

  const updateWeight = (key: keyof TriangleWeights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
        {/* Row 1: Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as RoleType)}
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Curriculum</label>
            <select
              className="form-select"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value as CurriculumFilter)}
            >
              <option value="IB">IB</option>
              <option value="British">British</option>
              <option value="All">All Curricula</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">Lifestyle</label>
            <div className="flex gap-2">
              {(['single', 'family'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFamilyStatus(status)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    familyStatus === status
                      ? 'bg-navy text-sand-light'
                      : 'bg-sand-dark/10 text-navy/50 hover:bg-sand-dark/20'
                  }`}
                >
                  {status === 'single' ? 'Single' : 'Family'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Weight Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { key: 'school' as const, label: 'School Quality', color: 'text-teal' },
            { key: 'livability' as const, label: 'City Livability', color: 'text-navy' },
            { key: 'savings' as const, label: 'Savings Potential', color: 'text-gold-dark' },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-navy/50 mb-2">
                <span>{label}</span>
                <span className={`${color} font-bold text-sm tabular-nums`}>{weights[key]}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={weights[key]}
                onChange={(e) => updateWeight(key, Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-[10px] text-navy/20 mt-1">
                <span>Low priority</span>
                <span>High priority</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy">
              City Explorer
            </h3>
            <p className="text-xs text-navy/35 mt-1">
              Bubble size = school quality score. Click a city for details.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {Object.entries(regionGroups).map(([region, count]) => (
              <div key={region} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: REGION_COLORS[region] }}
                />
                <span className="text-[11px] text-navy/45">
                  {REGION_LABELS[region] || region} ({count})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[420px] sm:h-[480px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B8" opacity={0.5} />
              <XAxis
                type="number"
                dataKey="livabilityScore"
                name="Livability"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#0F2B46', opacity: 0.4 }}
                tickLine={false}
                axisLine={{ stroke: '#E8D9B8' }}
                label={{
                  value: 'City Livability',
                  position: 'bottom',
                  offset: 0,
                  style: { fontSize: 11, fill: '#0F2B46', opacity: 0.35, fontWeight: 600 },
                }}
              />
              <YAxis
                type="number"
                dataKey="savingsScore"
                name="Savings"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#0F2B46', opacity: 0.4 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Savings Potential',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  style: { fontSize: 11, fill: '#0F2B46', opacity: 0.35, fontWeight: 600 },
                }}
              />
              <Tooltip
                content={<CustomTooltipContent />}
                cursor={false}
              />
              <Scatter
                data={scoredCities}
                shape={<CustomDot onClick={(city) => setSelectedCity(city)} />}
              >
                {scoredCities.map((city) => (
                  <Cell
                    key={city.city}
                    fill={REGION_COLORS[city.region] || '#999'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking Table */}
      <RankingTable
        cities={scoredCities}
        onCityClick={(city) => setSelectedCity(city)}
      />

      {/* City Detail Panel */}
      {selectedCity && (
        <CityDetailPanel
          city={selectedCity}
          familyStatus={familyStatus}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </div>
  );
}
