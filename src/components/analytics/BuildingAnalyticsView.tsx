import React, { useState } from 'react';
import { Building } from '../../types';
import { 
  Building2, 
  Zap, 
  Droplet, 
  Users, 
  Wind, 
  Check, 
  ArrowUpDown, 
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface BuildingAnalyticsViewProps {
  buildings: Building[];
  onSelectBuilding?: (building: Building) => void;
}

export const BuildingAnalyticsView: React.FC<BuildingAnalyticsViewProps> = ({
  buildings,
  onSelectBuilding,
}) => {
  // Allow picking up to 4 buildings to compare
  const [selectedIds, setSelectedIds] = useState<string[]>(['b-cs', 'b-sci', 'b-main', 'b-hostel-a']);
  const [rankMetric, setRankMetric] = useState<'energy' | 'water' | 'occupancy' | 'environment'>('energy');

  const toggleBuildingSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedBuildings = buildings.filter(b => selectedIds.includes(b.id));

  // Rankings
  const getRankedBuildings = (metric: 'energy' | 'water' | 'occupancy' | 'environment') => {
    const list = [...buildings];
    if (metric === 'energy') return list.sort((a, b) => b.energyUsage - a.energyUsage);
    if (metric === 'water') return list.sort((a, b) => b.waterUsage - a.waterUsage);
    if (metric === 'occupancy') return list.sort((a, b) => b.occupancy - a.occupancy);
    return list.sort((a, b) => a.aqi - b.aqi); // Best AQI is lowest
  };

  const rankedList = getRankedBuildings(rankMetric);

  // Comparison chart data
  const comparisonChartData = comparedBuildings.map(b => ({
    name: b.shortName,
    energy: Math.max(0, b.energyUsage),
    water: b.waterUsage,
    occupancy: b.occupancy,
    aqi: b.aqi,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Facility Analytics & Cross-Building Benchmark
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-medium">
              Comparing {selectedIds.length} Facilities
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cross-evaluate energy consumption, water intensity, occupant density, and microclimate metrics.
          </p>
        </div>

        <div className="text-xs text-[#64748B] font-mono">
          Baseline: 30-Day Diurnal Rolling Median
        </div>
      </div>

      {/* Building Multi-Select Chips Bar */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1E293B] uppercase tracking-wider">
            Select Buildings to Compare (Choose 2 to 5)
          </span>
          <span className="text-[#64748B] font-mono">
            {selectedIds.length} / 5 selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {buildings.map((b) => {
            const isSelected = selectedIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBuildingSelection(b.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-[#2563EB] border border-[#2563EB]/40 shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:text-[#1E293B] hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  b.status === 'critical' ? 'bg-[#DC2626]' : b.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                }`} />
                <span>{b.shortName}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Direct Comparative Matrix
          </h2>
          <span className="text-xs text-[#64748B]">All data synced with live IoT streams</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[11px] border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Facility</th>
                <th className="p-3 text-right">Power Draw (kWh)</th>
                <th className="p-3 text-right">Water Flow (L/min)</th>
                <th className="p-3 text-right">Occupancy (%)</th>
                <th className="p-3 text-right">Air Quality (AQI)</th>
                <th className="p-3 text-right">Noise (dB)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono">
              {comparedBuildings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-sans font-semibold text-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        b.status === 'critical' ? 'bg-[#DC2626] animate-pulse' : b.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                      }`} />
                      <span>{b.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-[#1E293B] font-bold tabular-nums">
                    {b.energyUsage > 0 ? `${b.energyUsage} kWh` : 'Solar Net (-48 kW)'}
                  </td>
                  <td className="p-3 text-right text-[#64748B] tabular-nums">
                    {b.waterUsage} L/min
                  </td>
                  <td className="p-3 text-right text-[#64748B] tabular-nums">
                    {b.occupancy}% ({b.headcount} occ)
                  </td>
                  <td className="p-3 text-right text-[#64748B] tabular-nums">
                    {b.aqi} AQI
                  </td>
                  <td className="p-3 text-right text-[#64748B] tabular-nums">
                    {b.noise} dB
                  </td>
                  <td className="p-3 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      b.status === 'critical' ? 'bg-red-50 text-[#DC2626] border border-red-200'
                      : b.status === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                      : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    {onSelectBuilding && (
                      <button
                        onClick={() => onSelectBuilding(b)}
                        className="text-[#2563EB] hover:text-[#1E40AF] text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Visual Charts (Bar Charts for Energy & Water) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Energy & Water Load Comparison */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Resource Load Intensity Comparison
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Energy (kWh) vs Water Flow (L/min) across selected structures
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="energy" fill="#2563EB" name="Energy (kWh)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="water" fill="#60A5FA" name="Water (L/min)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Occupancy & Air Quality Index */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">
                Occupancy &amp; Environmental Quality
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Occupancy (%) vs Air Quality Index (AQI)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#1E293B' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="occupancy" fill="#16A34A" name="Occupancy (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="aqi" fill="#F59E0B" name="Air Quality (AQI)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rankings Section (Part 8 Requirement) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Campus Facilities Leaderboard &amp; Rankings
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Rank all 12 facilities across critical operational dimensions
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] self-start sm:self-auto">
            <button
              onClick={() => setRankMetric('energy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                rankMetric === 'energy' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              ⚡ Energy Ranking
            </button>
            <button
              onClick={() => setRankMetric('water')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                rankMetric === 'water' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              💧 Water Ranking
            </button>
            <button
              onClick={() => setRankMetric('occupancy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                rankMetric === 'occupancy' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              👥 Occupancy
            </button>
            <button
              onClick={() => setRankMetric('environment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                rankMetric === 'environment' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              🌿 Best AQI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rankedList.slice(0, 6).map((b, index) => {
            let metricDisplay = '';
            if (rankMetric === 'energy') metricDisplay = b.energyUsage > 0 ? `${b.energyUsage} kWh` : 'Solar Export (-48 kW)';
            else if (rankMetric === 'water') metricDisplay = `${b.waterUsage} L/min`;
            else if (rankMetric === 'occupancy') metricDisplay = `${b.occupancy}% (${b.headcount} occupants)`;
            else metricDisplay = `${b.aqi} AQI (Nominal)`;

            return (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-200 text-slate-800' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#1E293B]">{b.shortName}</div>
                    <div className="text-[11px] text-[#64748B]">{b.category}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#2563EB]">{metricDisplay}</div>
                  <span className={`text-[10px] uppercase font-semibold ${
                    b.status === 'critical' ? 'text-[#DC2626]' : b.status === 'warning' ? 'text-[#F59E0B]' : 'text-[#16A34A]'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
