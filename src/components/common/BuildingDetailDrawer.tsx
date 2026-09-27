import React from 'react';
import { Building } from '../../types';
import { 
  X, 
  Zap, 
  Droplet, 
  Users, 
  Thermometer, 
  Wind, 
  Volume2, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface BuildingDetailDrawerProps {
  building: Building | null;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const BuildingDetailDrawer: React.FC<BuildingDetailDrawerProps> = ({ 
  building, 
  onClose,
  onNavigateToTab
}) => {
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  if (!building) return null;

  const handleAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  const getStatusColor = (status: Building['status']) => {
    switch (status) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getStatusDot = (status: Building['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-rose-500 animate-pulse';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[440px] bg-[#FFFFFF] border-l border-[#E2E8F0] z-50 flex flex-col shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-[#FFFFFF]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(building.status)}`} />
            <span className="text-xs uppercase tracking-wider text-[#64748B] font-mono font-medium">
              {building.category} · Zone {building.coordinates.x > 0 ? 'East' : 'West'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1E293B] leading-snug">
            {building.name}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {building.sensorsCount} active IoT nodes · Synced {building.lastUpdated}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
          aria-label="Close building panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FFFFFF]">
        {/* Status Banner */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${getStatusColor(building.status)}`}>
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">
                System Status: {building.status}
              </div>
              <div className="text-xs text-[#64748B]">
                {building.activeAlertsCount > 0 
                  ? `${building.activeAlertsCount} active anomaly detected` 
                  : 'All facility parameters nominal'}
              </div>
            </div>
          </div>
          {building.activeAlertsCount > 0 && onNavigateToTab && (
            <button
              onClick={() => {
                onClose();
                onNavigateToTab('alerts');
              }}
              className="text-xs font-medium text-[#DC2626] hover:underline flex items-center gap-1 shrink-0"
            >
              View <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* AI Prediction & Recommended Action */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center gap-2 text-[#2563EB] text-xs font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CITYOS Neural Forecast</span>
            </div>
            <p className="text-xs text-[#1E293B] leading-relaxed">
              {building.aiPrediction}
            </p>
          </div>

          {building.recommendedAction && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#16A34A] text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Recommended Facility Action</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#16A34A] font-semibold">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[#1E293B] leading-relaxed">
                {building.recommendedAction}
              </p>
              <button
                onClick={() => handleAction(`Executed recommended action for ${building.name}: "${building.recommendedAction}"`)}
                className="mt-1 w-full py-2 px-3 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Execute Recommendation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="font-medium">{actionFeedback}</span>
          </div>
        )}

        {/* Primary Telemetry Grid */}
        <div>
          <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
            Real-Time Environmental & Load Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Energy */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Power Draw</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.energyUsage > 0 ? `${building.energyUsage} kWh` : `+${Math.abs(building.energyUsage)} kW Net`}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {building.energyUsage > 35 ? 'Spike: +18% normal' : 'Baseline optimal'}
              </div>
            </div>

            {/* Water */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Droplet className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Water Flow</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.waterUsage} L/min
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Pressure: {building.status === 'critical' ? '18.2 PSI (Low)' : '54 PSI'}
              </div>
            </div>

            {/* Occupancy */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Occupancy</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.occupancy}%
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {building.headcount} / {building.maxCapacity} occupants
              </div>
            </div>

            {/* Temperature */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Thermometer className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Temperature</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.temperature}°C
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                RH: {building.humidity}%
              </div>
            </div>

            {/* AQI */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Wind className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Air Quality</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.aqi} AQI
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                CO2: {building.co2} ppm
              </div>
            </div>

            {/* Noise */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 text-[#64748B] text-xs mb-1">
                <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Acoustic Level</span>
              </div>
              <div className="text-lg font-bold text-[#1E293B] font-mono tabular-nums">
                {building.noise} dB
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Threshold: 65 dB max
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy Progress bar */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Capacity Utilization</span>
            <span className="font-semibold text-[#1E293B] font-mono">{building.occupancy}%</span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                building.occupancy > 85 ? 'bg-[#DC2626]' : building.occupancy > 70 ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'
              }`}
              style={{ width: `${building.occupancy}%` }}
            />
          </div>
        </div>

        {/* Subsystem Quick Controls */}
        <div>
          <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2.5">
            Automated Facility Override
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => handleAction(`Optimizing HVAC setpoints for ${building.name}. Air exchange set to 23.5°C Eco.`)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-slate-50 text-[#1E293B] text-xs font-medium flex items-center justify-between transition-colors shadow-xs"
            >
              <span>Auto-Balance HVAC to Eco Mode</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </button>
            <button 
              onClick={() => handleAction(`Dispatched priority maintenance ticket to zone technician for ${building.name}.`)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-slate-50 text-[#1E293B] text-xs font-medium flex items-center justify-between transition-colors shadow-xs"
            >
              <span>Dispatch Facilities Team</span>
              <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
        <span className="text-[11px] text-[#64748B]">
          BACnet/IP Gateway Node #B{building.id.split('-')[1]?.toUpperCase() || '01'}
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-slate-50 text-xs font-medium text-[#1E293B] transition-colors shadow-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
