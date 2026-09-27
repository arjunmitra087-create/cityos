import React from 'react';
import { SustainabilityScore, Building } from '../../types';
import { 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  Zap, 
  Droplet, 
  Trash2, 
  Wind, 
  Sun, 
  Award,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface SustainabilityViewProps {
  score: SustainabilityScore;
  buildings: Building[];
}

const historicalSustainability = [
  { month: 'Apr', score: 72 },
  { month: 'May', score: 74 },
  { month: 'Jun', score: 75 },
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 79 },
  { month: 'Sep (Current)', score: 86 },
];

export const SustainabilityView: React.FC<SustainabilityViewProps> = ({
  score,
  buildings,
}) => {
  const pillars = [
    { label: 'Energy Efficiency', score: score.energyEfficiency, icon: Zap, color: 'text-amber-400', barBg: 'bg-amber-500', detail: '8.4% reduction via automated HVAC load shedding' },
    { label: 'Water Conservation', score: score.waterConservation, icon: Droplet, color: 'text-sky-400', barBg: 'bg-sky-500', detail: '5.2% water flow reduction via smart greywater recycling' },
    { label: 'Waste Reduction', score: score.wasteReduction, icon: Trash2, color: 'text-emerald-400', barBg: 'bg-emerald-500', detail: '286 kg/day solid waste with ultrasonic bin compaction' },
    { label: 'Recycling Diversion', score: score.recyclingRate, icon: Leaf, color: 'text-teal-400', barBg: 'bg-teal-500', detail: '71% total waste diversion away from regional landfill' },
    { label: 'Environmental Quality', score: score.environmentalQuality, icon: Wind, color: 'text-[#2563EB]', barBg: 'bg-[#2563EB]', detail: 'Nominal particulate levels (AQI 74) & low quad noise' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            CITYOS Sustainability &amp; ESG Scorecard
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold">
              Net Zero 2030 Trajectory
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Holistic environmental compliance calculated across microgrid generation, potable water, recycling, and carbon offsets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#16A34A] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
          <Leaf className="w-4 h-4" />
          <span>AASHE STARS Gold Equivalent</span>
        </div>
      </div>

      {/* Main Score Callout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Main Big Score Card */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                Overall Sustainability Score
              </span>
              <Award className="w-5 h-5 text-[#16A34A]" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-[#1E293B] font-mono tabular-nums">
                {score.overall}
              </span>
              <span className="text-xl text-[#64748B] font-mono">/ 100</span>
            </div>

            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Composite index weighted across 5 environmental dimensions audited by 248 IoT edge meters.
            </p>
          </div>

          {/* Historical Improvement Box */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[#64748B] font-sans">
              <span>Historical Improvement:</span>
              <span className="text-[#16A34A] font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +{score.improvementPct}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B] text-[11px]">
              <span>Last Month: {score.lastMonth} / 100</span>
              <span className="text-[#1E293B] font-semibold">This Month: {score.overall} / 100</span>
            </div>
          </div>
        </div>

        {/* Historical Progress Chart */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                6-Month Sustainability Score Trend
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Steady climb from baseline 72 to current 86 milestone
              </p>
            </div>
            <span className="text-xs font-mono text-[#2563EB] font-semibold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              +14 pts in 6 mo
            </span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalSustainability} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#1E293B' }} />
                <Area type="monotone" dataKey="score" stroke="#16A34A" strokeWidth={2.5} fill="url(#scoreGrad)" name="Sustainability Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Breakdown Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
          Performance Across 5 Environmental Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#2563EB]">
                      <Icon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span className="text-xs font-semibold text-[#1E293B]">{p.label}</span>
                  </div>
                  <span className="text-base font-bold font-mono text-[#16A34A]">
                    {p.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${p.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  {p.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
