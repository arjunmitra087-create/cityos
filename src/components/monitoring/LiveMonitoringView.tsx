import React, { useState, useEffect } from 'react';
import { Sensor, Building } from '../../types';
import { 
  Zap, 
  Droplet, 
  Thermometer, 
  Wind, 
  Volume2, 
  Users, 
  Search, 
  Filter, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface LiveMonitoringViewProps {
  sensors: Sensor[];
  buildings: Building[];
  initialCategory?: string;
}

interface TelemetryMetricCard {
  id: string;
  title: string;
  current: number;
  unit: string;
  avg: number;
  peak: number;
  historicalDelta: string;
  status: 'Nominal' | 'Warning' | 'Optimal';
  color: string;
  icon: any;
  series: Array<{ time: string; val: number }>;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  sensors,
  buildings,
  initialCategory = 'all',
}) => {
  const mapInitialCategory = (cat: string) => {
    if (cat === 'energy') return 'energy';
    if (cat === 'water') return 'water';
    if (cat === 'crowd') return 'occupancy';
    if (cat === 'parking') return 'parking';
    if (cat === 'environment') return 'temperature';
    if (cat === 'waste') return 'all';
    return cat;
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(mapInitialCategory(initialCategory));
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSelectedCategory(mapInitialCategory(initialCategory));
  }, [initialCategory]);

  // Auto-tick simulated sensor points
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic telemetry metrics with live fluctuating series
  const telemetryMetrics: TelemetryMetricCard[] = [
    {
      id: 'electricity',
      title: 'Active Electricity Demand',
      current: Math.round((184 + (Math.sin(tick) * 4)) * 10) / 10,
      unit: 'kWh',
      avg: 168.4,
      peak: 218.0,
      historicalDelta: '-8.4% vs last week',
      status: 'Nominal',
      color: '#06b6d4',
      icon: Zap,
      series: [
        { time: '10:00', val: 172 },
        { time: '10:15', val: 178 },
        { time: '10:30', val: 181 },
        { time: '10:45', val: 189 },
        { time: '11:00', val: 184 + Math.round(Math.sin(tick) * 4) },
      ],
    },
    {
      id: 'water',
      title: 'Main Ingress Water Flow',
      current: Math.round((426 + (Math.cos(tick) * 6)) * 10) / 10,
      unit: 'L/min',
      avg: 395.0,
      peak: 512.0,
      historicalDelta: '-5.2% vs last week',
      status: 'Nominal',
      color: '#0ea5e9',
      icon: Droplet,
      series: [
        { time: '10:00', val: 410 },
        { time: '10:15', val: 435 },
        { time: '10:30', val: 420 },
        { time: '10:45', val: 430 },
        { time: '11:00', val: 426 + Math.round(Math.cos(tick) * 6) },
      ],
    },
    {
      id: 'temp',
      title: 'Campus Ambient Temperature',
      current: Math.round((29.0 + (Math.sin(tick * 0.5) * 0.4)) * 10) / 10,
      unit: '°C',
      avg: 27.2,
      peak: 31.4,
      historicalDelta: '+1.8°C seasonal baseline',
      status: 'Warning',
      color: '#f59e0b',
      icon: Thermometer,
      series: [
        { time: '10:00', val: 27.8 },
        { time: '10:15', val: 28.2 },
        { time: '10:30', val: 28.7 },
        { time: '10:45', val: 28.9 },
        { time: '11:00', val: 29.0 + (Math.sin(tick * 0.5) * 0.4) },
      ],
    },
    {
      id: 'humidity',
      title: 'Relative Humidity',
      current: Math.round(52 + Math.cos(tick * 0.8) * 2),
      unit: '%',
      avg: 54.0,
      peak: 68.0,
      historicalDelta: 'Stable within comfort zone',
      status: 'Optimal',
      color: '#3b82f6',
      icon: Droplet,
      series: [
        { time: '10:00', val: 55 },
        { time: '10:15', val: 54 },
        { time: '10:30', val: 53 },
        { time: '10:45', val: 52 },
        { time: '11:00', val: 52 + Math.round(Math.cos(tick * 0.8) * 2) },
      ],
    },
    {
      id: 'aqi',
      title: 'Air Quality Index (AQI)',
      current: Math.round(74 + Math.sin(tick * 0.7) * 3),
      unit: 'AQI',
      avg: 58.0,
      peak: 92.0,
      historicalDelta: 'Moderate - Canteen area elevated',
      status: 'Warning',
      color: '#f97316',
      icon: Wind,
      series: [
        { time: '10:00', val: 62 },
        { time: '10:15', val: 68 },
        { time: '10:30', val: 71 },
        { time: '10:45', val: 75 },
        { time: '11:00', val: 74 + Math.round(Math.sin(tick * 0.7) * 3) },
      ],
    },
    {
      id: 'noise',
      title: 'Average Acoustic Level',
      current: Math.round(61 + Math.sin(tick) * 2),
      unit: 'dB',
      avg: 54.5,
      peak: 76.0,
      historicalDelta: '4 dB below regulatory limit',
      status: 'Nominal',
      color: '#8b5cf6',
      icon: Volume2,
      series: [
        { time: '10:00', val: 56 },
        { time: '10:15', val: 58 },
        { time: '10:30', val: 62 },
        { time: '10:45', val: 63 },
        { time: '11:00', val: 61 + Math.round(Math.sin(tick) * 2) },
      ],
    },
    {
      id: 'occupancy',
      title: 'Campus Total Occupancy',
      current: 78,
      unit: '%',
      avg: 64.0,
      peak: 86.0,
      historicalDelta: '2,184 registered badges',
      status: 'Nominal',
      color: '#10b981',
      icon: Users,
      series: [
        { time: '10:00', val: 62 },
        { time: '10:15', val: 71 },
        { time: '10:30', val: 74 },
        { time: '10:45', val: 76 },
        { time: '11:00', val: 78 },
      ],
    },
  ];

  // Filtered sensors from the 248 total
  const filteredSensors = sensors.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.type.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBuilding = selectedBuildingId === 'all' || s.buildingId === selectedBuildingId;
    const matchesQuery = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBuilding && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-[#2563EB] shrink-0">
            <Activity className="w-6 h-6 text-[#2563EB]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#1E293B] tracking-tight">
                LIVE TELEMETRY &amp; IoT SENSOR MESH
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                248 Sensors Online
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Streaming real-time operational feeds via LoRaWAN, BACnet/IP, and MQTT gateways.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#64748B] shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg font-mono">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Polling frequency: 3.0s</span>
          </div>
        </div>
      </div>

      {/* 7 Clean White Telemetry Cards with Real-time Charts in 4-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {telemetryMetrics.map((m) => {
          const Icon = m.icon;
          const isWarning = m.status === 'Warning';

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB]/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 truncate pr-1">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#1E293B] truncate">
                      {m.title}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                    isWarning 
                      ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' 
                      : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 my-2">
                  <div className="text-3xl font-extrabold text-[#1E293B] font-mono tabular-nums tracking-tight">
                    {m.current}
                  </div>
                  <span className="text-xs font-semibold text-[#64748B]">{m.unit}</span>
                </div>

                {/* Sparkline chart */}
                <div className="h-16 w-full my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={m.series} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-2.5 border-t border-[#E2E8F0] grid grid-cols-2 gap-1 text-xs text-[#64748B] font-mono">
                <div>
                  <span className="text-[11px] text-[#94A3B8]">Avg: </span>
                  <span className="font-semibold text-[#1E293B]">{m.avg} {m.unit}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#94A3B8]">Peak: </span>
                  <span className="font-semibold text-[#1E293B]">{m.peak} {m.unit}</span>
                </div>
                <div className="col-span-2 text-[10px] text-[#64748B] mt-1 truncate">
                  {m.historicalDelta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Database Explorer (248 Nodes) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              IoT Sensor Grid ({filteredSensors.length} of {sensors.length} nodes)
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live telemetry ping status, calibration drift, and physical gateway mapping
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sensor ID or zone..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 w-44 md:w-56"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Sensor Types</option>
              <option value="energy">Energy</option>
              <option value="water">Water</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="aqi">Air Quality</option>
              <option value="noise">Noise</option>
              <option value="occupancy">Occupancy</option>
              <option value="parking">Parking</option>
            </select>

            {/* Building Select */}
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Buildings (12)</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sensor Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[11px] border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Sensor ID</th>
                <th className="p-3">Device Name</th>
                <th className="p-3">Facility</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Live Reading</th>
                <th className="p-3">Status</th>
                <th className="p-3">Protocol</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-right">Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono">
              {filteredSensors.slice(0, 15).map((sensor) => (
                <tr key={sensor.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3 text-[#2563EB] font-bold">{sensor.id}</td>
                  <td className="p-3 text-[#1E293B] font-sans font-medium">{sensor.name}</td>
                  <td className="p-3 text-[#64748B] font-sans">{sensor.buildingName}</td>
                  <td className="p-3 text-[#1E293B] font-sans">{sensor.type}</td>
                  <td className="p-3 text-right text-[#1E293B] font-bold tabular-nums">
                    {sensor.value} <span className="text-[10px] text-[#64748B] font-normal">{sensor.unit}</span>
                  </td>
                  <td className="p-3 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      sensor.status === 'warning' 
                        ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' 
                        : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`} />
                      {sensor.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#64748B]">{sensor.protocol}</td>
                  <td className="p-3 text-[#64748B] font-sans">{sensor.location}</td>
                  <td className="p-3 text-right text-[#94A3B8] text-[11px]">{sensor.lastPing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
          <span>Showing 15 of {filteredSensors.length} matching nodes</span>
          <span className="font-mono text-[#2563EB]">BACnet/IP Gateway Auto-Polling Active</span>
        </div>
      </div>
    </div>
  );
};
