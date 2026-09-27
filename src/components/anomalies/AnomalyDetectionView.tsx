import React, { useState } from 'react';
import { AnomalyItem } from '../../types';
import { campusService } from '../../services/campusService';
import { 
  AlertTriangle, 
  Zap, 
  Droplet, 
  Thermometer, 
  Volume2, 
  Users, 
  Car, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface AnomalyDetectionViewProps {
  anomalies: AnomalyItem[];
  onMitigate?: (anomalyId: string) => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  anomalies,
  onMitigate,
}) => {
  const [filterMetric, setFilterMetric] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getMetricIcon = (type: AnomalyItem['metricType']) => {
    switch (type) {
      case 'Energy': return Zap;
      case 'Water': return Droplet;
      case 'Temperature': return Thermometer;
      case 'Noise': return Volume2;
      case 'Crowd': return Users;
      case 'Parking': return Car;
      default: return AlertTriangle;
    }
  };

  const filteredAnomalies = anomalies.filter((item) => {
    if (filterMetric !== 'all' && item.metricType !== filterMetric) return false;
    if (filterSeverity !== 'all' && item.severity !== filterSeverity) return false;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.buildingName.toLowerCase().includes(q) ||
      item.possibleCause.toLowerCase().includes(q) ||
      item.recommendedAction.toLowerCase().includes(q)
    );
  });

  const handleMitigate = (id: string) => {
    campusService.mitigateAnomaly(id);
    if (onMitigate) onMitigate(id);
  };

  const highCount = anomalies.filter(a => a.severity === 'HIGH' && a.status !== 'mitigated').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            AI Anomaly Detection Engine
            {highCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 font-bold animate-pulse">
                {highCount} High Deviation Events
              </span>
            )}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Continuous Bayesian baseline comparison flagging abnormal sensor deviations across 6 physical domains.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
          <span>Tolerance: ±2.5 Standard Deviations</span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anomaly, facility, cause..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Domains (6)</option>
            <option value="Energy">Energy</option>
            <option value="Water">Water</option>
            <option value="Temperature">Temperature</option>
            <option value="Noise">Noise</option>
            <option value="Crowd">Crowd</option>
            <option value="Parking">Parking</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Severities</option>
            <option value="HIGH">HIGH Severity</option>
            <option value="MEDIUM">MEDIUM Severity</option>
            <option value="LOW">LOW Severity</option>
          </select>
        </div>
      </div>

      {/* Anomalies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnomalies.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-[#1E293B]">No anomalies detected</h3>
            <p className="text-xs text-[#64748B] mt-1">All telemetry sensors operating within nominal historical envelopes.</p>
          </div>
        ) : (
          filteredAnomalies.map((anom) => {
            const Icon = getMetricIcon(anom.metricType);
            const isMitigated = anom.status === 'mitigated';

            return (
              <div
                key={anom.id}
                className={`p-6 rounded-2xl bg-[#FFFFFF] border transition-all flex flex-col justify-between shadow-xs ${
                  isMitigated
                    ? 'border-[#E2E8F0] opacity-70'
                    : anom.severity === 'HIGH'
                    ? 'border-red-200 hover:border-red-300'
                    : anom.severity === 'MEDIUM'
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-[#E2E8F0] hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#64748B]">
                          {anom.metricType} ANOMALY
                        </span>
                        <div className="text-xs font-bold text-[#1E293B]">
                          {anom.buildingName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        anom.severity === 'HIGH' ? 'bg-red-50 text-[#DC2626] border border-red-200'
                        : anom.severity === 'MEDIUM' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                        : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                      }`}>
                        {anom.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {anom.deviationPct > 0 ? `+${anom.deviationPct}%` : `${anom.deviationPct}%`} Dev
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#1E293B] mb-2 leading-snug">
                    {anom.title}
                  </h3>

                  {/* Benchmark Comparison Box (PART 5 Requirement) */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs grid grid-cols-2 gap-2 mb-3 font-mono">
                    <div>
                      <span className="text-[10px] text-[#64748B] font-sans block">Normal Range:</span>
                      <span className="text-[#1E293B] font-medium">{anom.normalRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] font-sans block">Current Sensor Value:</span>
                      <span className="text-[#DC2626] font-bold">{anom.currentValue}</span>
                    </div>
                  </div>

                  {/* Cause & Recommendation */}
                  <div className="space-y-2 text-xs mb-4">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-0.5">
                        Possible Underlying Cause:
                      </span>
                      <p className="text-[#1E293B] text-xs leading-relaxed">
                        {anom.possibleCause}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                      <span className="text-[10px] uppercase font-bold text-[#2563EB] block mb-0.5">
                        Recommended Action:
                      </span>
                      <p className="text-[#1E293B] text-xs font-medium leading-relaxed">
                        "{anom.recommendedAction}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Detected at {anom.detectedAt}
                  </span>

                  {isMitigated ? (
                    <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mitigation Deployed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMitigate(anom.id)}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Deploy Mitigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
