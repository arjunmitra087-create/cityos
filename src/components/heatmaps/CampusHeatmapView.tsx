import React, { useState } from 'react';
import { Building } from '../../types';
import { 
  Flame, 
  Users, 
  Zap, 
  Volume2, 
  Thermometer, 
  Wind, 
  Layers, 
  MapPin, 
  Sparkles,
  Info
} from 'lucide-react';

interface CampusHeatmapViewProps {
  buildings: Building[];
  onSelectBuilding?: (building: Building) => void;
}

type HeatmapType = 'crowd' | 'energy' | 'noise' | 'temperature' | 'aqi';

export const CampusHeatmapView: React.FC<CampusHeatmapViewProps> = ({
  buildings,
  onSelectBuilding,
}) => {
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('crowd');

  const heatmapCategories: Array<{ id: HeatmapType; label: string; icon: any; unit: string; description: string }> = [
    { id: 'crowd', label: 'Crowd Density', icon: Users, unit: '% occupancy', description: 'Pedestrian density & headcount concentration across quads and dining facilities' },
    { id: 'energy', label: 'Energy Usage', icon: Zap, unit: 'kWh', description: 'Thermal power density and electrical substation draw across facilities' },
    { id: 'noise', label: 'Noise Levels', icon: Volume2, unit: 'dB', description: 'Acoustic sensor perimeter monitoring for quiet quad and municipal compliance' },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C', description: 'Ambient temperature microclimate and heat-island accumulation' },
    { id: 'aqi', label: 'Air Quality (AQI)', icon: Wind, unit: 'AQI', description: 'Particulate matter (PM2.5/PM10) and volatile organic compounds' },
  ];

  const currentCategory = heatmapCategories.find(c => c.id === heatmapType)!;

  // Calculate heat value & color for each building
  const getBuildingHeat = (b: Building, type: HeatmapType): { value: number; formatted: string; level: 'critical' | 'warning' | 'moderate' | 'nominal'; colorClass: string; bgClass: string } => {
    if (type === 'crowd') {
      const v = b.occupancy;
      if (v >= 85) return { value: v, formatted: `${v}%`, level: 'critical', colorClass: 'text-rose-400', bgClass: 'bg-rose-500' };
      if (v >= 70) return { value: v, formatted: `${v}%`, level: 'warning', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' };
      if (v >= 50) return { value: v, formatted: `${v}%`, level: 'moderate', colorClass: 'text-sky-400', bgClass: 'bg-sky-500' };
      return { value: v, formatted: `${v}%`, level: 'nominal', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
    }

    if (type === 'energy') {
      const v = Math.max(0, b.energyUsage);
      if (v >= 38) return { value: v, formatted: `${v} kWh`, level: 'critical', colorClass: 'text-rose-400', bgClass: 'bg-rose-500' };
      if (v >= 28) return { value: v, formatted: `${v} kWh`, level: 'warning', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' };
      if (v >= 18) return { value: v, formatted: `${v} kWh`, level: 'moderate', colorClass: 'text-sky-400', bgClass: 'bg-sky-500' };
      return { value: v, formatted: `${v} kWh`, level: 'nominal', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
    }

    if (type === 'noise') {
      const v = b.noise;
      if (v >= 70) return { value: v, formatted: `${v} dB`, level: 'critical', colorClass: 'text-rose-400', bgClass: 'bg-rose-500' };
      if (v >= 60) return { value: v, formatted: `${v} dB`, level: 'warning', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' };
      if (v >= 50) return { value: v, formatted: `${v} dB`, level: 'moderate', colorClass: 'text-sky-400', bgClass: 'bg-sky-500' };
      return { value: v, formatted: `${v} dB`, level: 'nominal', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
    }

    if (type === 'temperature') {
      const v = b.temperature;
      if (v >= 28.5) return { value: v, formatted: `${v}°C`, level: 'critical', colorClass: 'text-rose-400', bgClass: 'bg-rose-500' };
      if (v >= 26.5) return { value: v, formatted: `${v}°C`, level: 'warning', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' };
      if (v >= 24.0) return { value: v, formatted: `${v}°C`, level: 'moderate', colorClass: 'text-sky-400', bgClass: 'bg-sky-500' };
      return { value: v, formatted: `${v}°C`, level: 'nominal', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
    }

    // AQI
    const v = b.aqi;
    if (v >= 70) return { value: v, formatted: `${v} AQI`, level: 'critical', colorClass: 'text-rose-400', bgClass: 'bg-rose-500' };
    if (v >= 55) return { value: v, formatted: `${v} AQI`, level: 'warning', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' };
    if (v >= 40) return { value: v, formatted: `${v} AQI`, level: 'moderate', colorClass: 'text-sky-400', bgClass: 'bg-sky-500' };
    return { value: v, formatted: `${v} AQI`, level: 'nominal', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
  };

  // Sort descending by heat value
  const sortedBuildings = [...buildings].sort((a, b) => {
    return getBuildingHeat(b, heatmapType).value - getBuildingHeat(a, heatmapType).value;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Campus Telemetry Heatmaps
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-medium">
              Spatial IoT Density
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Visualize intensity distributions across physical zones, academic quads, and utility nodes.
          </p>
        </div>

        {/* Heatmap Type Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          {heatmapCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = heatmapType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setHeatmapType(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Legend & Summary */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-[#1E293B] block uppercase tracking-wider">
            {currentCategory.label} Heat Intensity Scale
          </span>
          <p className="text-[#64748B] mt-0.5">
            {currentCategory.description}
          </p>
        </div>

        {/* Color Legend Bar */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#1E293B]">
            <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span>High Intensity</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1E293B]">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span>Elevated</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1E293B]">
            <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1E293B]">
            <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
            <span>Nominal</span>
          </div>
        </div>
      </div>

      {/* Visual Spatial Zone Heatmap Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Spatial Campus Grid ({currentCategory.label})
          </h2>
          <span className="text-xs text-[#64748B] font-mono">12 Active Nodes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {sortedBuildings.map((b, idx) => {
            const heat = getBuildingHeat(b, heatmapType);

            return (
              <div
                key={b.id}
                onClick={() => onSelectBuilding && onSelectBuilding(b)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs space-y-3 relative overflow-hidden group"
              >
                {/* Heat Glow Ribbon Top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${heat.bgClass}`} />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">
                      Zone {idx < 6 ? 'North Quad' : 'South Quad'}
                    </div>
                    <h3 className="text-xs font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                      {b.name}
                    </h3>
                  </div>

                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${heat.bgClass}`} />
                </div>

                {/* Heat Value Big Metric */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className={`text-xl font-bold font-mono tabular-nums ${heat.colorClass}`}>
                    {heat.formatted}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-[#64748B] font-mono">
                    {heat.level}
                  </span>
                </div>

                {/* Visual Density Progress Bar */}
                <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${heat.bgClass} transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, Math.max(15, (heat.value / (heatmapType === 'crowd' ? 100 : heatmapType === 'energy' ? 50 : heatmapType === 'temperature' ? 35 : heatmapType === 'noise' ? 80 : 100)) * 100))}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                  <span>{b.category}</span>
                  <span className="text-[#2563EB] font-medium group-hover:underline">Inspect details &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Insights Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-[#1E293B]">
        <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#2563EB]">CITYOS Thermal &amp; Spatial Analysis:</span> The highest density hotspot in this layer is currently <strong>{sortedBuildings[0]?.name}</strong> with a reading of <strong>{getBuildingHeat(sortedBuildings[0], heatmapType).formatted}</strong>. Telemetry indicates concentration is consistent with scheduled class timetables and chiller staging profiles.
        </div>
      </div>
    </div>
  );
};
