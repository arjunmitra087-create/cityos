import React, { useState } from 'react';
import { Alert, Building } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Search, 
  UserCheck, 
  Clock, 
  Building2, 
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface AlertsViewProps {
  alerts: Alert[];
  buildings: Building[];
  onResolveAlert: (alertId: string) => void;
  onSelectBuilding?: (building: Building) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  buildings,
  onResolveAlert,
  onSelectBuilding,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'info' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState('all');
  const [diagnosticsAlert, setDiagnosticsAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    // Tab filter
    if (activeTab === 'resolved' && a.status !== 'resolved') return false;
    if (activeTab !== 'resolved' && a.status === 'resolved') {
      if (activeTab !== 'all') return false;
    }
    if (activeTab !== 'all' && activeTab !== 'resolved' && a.severity !== activeTab) return false;

    // Building filter
    if (selectedBuildingId !== 'all' && a.buildingId !== selectedBuildingId) return false;

    // Search query
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.buildingName.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.status === 'active' && a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.status === 'active' && a.severity === 'info').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Incident & Alert Operations Center
            {criticalCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#DC2626] border border-red-200 font-semibold animate-pulse">
                {criticalCount} Critical Active
              </span>
            )}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated sensor threshold violations, AI diagnostic alerts, and facility dispatches.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'all' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            All Active ({alerts.filter(a => a.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'critical' ? 'bg-red-50 text-[#DC2626] border border-red-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setActiveTab('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Warning ({warningCount})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'info' ? 'bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Info ({infoCount})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'resolved' ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident title, description, or building..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#64748B] whitespace-nowrap">Filter Facility:</span>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All 12 Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-[#1E293B]">No active incidents matching criteria</h3>
            <p className="text-xs text-[#64748B] mt-1">All telemetry thresholds currently within nominal specifications.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.status === 'resolved';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all bg-[#FFFFFF] shadow-xs ${
                  isResolved
                    ? 'border-[#E2E8F0] opacity-75'
                    : alert.severity === 'critical'
                    ? 'border-red-200 hover:border-red-300'
                    : alert.severity === 'warning'
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-[#E2E8F0] hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Severity Dot Indicator */}
                    <div className="mt-1">
                      {isResolved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                      ) : alert.severity === 'critical' ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#DC2626] animate-pulse mt-0.5" />
                      ) : alert.severity === 'warning' ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] mt-0.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] mt-0.5" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#1E293B] font-medium">
                          {alert.id}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          alert.severity === 'critical' ? 'bg-red-50 text-[#DC2626] border border-red-200'
                          : alert.severity === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                          : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-semibold text-[#1E293B]">
                          {alert.category}
                        </span>
                        <span className="text-[#64748B]">·</span>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {alert.buildingName}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1E293B] leading-snug">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 max-w-3xl leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Value callout & Assignee */}
                      <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-[#64748B]">
                        {alert.metricValue && (
                          <div className="font-mono text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 font-semibold">
                            Reading: {alert.metricValue}
                          </div>
                        )}
                        {alert.assignedTo && (
                          <div className="flex items-center gap-1 text-[#1E293B]">
                            <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span>Assigned: {alert.assignedTo}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[#64748B]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Logged at {alert.timestamp}</span>
                        </div>
                        {alert.resolvedAt && (
                          <div className="text-[#16A34A] font-medium">
                            ✓ Resolved at {alert.resolvedAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setDiagnosticsAlert(alert)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-xs font-medium text-[#1E293B] transition-colors shadow-xs"
                    >
                      Diagnostics
                    </button>

                    {!isResolved && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Diagnostics Modal */}
      {diagnosticsAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  {diagnosticsAlert.id} Telemetry Trace
                </span>
                <h2 className="text-base font-bold text-[#1E293B] mt-1">
                  {diagnosticsAlert.title}
                </h2>
              </div>
              <button
                onClick={() => setDiagnosticsAlert(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#64748B]">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[#1E293B] space-y-1">
                <div>Sensor Node: SNS-B0{diagnosticsAlert.buildingId.split('-')[1]?.toUpperCase()}</div>
                <div>Trigger Condition: Baseline delta &gt; 2.5 std dev</div>
                <div>Protocol: BACnet/IP over Campus Fiber Ring</div>
                <div>Audit Packet Hash: 0x8F32AC...9E41</div>
              </div>
              <p className="text-[#64748B]">
                Automated telemetry diagnostics show nominal voltage supply. Recommended action: inspect physical actuator joint or reset smart-breaker circuit.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setDiagnosticsAlert(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#1E293B] hover:bg-slate-50"
              >
                Close Trace
              </button>
              {diagnosticsAlert.status !== 'resolved' && (
                <button
                  onClick={() => {
                    onResolveAlert(diagnosticsAlert.id);
                    setDiagnosticsAlert(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#16A34A] text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                >
                  Mark Incident Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
