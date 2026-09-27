import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Building2, 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Sparkles, 
  Bell, 
  Save, 
  Check, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campus' | 'telemetry' | 'ai' | 'alerts' | 'security'>('campus');
  const [campusName, setCampusName] = useState('Metro Innovation District (North Campus)');
  const [timezone, setTimezone] = useState('America/New_York (UTC-5)');
  const [pollingFreq, setPollingFreq] = useState('3.0s');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [anomalyDetectionEnabled, setAnomalyDetectionEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B]">System Configuration & Parameters</h1>
          </div>
          <p className="text-sm text-[#64748B]">Manage gateway protocols, digital twin telemetry sampling, and AI engine parameters</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white font-medium text-sm transition-all duration-200 shadow-sm"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E2E8F0]">
        {[
          { id: 'campus', label: 'Campus Profile', icon: Building2 },
          { id: 'telemetry', label: 'IoT Telemetry & Mesh', icon: Radio },
          { id: 'ai', label: 'AI & Inference Engine', icon: Sparkles },
          { id: 'alerts', label: 'Alerting Policies', icon: Bell },
          { id: 'security', label: 'Security & Access', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'campus' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base font-semibold text-[#1E293B]">Campus Identity & Localization</h2>
            <p className="text-xs text-[#64748B]">Configure base identifiers and geographic parameters for the campus deployment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">Campus Name</label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">Primary Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">Gross Land Area</label>
              <input
                type="text"
                readOnly
                value="142 Hectares (350.8 Acres)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#64748B] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">Digital Twin Coordinate Datum</label>
              <input
                type="text"
                readOnly
                value="WGS84 / UTM Zone 18N (40.7128° N, 74.0060° W)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#64748B] cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base font-semibold text-[#1E293B]">IoT Gateway & Polling Intervals</h2>
            <p className="text-xs text-[#64748B]">Adjust sampling frequency across MQTT, BACnet/IP, and LoRaWAN gateways.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">Telemetry Polling Frequency</label>
              <select
                value={pollingFreq}
                onChange={(e) => setPollingFreq(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="1.0s">1.0s (High-Frequency Diagnostic)</option>
                <option value="3.0s">3.0s (Standard Balanced Mode)</option>
                <option value="5.0s">5.0s (Power Optimization)</option>
                <option value="10.0s">10.0s (Low-Bandwidth Mode)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider mb-2">BACnet/IP Gateway Port</label>
              <input
                type="text"
                readOnly
                value="47808 (UDP - Active)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#64748B] cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base font-semibold text-[#1E293B]">Gemini AI Model & Analytics Settings</h2>
            <p className="text-xs text-[#64748B]">Control automatic anomaly inference, prediction time horizons, and confidence filters.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <h3 className="text-sm font-semibold text-[#1E293B]">Continuous Anomaly Detection</h3>
                <p className="text-xs text-[#64748B]">Real-time residual analysis against baseline multivariate models</p>
              </div>
              <input
                type="checkbox"
                checked={anomalyDetectionEnabled}
                onChange={(e) => setAnomalyDetectionEnabled(e.target.checked)}
                className="w-5 h-5 text-[#2563EB] rounded border-[#E2E8F0] focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider">AI Confidence Threshold ({aiConfidenceThreshold}%)</label>
                <span className="text-xs text-[#64748B]">Min confidence for automated alerts</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#2563EB]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base font-semibold text-[#1E293B]">Notification & Escalation Channels</h2>
            <p className="text-xs text-[#64748B]">Set targets for automated critical campus alerts</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            <p className="text-xs text-[#1E293B]">Incident auto-dispatch connected to Campus Operations Operations Team via PagerDuty and Webhooks.</p>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base font-semibold text-[#1E293B]">Authentication & Encryption Status</h2>
            <p className="text-xs text-[#64748B]">Role-based access controls and node cryptography</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="font-semibold text-[#1E293B]">Sensor Mesh Key Rotation</div>
              <div className="text-[#64748B] mt-0.5">AES-256 GCM (Rotated every 24h)</div>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="font-semibold text-[#1E293B]">RBAC Authorization</div>
              <div className="text-[#64748B] mt-0.5">Level 3 Campus Operations Director</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
