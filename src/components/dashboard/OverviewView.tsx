import React, { useState, useEffect } from 'react';
import { 
  Building, 
  CampusKPIs, 
  ActivityFeedItem, 
  Alert, 
  AiInsight, 
  ViewTab 
} from '../../types';
import { campusService } from '../../services/campusService';
import { 
  Zap, 
  Droplet, 
  Users, 
  Trash2, 
  Car, 
  Thermometer, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Building2, 
  Cpu, 
  Radio, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert, 
  Volume2, 
  Wind, 
  Flame, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CampusMapPreview } from './CampusMapPreview';

interface OverviewViewProps {
  buildings: Building[];
  kpis: CampusKPIs;
  activities: ActivityFeedItem[];
  alerts: Alert[];
  insights: AiInsight[];
  onNavigateToTab: (tab: ViewTab) => void;
  onSelectBuilding: (building: Building) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenAiWithPrompt?: (prompt?: string) => void;
}

const miniEnergyData = [
  { time: '04:00', kwh: 92 },
  { time: '06:00', kwh: 110 },
  { time: '08:00', kwh: 145 },
  { time: '10:00', kwh: 172 },
  { time: '12:00', kwh: 198 },
  { time: '14:00', kwh: 184 },
  { time: '16:00', kwh: 192 },
  { time: '18:00', kwh: 168 },
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  buildings,
  kpis,
  activities,
  alerts,
  insights,
  onNavigateToTab,
  onSelectBuilding,
  isSimulating,
  onToggleSimulation,
  onOpenAiWithPrompt,
}) => {
  const healthScore = campusService.getCampusHealth();
  const sensors = campusService.getSensors();
  const onlineSensorsCount = sensors.filter(s => s.status === 'online').length;

  const [tick, setTick] = useState(0);

  // Live polling ticker for telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.severity === 'warning').length;

  interface TelemetryCardItem {
    id: string;
    title: string;
    icon: any;
    current: number;
    unit: string;
    status: string;
    statusType: 'normal' | 'warning' | 'critical';
    avg: number;
    peak: number;
    chartData: { time: string; val: number }[];
  }

  // 7 Primary Telemetry Metric Cards
  const telemetryCards: TelemetryCardItem[] = [
    {
      id: 'electricity',
      title: 'Active Electricity Demand',
      icon: Zap,
      current: Math.round((184.6 + Math.sin(tick) * 3) * 10) / 10,
      unit: 'kWh',
      status: 'Nominal',
      statusType: 'normal' as const,
      avg: 168.4,
      peak: 218.0,
      chartData: [
        { time: '10:00', val: 172 },
        { time: '10:15', val: 178 },
        { time: '10:30', val: 181 },
        { time: '10:45', val: 189 },
        { time: '11:00', val: 184.6 + Math.sin(tick) * 3 },
      ],
    },
    {
      id: 'water',
      title: 'Main Ingress Water Flow',
      icon: Droplet,
      current: Math.round((426.0 + Math.cos(tick) * 5) * 10) / 10,
      unit: 'L/min',
      status: 'Nominal',
      statusType: 'normal' as const,
      avg: 395.0,
      peak: 512.0,
      chartData: [
        { time: '10:00', val: 410 },
        { time: '10:15', val: 435 },
        { time: '10:30', val: 420 },
        { time: '10:45', val: 430 },
        { time: '11:00', val: 426 + Math.cos(tick) * 5 },
      ],
    },
    {
      id: 'temperature',
      title: 'Campus Ambient Temperature',
      icon: Thermometer,
      current: Math.round((29.0 + Math.sin(tick * 0.5) * 0.3) * 10) / 10,
      unit: '°C',
      status: 'Warning',
      statusType: 'warning' as const,
      avg: 27.2,
      peak: 31.4,
      chartData: [
        { time: '10:00', val: 27.8 },
        { time: '10:15', val: 28.2 },
        { time: '10:30', val: 28.7 },
        { time: '10:45', val: 28.9 },
        { time: '11:00', val: 29.0 + Math.sin(tick * 0.5) * 0.3 },
      ],
    },
    {
      id: 'humidity',
      title: 'Relative Humidity',
      icon: Droplet,
      current: Math.round(52 + Math.cos(tick * 0.7) * 2),
      unit: '%',
      status: 'Nominal',
      statusType: 'normal' as const,
      avg: 54.0,
      peak: 68.0,
      chartData: [
        { time: '10:00', val: 55 },
        { time: '10:15', val: 54 },
        { time: '10:30', val: 53 },
        { time: '10:45', val: 52 },
        { time: '11:00', val: 52 + Math.cos(tick * 0.7) * 2 },
      ],
    },
    {
      id: 'aqi',
      title: 'Air Quality Index',
      icon: Wind,
      current: Math.round(74 + Math.sin(tick * 0.8) * 3),
      unit: 'AQI',
      status: 'Warning',
      statusType: 'warning' as const,
      avg: 58.0,
      peak: 92.0,
      chartData: [
        { time: '10:00', val: 62 },
        { time: '10:15', val: 68 },
        { time: '10:30', val: 71 },
        { time: '10:45', val: 75 },
        { time: '11:00', val: 74 + Math.sin(tick * 0.8) * 3 },
      ],
    },
    {
      id: 'noise',
      title: 'Average Acoustic Level',
      icon: Volume2,
      current: Math.round(61 + Math.sin(tick) * 2),
      unit: 'dB',
      status: 'Nominal',
      statusType: 'normal' as const,
      avg: 54.5,
      peak: 76.0,
      chartData: [
        { time: '10:00', val: 56 },
        { time: '10:15', val: 58 },
        { time: '10:30', val: 62 },
        { time: '10:45', val: 63 },
        { time: '11:00', val: 61 + Math.sin(tick) * 2 },
      ],
    },
    {
      id: 'occupancy',
      title: 'Campus Total Occupancy',
      icon: Users,
      current: 78,
      unit: '%',
      status: 'Nominal',
      statusType: 'normal' as const,
      avg: 64.0,
      peak: 86.0,
      chartData: [
        { time: '10:00', val: 62 },
        { time: '10:15', val: 71 },
        { time: '10:30', val: 74 },
        { time: '10:45', val: 76 },
        { time: '11:00', val: 78 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Campus Health Card */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-[#16A34A] font-bold">
                Campus Status: Operational
              </span>
              <span className="text-[#CBD5E1]">·</span>
              <span className="text-xs text-[#64748B] font-mono">
                North Apex Main Campus
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              {getGreeting()}, Administrator
            </h1>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              12 of 12 buildings online. {onlineSensorsCount} of {sensors.length} IoT edge nodes streaming live telemetry with 98.4% uptime.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToTab('digital-twin')}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Digital Twin</span>
            </button>
            <button
              onClick={() => onNavigateToTab('heatmaps')}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#1E293B] text-xs font-medium border border-[#E2E8F0] flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Campus Heatmaps</span>
            </button>
            <button
              onClick={onToggleSimulation}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-colors shadow-xs cursor-pointer ${
                isSimulating 
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]' 
                  : 'bg-amber-50 border-[#F59E0B]/30 text-[#B45309]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-[#16A34A] animate-pulse' : 'text-[#64748B]'}`} />
              <span>{isSimulating ? 'Live IoT Stream' : 'Stream Paused'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK OVERVIEW: Compact "Campus Overview" section containing 6 mini-stat cards */}
      <div>
        <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5 px-1">
          Campus Overview
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Sensors */}
          <div 
            onClick={() => onNavigateToTab('sensors')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase">Active</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Total Sensors</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              248 <span className="text-xs font-normal text-[#64748B]">nodes</span>
            </div>
            <div className="text-[10px] text-[#16A34A] mt-1 font-medium">98.4% online</div>
          </div>

          {/* 2. Active Systems */}
          <div 
            onClick={() => onNavigateToTab('digital-twin')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase">100%</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Active Systems</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              {buildings.length} <span className="text-xs font-normal text-[#64748B]">facilities</span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-1">All grids synced</div>
          </div>

          {/* 3. Active Alerts */}
          <div 
            onClick={() => onNavigateToTab('alerts')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-[#F59E0B]">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[10px] font-semibold uppercase ${criticalCount > 0 ? 'text-[#DC2626]' : 'text-[#F59E0B]'}`}>
                {criticalCount} Critical
              </span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Active Alerts</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              {activeAlerts.length} <span className="text-xs font-normal text-[#64748B]">pending</span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-1">{warningCount} warnings</div>
          </div>

          {/* 4. Energy Usage */}
          <div 
            onClick={() => onNavigateToTab('energy')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase">{kpis.energy.status}</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Energy Usage</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              {kpis.energy.currentKwh} <span className="text-xs font-normal text-[#64748B]">kWh</span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-1 font-mono">Today: {kpis.energy.todayTotalKwh.toLocaleString()}</div>
          </div>

          {/* 5. Water Usage */}
          <div 
            onClick={() => onNavigateToTab('water')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase">{kpis.water.status}</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Water Usage</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              {kpis.water.currentLpm} <span className="text-xs font-normal text-[#64748B]">L/m</span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-1 font-mono">Today: {kpis.water.todayTotalL.toLocaleString()} L</div>
          </div>

          {/* 6. Campus Occupancy */}
          <div 
            onClick={() => onNavigateToTab('crowd')}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase">{kpis.crowd.peakOccupancyPct}%</span>
            </div>
            <div className="text-[11px] text-[#64748B] font-medium">Campus Occupancy</div>
            <div className="text-xl font-bold text-[#1E293B] font-mono tabular-nums mt-0.5">
              {kpis.crowd.currentPopulation.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#64748B] mt-1 font-mono">Capacity: 4,800</div>
          </div>
        </div>
      </div>

      {/* MAIN TELEMETRY SECTION: Clean White Card Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-[#2563EB] shrink-0">
            <Radio className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1E293B] tracking-tight">
                LIVE TELEMETRY &amp; IoT SENSOR MESH
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                {onlineSensorsCount} / {sensors.length} Sensors Online
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Streaming real-time operational feeds via LoRaWAN, BACnet/IP, and MQTT gateways.
            </p>
          </div>
        </div>

        {/* Small live indicator on the right */}
        <div className="flex items-center gap-3 text-xs text-[#64748B] shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg font-mono">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Polling frequency: 3.0s</span>
          </div>
          <span className="text-[11px] text-[#94A3B8] hidden md:inline">
            Updated 3s ago
          </span>
        </div>
      </div>

      {/* SENSOR CARDS: Clean 4-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {telemetryCards.map((m) => {
          const Icon = m.icon;
          const isWarning = m.statusType === 'warning';
          const isCritical = m.statusType === 'critical';

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB]/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group cursor-pointer"
              onClick={() => onNavigateToTab('monitoring')}
            >
              <div>
                {/* Header row: Icon, Title, Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 truncate pr-1">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#1E293B] truncate">
                      {m.title}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono ${
                    isCritical 
                      ? 'bg-red-50 text-[#DC2626] border border-red-200' 
                      : isWarning 
                      ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' 
                      : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                  }`}>
                    {m.status}
                  </span>
                </div>

                {/* Metric Value & Unit */}
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-3xl font-extrabold text-[#1E293B] font-mono tabular-nums tracking-tight">
                    {m.current}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B]">
                    {m.unit}
                  </span>
                </div>

                {/* Small modern line chart */}
                <div className="h-16 w-full my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={m.chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={600}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Footer: Avg and Peak */}
              <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] font-mono">
                <div>
                  <span className="text-[11px] text-[#94A3B8]">Avg: </span>
                  <span className="font-semibold text-[#1E293B]">{m.avg} {m.unit}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#94A3B8]">Peak: </span>
                  <span className="font-semibold text-[#1E293B]">{m.peak} {m.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI CAMPUS BRIEF CARD (Requirement 19) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#EFF6FF]/70 border border-[#BFDBFE] shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DBEAFE] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2563EB] text-white shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded-full font-mono">
                  CITYOS AI
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  Campus Brief
                </span>
              </div>
              <h2 className="text-base font-bold text-[#1E293B] mt-0.5">
                Executive Operations Intelligence
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiWithPrompt?.("Summarize today's campus status")}
              className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask CITYOS AI</span>
            </button>
            <button
              onClick={() => onNavigateToTab('insights')}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#BFDBFE] hover:bg-blue-50 text-[#2563EB] text-xs font-semibold transition-colors cursor-pointer"
            >
              View AI Insights
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-2 text-xs text-[#1E293B]">
            <p className="font-semibold text-sm text-[#1E293B]">
              "Campus operations are mostly stable."
            </p>
            <div className="text-[#64748B] space-y-1">
              <span className="font-semibold text-[#1E293B] block">2 areas require attention:</span>
              <div className="flex items-center gap-2 text-[#B45309]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>• <strong>Air Quality — Zone B:</strong> Sensor indicates 77 AQI (exceeds preferred 65 baseline).</span>
              </div>
              <div className="flex items-center gap-2 text-[#DC2626]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                <span>• <strong>Hydraulic Pressure — Building C / Hostel A:</strong> Riser pressure down to 18.2 PSI (nominal 54 PSI).</span>
              </div>
            </div>
            <p className="text-[#64748B] pt-1">
              Energy demand is trending upward by <strong>9.6%</strong> during peak afternoon laboratory sessions.
            </p>
          </div>

          <div className="lg:col-span-4 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#BFDBFE] flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2563EB] block">Recommended Action</span>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Review environmental conditions and high-consumption zones.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => onOpenAiWithPrompt?.("Why is the AQI showing a warning?")}
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1 cursor-pointer"
              >
                <span>Investigate AQI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenAiWithPrompt?.("Which building is consuming the most electricity?")}
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1 cursor-pointer"
              >
                <span>Audit Energy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI INSIGHTS: Visually attractive section directly below telemetry cards */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B] uppercase tracking-wider">
                Autonomous AI Insights &amp; Diagnostics
              </h2>
              <p className="text-xs text-[#64748B]">
                Machine learning signals correlated with physical campus telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('insights')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Insights ({insights.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Compact Cards as explicitly requested */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: AI INSIGHT (Blue for AI info) */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] transition-all flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  AI INSIGHT
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  Confidence 94%
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E293B] leading-snug">
                Energy Baseline Anomaly
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Energy consumption is 12% higher than the expected baseline in the Computer Science block.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#2563EB]">HVAC Chiller Loop #2</span>
              <button 
                onClick={() => onNavigateToTab('insights')}
                className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1E40AF]"
              >
                Inspect &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: PREDICTION (Green for positive/trend insight) */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#16A34A] transition-all flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  PREDICTION
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  Horizon: +2.5 hrs
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E293B] leading-snug">
                Ingress Water Demand Surge
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Water demand is expected to increase during the next monitoring period across Dining &amp; Athletic quads.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#16A34A]">Pump Buffer: Optimal</span>
              <button 
                onClick={() => onNavigateToTab('predictions')}
                className="text-[11px] font-semibold text-[#16A34A] hover:text-emerald-700"
              >
                View Model &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: ANOMALY (Orange for warning anomaly) */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#F59E0B] transition-all flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ANOMALY
                </span>
                <span className="text-[10px] font-mono text-[#F59E0B] font-bold">
                  Elevation Detected
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#1E293B] leading-snug">
                Zone B Air Quality Deviation
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Air quality readings show an unusual increase in Zone B kitchen exhaust corridor.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#F59E0B]">AQI 74 (Moderate)</span>
              <button 
                onClick={() => onNavigateToTab('anomalies')}
                className="text-[11px] font-semibold text-[#F59E0B] hover:text-amber-700"
              >
                Mitigate &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAP / DIGITAL TWIN PREVIEW: Visual Campus Map Preview */}
      <CampusMapPreview
        buildings={buildings}
        onNavigateToTab={onNavigateToTab}
        onSelectBuilding={onSelectBuilding}
      />

      {/* Middle Section: Real-Time Live Activity Feed + Power Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Real-time Live Activity Feed */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Real-Time Campus Activity Feed
              </h2>
            </div>
            <span className="text-xs text-[#64748B] font-mono">
              Auto-sync 3.0s
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {activities.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] flex items-start gap-3 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.severity === 'critical' 
                    ? 'bg-[#DC2626] animate-pulse' 
                    : item.severity === 'warning' 
                    ? 'bg-[#F59E0B]' 
                    : 'bg-[#16A34A]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#1E293B] leading-snug">
                    {item.title}
                  </div>
                  {item.buildingName && (
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {item.buildingName}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[#64748B] font-mono shrink-0 whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateToTab('alerts')}
            className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#2563EB] hover:text-[#1E40AF] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Incident Logs &amp; Alerts ({activeAlerts.length} Active)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Power Demand Curve */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                  Campus Power Demand Curve
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Aggregated smart-meter readings across 12 campus substations
                </p>
              </div>
              <span className="text-xs font-mono text-[#2563EB] font-bold">
                {kpis.energy.currentKwh} kWh Real-Time
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniEnergyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[60, 240]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#1E293B' }}
                    itemStyle={{ color: '#2563EB' }}
                  />
                  <Area type="monotone" dataKey="kwh" stroke="#2563EB" strokeWidth={2} fill="url(#energyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Urgent Intelligence Alert Banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
              <p className="text-xs text-[#1E293B] truncate">
                <span className="font-bold text-[#1E40AF]">Recommendation:</span> Computer Engineering Block HVAC optimization saves 14.2 kWh.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('anomalies')}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] whitespace-nowrap cursor-pointer"
            >
              Resolve &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Campus Building Status Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Campus Facilities Telemetry Matrix (12 Buildings)
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any building to inspect environmental sensors, power load, and digital twin specs
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('digital-twin')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect in 3D Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {buildings.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition-all hover:-translate-y-0.5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1E293B] truncate">
                  {b.name}
                </span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  b.status === 'critical' 
                    ? 'bg-[#DC2626] animate-pulse' 
                    : b.status === 'warning' 
                    ? 'bg-[#F59E0B]' 
                    : 'bg-[#16A34A]'
                }`} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Occupancy</span>
                  <span className="font-mono text-[#1E293B] font-semibold">{b.occupancy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Power</span>
                  <span className="font-mono text-[#1E293B] font-semibold">{b.energyUsage > 0 ? `${b.energyUsage} kWh` : 'Solar Net'}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>{b.category}</span>
                <span className="font-mono text-[#2563EB] font-semibold">{b.sensorsCount} nodes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
