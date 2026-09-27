import React, { useState } from 'react';
import { Building, ViewTab } from '../../types';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Droplet, 
  Car, 
  Users, 
  Radio, 
  ArrowRight,
  Maximize2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CampusMapPreviewProps {
  buildings: Building[];
  onNavigateToTab: (tab: ViewTab) => void;
  onSelectBuilding: (building: Building) => void;
}

export const CampusMapPreview: React.FC<CampusMapPreviewProps> = ({
  buildings,
  onNavigateToTab,
  onSelectBuilding,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'sensors' | 'energy' | 'water' | 'parking' | 'occupancy'>('all');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0]?.id || 'bld-01');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  const layers = [
    { id: 'all', label: 'All Systems', icon: Layers },
    { id: 'sensors', label: 'IoT Sensors', icon: Radio },
    { id: 'energy', label: 'Energy Zones', icon: Zap },
    { id: 'water', label: 'Water Network', icon: Droplet },
    { id: 'parking', label: 'Parking Bays', icon: Car },
    { id: 'occupancy', label: 'Occupancy Heat', icon: Users },
  ] as const;

  // Visual layout coordinates for the 12 campus facilities on an isometric/clean 2D grid
  const buildingLayouts = [
    { id: 'bld-01', x: 22, y: 28, w: 20, h: 22, code: 'ENG', zone: 'North Core' },
    { id: 'bld-02', x: 46, y: 22, w: 18, h: 24, code: 'SCI', zone: 'North Quad' },
    { id: 'bld-03', x: 68, y: 26, w: 18, h: 20, code: 'HUB', zone: 'East Innovation' },
    { id: 'bld-04', x: 18, y: 54, w: 22, h: 20, code: 'ADM', zone: 'West Admin' },
    { id: 'bld-05', x: 44, y: 50, w: 24, h: 26, code: 'STU', zone: 'Central Plaza' },
    { id: 'bld-06', x: 72, y: 52, w: 18, h: 22, code: 'LIB', zone: 'East Commons' },
    { id: 'bld-07', x: 16, y: 78, w: 20, h: 18, code: 'RES', zone: 'South Living' },
    { id: 'bld-08', x: 40, y: 80, w: 20, h: 16, code: 'ATH', zone: 'South Recreation' },
    { id: 'bld-09', x: 64, y: 78, w: 16, h: 18, code: 'PRK', zone: 'South Mobility' },
    { id: 'bld-10', x: 84, y: 38, w: 14, h: 22, code: 'DAT', zone: 'East Edge' },
    { id: 'bld-11', x: 82, y: 68, w: 14, h: 16, code: 'SOL', zone: 'East Microgrid' },
    { id: 'bld-12', x: 44, y: 6, w: 22, h: 12, code: 'BIO', zone: 'North Biotech' },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Spatial Digital Twin Preview
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="text-xs text-[#64748B]">North Apex Monitored Quad</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">
            Interactive Campus Digital Twin
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Click any building to inspect live subsystems, telemetry nodes, and environmental load
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('digital-twin')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 self-start sm:self-center cursor-pointer group"
        >
          <span>Open Digital Twin</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Layer Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-[#64748B] mr-2 shrink-0">Map Layers:</span>
        {layers.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveLayer(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeLayer === id
                ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${activeLayer === id ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Map Layout & Detail Side-Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SVG/Interactive Campus Map */}
        <div className="lg:col-span-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 relative min-h-[360px] sm:min-h-[400px] overflow-hidden flex flex-col justify-between">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Water Network Overlay Lines */}
          {(activeLayer === 'all' || activeLayer === 'water') && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#2563EB]/30 fill-none stroke-[2] stroke-dasharray-[4,4]">
              <path d="M 50 15 Q 120 120 250 140 T 450 180 T 600 240" />
              <path d="M 250 140 L 150 260 L 300 320" />
            </svg>
          )}

          {/* Energy Grid Feeder Overlay */}
          {(activeLayer === 'all' || activeLayer === 'energy') && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#F59E0B]/30 fill-none stroke-[2]">
              <path d="M 550 240 L 450 120 L 250 80 L 120 180" />
              <path d="M 450 120 L 350 280 L 180 300" />
            </svg>
          )}

          {/* Buildings Matrix on Map */}
          <div className="relative w-full h-[320px] sm:h-[350px]">
            {buildingLayouts.map((layout) => {
              const building = buildings.find(b => b.id === layout.id);
              if (!building) return null;
              const isSelected = selectedBuildingId === building.id;

              return (
                <div
                  key={building.id}
                  onClick={() => {
                    setSelectedBuildingId(building.id);
                    onSelectBuilding(building);
                  }}
                  style={{
                    left: `${layout.x}%`,
                    top: `${layout.y}%`,
                    width: `${layout.w}%`,
                    height: `${layout.h}%`,
                  }}
                  className={`absolute rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between p-2 sm:p-2.5 select-none ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-2 border-[#2563EB] shadow-md z-20 scale-105 ring-4 ring-[#2563EB]/15'
                      : 'bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#2563EB]/60 shadow-xs hover:shadow-sm z-10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] sm:text-xs font-extrabold truncate ${isSelected ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                      {building.shortName}
                    </span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      building.status === 'critical' ? 'bg-[#DC2626] animate-pulse' :
                      building.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                    }`} />
                  </div>

                  {/* Layer-specific indicator */}
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-[#64748B] font-mono mt-1">
                    {activeLayer === 'occupancy' && (
                      <span className="text-[#2563EB] font-bold">{building.occupancy}% Occ</span>
                    )}
                    {activeLayer === 'energy' && (
                      <span className="text-[#1E293B] font-bold">{building.energyUsage} kWh</span>
                    )}
                    {activeLayer === 'water' && (
                      <span className="text-[#2563EB] font-bold">{building.waterUsage} L/m</span>
                    )}
                    {(activeLayer === 'all' || activeLayer === 'sensors' || activeLayer === 'parking') && (
                      <div className="flex items-center justify-between w-full">
                        <span>{building.sensorsCount} nodes</span>
                        <span className="font-semibold text-[#1E293B]">{building.occupancy}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footnote & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Nominal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Elevated Load
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Active Alert
              </span>
            </div>
            <span className="font-mono text-[#2563EB]">12 Monitored Facilities Online</span>
          </div>
        </div>

        {/* Selected Facility Details Side Card */}
        <div className="lg:col-span-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                Selected Facility Telemetry
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                selectedBuilding?.status === 'critical' ? 'bg-red-50 text-[#DC2626] border border-red-200' :
                selectedBuilding?.status === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' :
                'bg-emerald-50 text-[#16A34A] border border-emerald-200'
              }`}>
                {selectedBuilding?.status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#1E293B]">
              {selectedBuilding?.name}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {selectedBuilding?.category} · Zone {selectedBuilding && selectedBuilding.coordinates.x > 0 ? 'East' : 'West'} · {selectedBuilding?.sensorsCount} Sensors
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Occupancy</div>
                <div className="text-base font-bold text-[#1E293B] font-mono mt-0.5">
                  {selectedBuilding?.occupancy}%
                </div>
                <div className="text-[10px] text-[#64748B]">Capacity: {selectedBuilding?.maxCapacity}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Power Load</div>
                <div className="text-base font-bold text-[#2563EB] font-mono mt-0.5">
                  {selectedBuilding?.energyUsage} <span className="text-xs font-normal text-[#64748B]">kWh</span>
                </div>
                <div className="text-[10px] text-[#64748B]">Baseline: 24.0 kWh</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Water Flow</div>
                <div className="text-base font-bold text-[#2563EB] font-mono mt-0.5">
                  {selectedBuilding?.waterUsage} <span className="text-xs font-normal text-[#64748B]">L/m</span>
                </div>
                <div className="text-[10px] text-[#16A34A]">Optimal range</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">IoT Nodes</div>
                <div className="text-base font-bold text-[#1E293B] font-mono mt-0.5">
                  {selectedBuilding?.sensorsCount}
                </div>
                <div className="text-[10px] text-[#16A34A]">100% telemetry</div>
              </div>
            </div>

            {/* Environment Bar */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Indoor Climate:</span>
                <span className="font-mono font-semibold text-[#1E293B]">
                  {selectedBuilding?.temperature}°C · {selectedBuilding?.humidity}% RH
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Air Quality:</span>
                <span className="font-mono font-semibold text-[#1E293B]">
                  AQI {selectedBuilding?.aqi} (Good)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <button
              onClick={() => onSelectBuilding(selectedBuilding)}
              className="w-full py-2 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Facility Telemetry</span>
            </button>
            <button
              onClick={() => onNavigateToTab('digital-twin')}
              className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View in 3D WebGL Digital Twin &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
