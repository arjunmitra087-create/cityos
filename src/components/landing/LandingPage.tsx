import React from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Droplet, 
  Users, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  Building2,
  ChevronRight,
  TrendingUp,
  Radio
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (targetTab?: string) => void;
  onNavigateLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onNavigateLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single element Brand wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-base shadow-sm">
              C
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#1E293B]">
              CITYOS
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#64748B]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#1E293B] hover:text-[#2563EB] transition-colors">
              Home
            </button>
            <button onClick={() => onEnterDashboard('digital-twin')} className="hover:text-[#2563EB] transition-colors">
              Digital Twin
            </button>
            <button onClick={() => onEnterDashboard('monitoring')} className="hover:text-[#2563EB] transition-colors">
              Live Monitoring
            </button>
            <button onClick={() => onEnterDashboard('insights')} className="hover:text-[#2563EB] transition-colors">
              AI Insights
            </button>
            <button onClick={() => onEnterDashboard('analytics')} className="hover:text-[#2563EB] transition-colors">
              Analytics
            </button>
            <button onClick={() => onEnterDashboard('about')} className="hover:text-[#2563EB] transition-colors">
              About
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors px-3 py-1.5"
            >
              Login
            </button>
            <button
              onClick={() => onEnterDashboard('overview')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1E40AF] rounded-lg transition-all shadow-sm whitespace-nowrap"
            >
              Launch Console
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 px-6 overflow-hidden bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#2563EB]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#2563EB]" />
              <span>SENSE · ANALYZE · PREDICT · OPTIMIZE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight leading-[1.1] text-balance">
              The Intelligent Operating System for Your Campus
            </h1>

            <p className="text-lg sm:text-xl font-bold text-[#2563EB] tracking-wide">
              Connect. Understand. Predict. Optimize.
            </p>

            <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed text-balance">
              CITYOS fuses AI, distributed IoT telemetry, real-time analytics, and an interactive 3D digital twin to make university operations radically smarter, sustainable, and predictive.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <button
                onClick={() => onEnterDashboard('digital-twin')}
                className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <Cpu className="w-4 h-4" />
                <span>Explore Digital Twin</span>
              </button>
              <button
                onClick={() => onEnterDashboard('overview')}
                className="px-6 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <Activity className="w-4 h-4 text-[#2563EB]" />
                <span>View Live Dashboard</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup: 3D/Isometric Campus with interactive overlay pins */}
          <div className="mt-12 relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-white">
            <div className="relative aspect-[16/9] w-full">
              <img
                src="/src/assets/images/hero_campus_digital_twin_1790358822522.jpg"
                alt="CITYOS 3D Campus Digital Twin Preview"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              {/* Floating Live Telemetry Cards over the 3D twin image */}
              <div className="absolute top-4 left-4 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] text-xs shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <div>
                  <div className="font-bold text-[#1E293B]">North Apex Digital Twin</div>
                  <div className="text-[11px] text-[#64748B]">12 Buildings Linked · Latency 14ms</div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-xl">
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Live Power</span>
                    <span className="text-[#1E293B] font-bold font-mono text-sm">184 kWh</span>
                  </div>
                  <div className="h-6 w-px bg-[#E2E8F0]" />
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Active Flow</span>
                    <span className="text-[#1E293B] font-bold font-mono text-sm">426 L/min</span>
                  </div>
                  <div className="h-6 w-px bg-[#E2E8F0]" />
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Air Quality</span>
                    <span className="text-[#16A34A] font-bold font-mono text-sm">74 AQI (Nominal)</span>
                  </div>
                </div>

                <button
                  onClick={() => onEnterDashboard('digital-twin')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Interact with 3D Scene</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Statistics Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] font-mono tabular-nums">
                12
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wider">
                Buildings Modeled
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-mono tabular-nums">
                248
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wider">
                IoT Edge Sensors
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#16A34A] font-mono tabular-nums">
                98.4%
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wider">
                System Uptime
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] font-mono tabular-nums">
                24/7
              </div>
              <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wider">
                Neural Monitoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SENSE -> ANALYZE -> PREDICT -> OPTIMIZE Section */}
      <section className="py-16 px-6 bg-[#FFFFFF] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-2">
              Autonomous Operational Loop
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              SENSE → ANALYZE → PREDICT → OPTIMIZE
            </p>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              How CITYOS transforms heterogeneous physical infrastructure into an intelligent, self-balancing ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1: SENSE */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[#2563EB] font-mono font-bold text-xs uppercase tracking-wider block mb-2">
                  01 · SENSE
                </span>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">
                  Multi-Protocol IoT Ingestion
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  248 sensors streaming power draw, hydraulic flow, acoustic noise, turnstile counts, and particulate matter via LoRaWAN and BACnet/IP.
                </p>
              </div>
            </div>

            {/* Step 2: ANALYZE */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[#2563EB] font-mono font-bold text-xs uppercase tracking-wider block mb-2">
                  02 · ANALYZE
                </span>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">
                  Spatial Digital Twin Mapping
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  WebGL 3D coordinate telemetry correlates cross-building dependencies, heat plumes, and pressure differentials in real-time.
                </p>
              </div>
            </div>

            {/* Step 3: PREDICT */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[#2563EB] font-mono font-bold text-xs uppercase tracking-wider block mb-2">
                  03 · PREDICT
                </span>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">
                  LSTM Neural Forecasting
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Anticipates 24-hour peak electric demand, dining hall surges, and parking congestion before bottlenecks occur.
                </p>
              </div>
            </div>

            {/* Step 4: OPTIMIZE */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[#2563EB] font-mono font-bold text-xs uppercase tracking-wider block mb-2">
                  04 · OPTIMIZE
                </span>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">
                  Closed-Loop Autonomous Action
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Auto-balances HVAC setpoints, directs microgrid battery storage dispatch, and routes facility tickets automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Subsystems Grid */}
      <section id="about" className="py-16 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-2">
              Comprehensive Domain Coverage
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              One Unified Interface for All Campus Infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">Energy &amp; Microgrid</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Smart substation meters, rooftop solar generation tracking, and peak demand shaving across all academic quads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">Water &amp; Hydraulics</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Riser pressure monitoring, leak cavitation warnings, cooling tower cycles, and student residential flow rates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">Crowd &amp; Occupancy</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dining hall queues, turnstile influx prediction, and library quiet zone occupancy sensors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">Waste &amp; ESG Diversion</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ultrasonic bin fill levels, automated compactor collection dispatch, and 71% verified landfill diversion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">Environment &amp; Air Quality</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Real-time PM2.5, CO2 ppm monitoring in lecture halls, and acoustic compliance around the auditorium.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">AI Assistant &amp; Analytics</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ask questions in natural language, generate ISO 50001 reports, and download raw CSV audit datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-[#FFFFFF] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E293B]">CITYOS</span>
            <span>— Intelligent Campus Operating System</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onEnterDashboard('digital-twin')} className="hover:text-[#2563EB]">Digital Twin</button>
            <button onClick={() => onEnterDashboard('overview')} className="hover:text-[#2563EB]">Live Dashboard</button>
            <button onClick={onNavigateLogin} className="hover:text-[#2563EB]">Admin Portal</button>
          </div>
          <div>
            &copy; 2026 CITYOS Corporation. Built for University &amp; Smart City Infrastructure.
          </div>
        </div>
      </footer>
    </div>
  );
};
