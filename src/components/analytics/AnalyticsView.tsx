import React, { useState } from 'react';
import { Building } from '../../types';
import { 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Droplet, 
  Trash2, 
  Users, 
  Car, 
  Wind,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface AnalyticsViewProps {
  buildings: Building[];
}

const energyTrendData = [
  { day: 'Mon', current: 2750, baseline: 3010 },
  { day: 'Tue', current: 2840, baseline: 3100 },
  { day: 'Wed', current: 2690, baseline: 2950 },
  { day: 'Thu', current: 2910, baseline: 3180 },
  { day: 'Fri', current: 2780, baseline: 3040 },
  { day: 'Sat', current: 1420, baseline: 1550 },
  { day: 'Sun', current: 1280, baseline: 1390 },
];

const wastePieData = [
  { name: 'Recycled Paper & Cardboard', value: 38, color: '#10b981' },
  { name: 'Recycled Polymers & Cans', value: 33, color: '#06b6d4' },
  { name: 'Organic & Compost', value: 18, color: '#3b82f6' },
  { name: 'Landfill Residual', value: 11, color: '#ef4444' },
];

const crowdHourly = [
  { hour: '08:00', headcount: 820 },
  { hour: '10:00', headcount: 1950 },
  { hour: '12:00', headcount: 2620 },
  { hour: '14:00', headcount: 2450 },
  { hour: '16:00', headcount: 2180 },
  { hour: '18:00', headcount: 1420 },
  { hour: '20:00', headcount: 780 },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ buildings }) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'custom'>('7days');

  // Building energy breakdown for bar chart
  const buildingEnergyBars = buildings.map((b) => ({
    name: b.shortName,
    energy: Math.max(0, b.energyUsage),
    water: b.waterUsage,
  })).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header and Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Historical Campus Analytics & Sustainability
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Aggregated cross-facility resource efficiency, peak shaving, and carbon reduction metrics.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          <Calendar className="w-3.5 h-3.5 text-[#64748B] ml-2" />
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === 'today' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === '7days' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === '30days' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              dateRange === 'custom' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Comparison Scoreboard matching prompt specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Energy comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Energy Consumption</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1E293B] font-mono tabular-nums">2,840</span>
            <span className="text-xs text-[#64748B] font-mono">kWh / day</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium mt-2 pt-2 border-t border-[#E2E8F0]">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ 8.4%</span>
            <span className="text-[#64748B] font-normal">vs previous month</span>
          </div>
        </div>

        {/* Water comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Water Flow Volume</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
              <Droplet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1E293B] font-mono tabular-nums">8,420</span>
            <span className="text-xs text-[#64748B] font-mono">L / day</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium mt-2 pt-2 border-t border-[#E2E8F0]">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ 5.2%</span>
            <span className="text-[#64748B] font-normal">vs previous month</span>
          </div>
        </div>

        {/* Waste comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Solid Waste Generation</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#16A34A]">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1E293B] font-mono tabular-nums">286</span>
            <span className="text-xs text-[#64748B] font-mono">kg / day</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium mt-2 pt-2 border-t border-[#E2E8F0]">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ 11.7%</span>
            <span className="text-[#64748B] font-normal">vs previous month</span>
          </div>
        </div>

        {/* Recycling rate comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Recycling Rate</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#1E293B] font-mono tabular-nums">71%</span>
            <span className="text-xs text-[#64748B] font-mono">diversion</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium mt-2 pt-2 border-t border-[#E2E8F0]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ 14.3%</span>
            <span className="text-[#64748B] font-normal">vs previous month</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Energy Trend vs Baseline */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Weekly Electricity Consumption vs Historic Baseline
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Blue: Recorded Consumption · Slate: Historic Pre-CITYOS Baseline (kWh)
              </p>
            </div>
            <span className="text-xs font-mono text-[#16A34A] font-semibold">
              Saved 1,480 kWh
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="baseline" stroke="#94A3B8" strokeDasharray="3 3" fill="transparent" name="Baseline" />
                <Area type="monotone" dataKey="current" stroke="#2563EB" strokeWidth={2.5} fill="url(#currentEnergyGrad)" name="Recorded" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Building Power Draw Comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Energy Draw by Facility (Active kWh)
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Real-time submeter distribution across high-load academic blocks
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingEnergyBars} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="energy" fill="#2563EB" radius={[6, 6, 0, 0]} name="Power (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Waste & Recycling Stream Breakdown */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Campus Solid Waste Streams (71% Diversion)
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Audited fill sensor data from smart compactor collection stations
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {wastePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Diurnal Crowd Population Curve */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Diurnal Campus Population Profile
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Aggregate Turnstile, Wi-Fi probe, and optical sensor headcount
              </p>
            </div>
            <span className="text-xs font-mono text-[#2563EB] font-semibold">
              Peak: 2,620 (12:00)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdHourly} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="headcount" stroke="#2563EB" strokeWidth={2.5} fill="url(#crowdGrad)" name="Headcount" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
