import React, { useState } from 'react';
import { PREDICTION_DATASETS, INITIAL_PREDICTIONS } from '../../data/mockCampusData';
import { 
  Zap, 
  Droplet, 
  Users, 
  Trash2, 
  Car, 
  TrendingUp, 
  Clock, 
  Sliders, 
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const PredictionsView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<'energy' | 'water' | 'crowd' | 'waste' | 'parking'>('energy');
  const [simulatedScenario, setSimulatedScenario] = useState<'standard' | 'heatwave' | 'exam-week' | 'cloudy'>('standard');
  const [mitigationNotice, setMitigationNotice] = useState<string | null>(null);

  const dataset = PREDICTION_DATASETS[selectedDomain];

  // Adjust predicted numbers based on scenario multiplier
  const multiplier = simulatedScenario === 'heatwave' && selectedDomain === 'energy' ? 1.15
    : simulatedScenario === 'exam-week' && selectedDomain === 'crowd' ? 1.25
    : simulatedScenario === 'heatwave' && selectedDomain === 'water' ? 1.20
    : 1.0;

  const chartData = dataset.data.map(d => ({
    ...d,
    predicted: d.predicted ? Math.round(d.predicted * multiplier) : undefined,
    confidenceLower: d.confidenceLower ? Math.round(d.confidenceLower * multiplier) : undefined,
    confidenceUpper: d.confidenceUpper ? Math.round(d.confidenceUpper * multiplier) : undefined,
  }));

  const domains = [
    { id: 'energy', label: 'Energy Demand', icon: Zap },
    { id: 'water', label: 'Water Flow', icon: Droplet },
    { id: 'crowd', label: 'Crowd & Occupancy', icon: Users },
    { id: 'waste', label: 'Waste Generation', icon: Trash2 },
    { id: 'parking', label: 'Parking Utilization', icon: Car },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Predictive Analytics & Forecasting
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-medium">
              LSTM Neural Models
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            24-hour forward-looking time-series simulation with 95% Bayesian confidence intervals.
          </p>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          {domains.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedDomain(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedDomain === id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Title & Domain */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Target Dimension</div>
          <div className="text-lg font-bold text-[#1E293B]">{dataset.metric}</div>
          <div className="text-xs text-[#2563EB] font-medium mt-1">{dataset.title}</div>
        </div>

        {/* Peak Prediction */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Predicted Peak Interval</div>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono tabular-nums">
            {dataset.peakTime}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Expected load: <span className="font-semibold text-[#1E293B] font-mono">{Math.round(dataset.peakValue * multiplier)} {dataset.unit}</span>
          </div>
        </div>

        {/* Expected Change */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Expected Change</div>
          <div className="text-2xl font-bold text-[#DC2626] font-mono tabular-nums">
            {dataset.expectedChange}
          </div>
          <div className="text-xs text-[#64748B] mt-1">Relative to diurnal baseline</div>
        </div>

        {/* Confidence Interval */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Confidence Margin</div>
          <div className="text-2xl font-bold text-[#16A34A] font-mono tabular-nums">
            {dataset.confidenceRange}
          </div>
          <div className="text-xs text-[#64748B] mt-1">p &lt; 0.01 cross-validated</div>
        </div>
      </div>

      {/* Main Prediction Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              {dataset.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Solid line: Historical sensor logs · Dashed line: Neural prediction · Shaded envelope: Confidence interval
            </p>
          </div>

          {/* Scenario Simulation Sandbox */}
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0] text-xs">
            <span className="text-[#64748B] font-medium px-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
              Scenario:
            </span>
            <select
              value={simulatedScenario}
              onChange={(e: any) => setSimulatedScenario(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="standard">Standard Term Baseline</option>
              <option value="heatwave">Heatwave Alert (+4°C ambient)</option>
              <option value="exam-week">Finals Week Surge (+25% Study Quad)</option>
            </select>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#1E293B',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Confidence Band */}
              <Area
                type="monotone"
                dataKey="confidenceUpper"
                stroke="transparent"
                fill="url(#confidenceGrad)"
                name="Confidence Range"
              />

              {/* Historical actual line */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#2563EB' }}
                name="Recorded Actual"
                connectNulls
              />

              {/* Predicted dashed line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#F59E0B"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#F59E0B' }}
                name="CITYOS Prediction"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B]">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1E293B]">Predictive Model Specifications:</span> Architecture combines Bi-directional Long Short-Term Memory (BiLSTM) with campus event timetable metadata and dynamic weather APIs. Retrained nightly at 03:00.
          </div>
        </div>
      </div>

      {/* PART 4: Neural Prediction Engine Live Manifest */}
      <div className="space-y-4">
        {mitigationNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span className="font-medium text-[#1E293B]">{mitigationNotice}</span>
            </div>
            <button
              onClick={() => setMitigationNotice(null)}
              className="text-[#64748B] hover:text-[#1E293B] text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Simulated AI Predictions &amp; Operational Forecasts</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Active predictive inferences cross-referenced with class timetables, athletic schedules, and historical sensor envelopes.
            </p>
          </div>
          <span className="text-xs font-mono text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg font-medium">
            5 Domains Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_PREDICTIONS.map((pred) => {
            const getDomainIcon = (d: string) => {
              switch (d) {
                case 'Energy': return Zap;
                case 'Water': return Droplet;
                case 'Crowd': return Users;
                case 'Parking': return Car;
                case 'Waste': return Trash2;
                default: return TrendingUp;
              }
            };
            const Icon = getDomainIcon(pred.domain);

            return (
              <div
                key={pred.id}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs hover:border-[#2563EB]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                        {pred.domain}
                      </span>
                    </div>

                    {/* Prediction Confidence Badge (PART 4 Requirement) */}
                    <div className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-semibold">
                      Prediction confidence: {pred.confidencePct}%
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#1E293B] leading-snug">
                    {pred.headline}
                  </h3>

                  <div className="mt-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#1E293B]">
                      <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="font-medium text-[#1E293B]">{pred.targetEntity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#64748B]">
                      <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span>Peak: <strong className="text-[#F59E0B] font-mono">{pred.projectedPeakTime}</strong> ({pred.projectedPeakValue})</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
                    <span className="text-[10px] text-[#1E293B] block uppercase font-bold mb-0.5">Underlying Reason:</span>
                    {pred.explanation}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <div className="text-[11px] text-[#16A34A] font-semibold mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Recommended Mitigation:</span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">
                    {pred.recommendedMitigation}
                  </p>
                  <button
                    onClick={() => {
                      setMitigationNotice(`Initiated automated mitigation workflow for ${pred.targetEntity}: ${pred.recommendedMitigation}`);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Execute Mitigation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
