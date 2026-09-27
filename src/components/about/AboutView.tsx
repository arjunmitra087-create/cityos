import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Radio, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Droplet,
  Users,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface AboutViewProps {
  onNavigateToTab: (tab: any) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Hero Presentation */}
      <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#2563EB]" />
          <span>INNOVATIVE INTEGRATED CAMPUS PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
          About CITYOS — Intelligent Campus Operating System
        </h1>

        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-3xl">
          CITYOS is an integrated operating system designed for modern university campuses and smart institutional facilities. By fusing artificial intelligence, edge IoT sensor telemetry, real-time spatial digital twin modeling, and closed-loop facility automation, CITYOS empowers campus administrators to understand, predict, and optimize resource usage across every building.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToTab('digital-twin')}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch 3D Digital Twin</span>
          </button>
          <button
            onClick={() => onNavigateToTab('overview')}
            className="px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>View Live Dashboard</span>
          </button>
        </div>
      </div>

      {/* SENSE → ANALYZE → PREDICT → OPTIMIZE */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-1.5">
            Architectural Philosophy
          </h2>
          <p className="text-2xl font-extrabold text-[#1E293B]">
            SENSE &rarr; ANALYZE &rarr; PREDICT &rarr; OPTIMIZE
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            The four-stage autonomous intelligence loop that turns raw physical signals into proactive operational decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. SENSE */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-xs font-mono font-bold mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1.5">
                SENSE
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ingests heterogeneous telemetry from 248 IoT edge nodes streaming via BACnet/IP, LoRaWAN, and MQTT protocols across 12 facilities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#2563EB] font-mono font-semibold">
              248 Nodes Online
            </div>
          </div>

          {/* 2. ANALYZE */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-xs font-mono font-bold mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1.5">
                ANALYZE
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Correlates real-time spatial coordinates, historical diurnal baselines, and thermal dissipation inside an interactive 3D WebGL digital twin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#2563EB] font-mono font-semibold">
              WebGL Spatial Engine
            </div>
          </div>

          {/* 3. PREDICT */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center text-xs font-mono font-bold mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1.5">
                PREDICT
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Bi-directional LSTM neural models forecast 24-hour power peaks, canteen lunchtime surges, and evening water demand with &gt;90% confidence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#F59E0B] font-mono font-semibold">
              Bayesian LSTM Forecaster
            </div>
          </div>

          {/* 4. OPTIMIZE */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center text-xs font-mono font-bold mb-3">
                04
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1.5">
                OPTIMIZE
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Closes the loop with automated HVAC setpoint load shedding, microgrid battery arbitrage, and preventative work order generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#16A34A] font-mono font-semibold">
              Autonomous Dispatch
            </div>
          </div>
        </div>
      </div>

      {/* Core Technology Integrations */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
          Integrated System Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1E293B]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Predictive AI Models</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Trained on high-frequency IoT readings, lecture timetable rosters, and weather forecasts to detect thermal and electrical anomalies early.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1E293B]">
              <Cpu className="w-4 h-4 text-[#2563EB]" />
              <span>Interactive Digital Twin</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Real-time 3D isometric representation of 12 campus facilities with live color-coded status beacons (Normal, Warning, Critical).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1E293B]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>ISO 50001 ESG Auditing</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Automated document compiler producing cryptographically signed PDF audits and CSV data dumps for institutional sustainability accreditation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
