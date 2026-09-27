import React, { useState } from 'react';
import { Building, ViewTab } from '../../types';
import { ThreeCampusScene } from './ThreeCampusScene';
import { BuildingDetailDrawer } from '../common/BuildingDetailDrawer';
import { 
  Layers, 
  Sun, 
  Moon, 
  Sunset, 
  Zap, 
  Droplet, 
  Users, 
  Wind, 
  AlertTriangle, 
  Maximize2,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface DigitalTwinViewProps {
  buildings: Building[];
  onNavigateToTab?: (tab: ViewTab) => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({ 
  buildings,
  onNavigateToTab 
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'energy' | 'water' | 'crowd' | 'environment' | 'alerts'>('all');
  const [timeOfDay, setTimeOfDay] = useState<'dusk' | 'night' | 'day'>('dusk');

  const filterOptions = [
    { id: 'all', label: 'All Systems', icon: Layers },
    { id: 'energy', label: 'Energy Grid', icon: Zap },
    { id: 'water', label: 'Water Network', icon: Droplet },
    { id: 'crowd', label: 'Crowd Density', icon: Users },
    { id: 'environment', label: 'Environment', icon: Wind },
    { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Campus 3D Digital Twin
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold font-mono">
              Spatial IoT Mesh Active
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time interactive WebGL model of North Apex Campus. Click any structure for sensor telemetry.
          </p>
        </div>

        {/* Filter Bar & Lighting Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            {filterOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === id
                    ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeFilter === id ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Time of Day Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${timeOfDay === 'day' ? 'bg-[#FFFFFF] text-[#F59E0B] shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
              title="Day Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('dusk')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${timeOfDay === 'dusk' ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
              title="Dusk Mode"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${timeOfDay === 'night' ? 'bg-[#FFFFFF] text-[#1E293B] shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
              title="Night Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div className="relative h-[560px] md:h-[620px] w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs">
        <ThreeCampusScene
          buildings={buildings}
          selectedBuildingId={selectedBuilding?.id || null}
          onSelectBuilding={(b) => setSelectedBuilding(b)}
          activeFilter={activeFilter}
          timeOfDay={timeOfDay}
        />
      </div>

      {/* Fast Building Quick-Picker Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            All 12 Monitored Campus Facilities ({buildings.length})
          </span>
          <span className="text-xs text-[#64748B]">
            Select to inspect telemetry &amp; AI diagnostics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {buildings.map((b) => {
            const isSelected = selectedBuilding?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuilding(b)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs ring-2 ring-[#2563EB]/20'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${
                    b.status === 'critical' ? 'bg-[#DC2626] animate-pulse' : b.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                  }`} />
                  <span className="text-[10px] font-mono text-[#64748B] tabular-nums">
                    {b.energyUsage > 0 ? `${b.energyUsage} kWh` : `${b.occupancy}%`}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#1E293B] truncate">
                  {b.shortName}
                </div>
                <div className="text-[11px] text-[#64748B] truncate">
                  {b.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-over Building Detail Inspector */}
      <BuildingDetailDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
};
