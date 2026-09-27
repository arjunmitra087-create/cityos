import React, { useState } from 'react';
import { Building, CampusKPIs } from '../../types';
import { campusService } from '../../services/campusService';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Zap, 
  Droplet, 
  Trash2,
  Printer,
  ChevronRight,
  X,
  FileCheck,
  Layers,
  ArrowRight,
  RefreshCw,
  Wind,
  Users
} from 'lucide-react';

interface ReportsViewProps {
  buildings: Building[];
  kpis: CampusKPIs;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ buildings, kpis }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('energy');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStageText, setGenerationStageText] = useState<string>('');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>('');

  // Selected campus performance metrics to include
  const [selectedMetrics, setSelectedMetrics] = useState<Record<string, boolean>>({
    energy: true,
    water: true,
    crowd: true,
    waste: true,
    parking: true,
    environment: true,
  });

  // Modal configuration state
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'both'>('pdf');
  const [selectedRangePreset, setSelectedRangePreset] = useState<'today' | '7d' | '30d' | 'semester' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-25');
  const [modalScope, setModalScope] = useState<string>('all');
  const [includeAiAudit, setIncludeAiAudit] = useState<boolean>(true);
  const [includeIsoCompliance, setIncludeIsoCompliance] = useState<boolean>(true);

  const [generatedReport, setGeneratedReport] = useState<any | null>({
    title: 'Monthly Energy & Microgrid Performance Audit',
    type: 'Energy Report',
    format: 'PDF',
    period: 'Past 30 Days (Current Semester)',
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'CITYOS Automated Intelligence Protocol v2.4',
    scope: 'All 12 Monitored Facilities · 248 IoT Nodes',
    metricsIncluded: ['Energy', 'Water', 'Crowd', 'Waste', 'Parking', 'Environment'],
    highlights: [
      'Total Campus Energy Consumption: 85,200 kWh (8.4% reduction vs baseline)',
      'Solar Rooftop Substation Net Production: 14,240 kWh offset',
      'Primary Consumer: Computer Engineering Block (18,400 kWh, +18% peak due to AI clusters)',
      'Automated HVAC Load Shedding Savings: $4,850 in utility demand surcharges',
    ],
    recommendations: [
      'Schedule cleanroom air exchange reduction in BioTech complex between 20:00 and 06:00.',
      'Deploy Lithium battery storage bank B-2 during peak tariff hours (16:00 - 19:00).',
      'Replace aging chilled water actuator on Block B pump #2.',
    ],
  });

  const reportTypes = [
    { id: 'energy', name: 'Energy Report', desc: 'Electricity demand curves, HVAC efficiency, microgrid solar yield, and peak demand charges.', icon: Zap },
    { id: 'water', name: 'Water Report', desc: 'Hydraulic flow rates, potable water conservation, leak detection events, and riser pressure.', icon: Droplet },
    { id: 'waste', name: 'Waste & Recycling Report', desc: 'Solid waste tonnages, dumpster fill velocity, and compost recycling diversion rates.', icon: Trash2 },
    { id: 'sustainability', name: 'Sustainability & ESG Report', desc: 'Carbon footprint metrics, net-zero trajectory, and campus environmental compliance.', icon: Sparkles },
    { id: 'performance', name: 'Campus Performance Report', desc: 'Holistic system availability, space utilization, parking turnover, and building health.', icon: Building2 },
    { id: 'ai-insights', name: 'AI Insights & Anomaly Report', desc: 'Full log of neural anomaly detections, confidence scores, and automated mitigations.', icon: FileText },
  ];

  const metricOptions = [
    { key: 'energy', label: 'Electricity & Solar Microgrid', icon: Zap, summary: `${kpis.energy.currentKwh} kWh active draw` },
    { key: 'water', label: 'Hydraulics & Potable Water', icon: Droplet, summary: `${kpis.water.currentLpm} L/min flow rate` },
    { key: 'crowd', label: 'Crowd & Space Occupancy', icon: Users, summary: `${kpis.crowd.currentPopulation} occupants (${kpis.crowd.peakOccupancyPct}% peak)` },
    { key: 'waste', label: 'Solid Waste & ESG Diversion', icon: Trash2, summary: `${kpis.waste.todayWasteKg} kg (71% recycled)` },
    { key: 'parking', label: 'Smart Parking Bays', icon: Layers, summary: `${kpis.parking.occupiedPct}% occupied (${kpis.parking.availableSpaces} bays left)` },
    { key: 'environment', label: 'Air Quality (AQI) & Noise', icon: Wind, summary: `AQI ${kpis.environment.aqi} · ${kpis.environment.noiseDb} dB` },
  ];

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      // Ensure at least one metric is always selected
      if (prev[key] && activeCount <= 1) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  // Simulated server-side document creation pipeline
  const runServerDocumentCreation = (format: 'pdf' | 'csv' | 'both', rangeLabel: string, scopeName: string) => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStageText('Querying 248 IoT edge telemetry datastores...');

    setTimeout(() => {
      setGenerationProgress(35);
      setGenerationStageText('Aggregating selected metrics & computing historical diurnal variance...');
    }, 350);

    setTimeout(() => {
      setGenerationProgress(65);
      setGenerationStageText('Evaluating AI anomaly models & synthesizing executive audit findings...');
    }, 750);

    setTimeout(() => {
      setGenerationProgress(90);
      setGenerationStageText('Rendering document binary payload & generating SHA-256 cryptographic signature...');
    }, 1150);

    setTimeout(() => {
      const typeObj = reportTypes.find(t => t.id === selectedReportType);
      const activeMetricNames = metricOptions
        .filter(m => selectedMetrics[m.key])
        .map(m => m.label);

      // Build dynamic highlights based on selected metrics
      const dynamicHighlights: string[] = [];
      if (selectedMetrics.energy) {
        dynamicHighlights.push(`Total Energy Consumption: ${kpis.energy.todayTotalKwh.toLocaleString()} kWh recorded (${Math.abs(kpis.energy.trend)}% reduction vs baseline)`);
      }
      if (selectedMetrics.water) {
        dynamicHighlights.push(`Hydraulic Network Flow: ${kpis.water.currentLpm} L/min across secondary distribution manifolds`);
      }
      if (selectedMetrics.crowd) {
        dynamicHighlights.push(`Campus Headcount: Active population ${kpis.crowd.currentPopulation} with peak occupancy at ${kpis.crowd.peakOccupancyPct}%`);
      }
      if (selectedMetrics.waste) {
        dynamicHighlights.push(`Solid Waste Generation: ${kpis.waste.todayWasteKg} kg daily accumulation with 71% verified diversion`);
      }
      if (selectedMetrics.parking) {
        dynamicHighlights.push(`Smart Parking Deck: ${kpis.parking.occupiedPct}% occupied (${kpis.parking.availableSpaces} bays remaining)`);
      }
      if (selectedMetrics.environment) {
        dynamicHighlights.push(`Environmental Safety: Ambient AQI ${kpis.environment.aqi} and average acoustic reading ${kpis.environment.noiseDb} dB`);
      }

      if (includeIsoCompliance) {
        dynamicHighlights.push('ISO 50001 Energy Management standard conformance audited');
      }

      const formatLabel = format === 'both' ? 'PDF & CSV Bundle' : format.toUpperCase();

      const newReport = {
        title: `${typeObj?.name} — Executive Audit`,
        type: typeObj?.name,
        format: formatLabel,
        period: rangeLabel,
        generatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: 'CITYOS Automated Intelligence Protocol v2.4',
        scope: scopeName === 'all' ? 'All 12 Monitored Campus Facilities' : `Selected Facility: ${scopeName}`,
        metricsIncluded: activeMetricNames,
        highlights: dynamicHighlights,
        recommendations: includeAiAudit ? [
          'Maintain current schedule for automated LoRaWAN sensor battery checkouts.',
          'Verify acoustic baffles around Auditorium prior to upcoming symposium.',
          'Continue real-time anomaly tracking via CITYOS neural models.',
          'Deploy Battery Storage Bank B-2 during peak tariff hours to shave microgrid surcharge.',
        ] : ['Standard facility maintenance protocol initiated.'],
      };

      setGeneratedReport(newReport);
      setGenerationProgress(100);
      setGenerationStageText('Document generation complete.');
      setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsGenerating(false);
      setIsModalOpen(false);

      if (format === 'csv' || format === 'both') {
        campusService.exportTelemetryCSV();
      }
    }, 1500);
  };

  const handleDirectGenerate = () => {
    let periodLabel = 'Last 30 Days (Current Semester)';
    if (selectedRangePreset === 'today') periodLabel = 'Today (Real-Time Snapshot)';
    else if (selectedRangePreset === '7d') periodLabel = 'Last 7 Days';
    else if (selectedRangePreset === 'semester') periodLabel = 'Full Semester to Date';
    else if (selectedRangePreset === 'custom') periodLabel = `${customStartDate} to ${customEndDate}`;

    runServerDocumentCreation(selectedFormat, periodLabel, modalScope);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmGenerateFromModal = () => {
    let periodLabel = 'Last 30 Days';
    if (selectedRangePreset === 'today') periodLabel = 'Today (Real-Time Snapshot)';
    else if (selectedRangePreset === '7d') periodLabel = 'Last 7 Days';
    else if (selectedRangePreset === 'semester') periodLabel = 'Full Semester to Date';
    else if (selectedRangePreset === 'custom') periodLabel = `${customStartDate} to ${customEndDate}`;

    runServerDocumentCreation(selectedFormat, periodLabel, modalScope);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportCSV = () => {
    campusService.exportTelemetryCSV();
  };

  const activeTypeObj = reportTypes.find(t => t.id === selectedReportType);
  const selectedMetricsCount = Object.values(selectedMetrics).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Campus Audit &amp; Operational Reports
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Generate compliance documents, ESG audits, sustainability records, and raw CSV telemetry dumps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#1E293B] flex items-center gap-2 transition-colors border border-[#E2E8F0] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#16A34A]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenModal}
            className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#1E293B] flex items-center gap-2 transition-colors border border-[#E2E8F0] cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            <span>Format &amp; Dates</span>
          </button>
          <button
            onClick={handleDirectGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating ({generationProgress}%)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate ({selectedMetricsCount} Metrics)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Server-Side Document Creation Pipeline Progress Banner */}
      {isGenerating && (
        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#1E40AF] font-semibold">
              <RefreshCw className="w-4 h-4 text-[#2563EB] animate-spin" />
              <span>CITYOS Document Engine: Server-side document creation in progress...</span>
            </div>
            <span className="font-mono text-[#2563EB] font-bold">{generationProgress}%</span>
          </div>

          <div className="w-full bg-[#DBEAFE] rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-[#2563EB] transition-all duration-300 ease-out"
              style={{ width: `${generationProgress}%` }}
            />
          </div>

          <div className="text-[11px] text-[#1E40AF] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>&gt; {generationStageText}</span>
            <span className="text-[#64748B] font-mono">Stream: /v2/telemetry/report-stream</span>
          </div>
        </div>
      )}

      {/* Completion alert banner if generated recently */}
      {!isGenerating && lastGeneratedAt && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-[#16A34A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>Document successfully compiled at {lastGeneratedAt}. All {selectedMetricsCount} selected campus performance metrics incorporated.</span>
          </div>
          <button
            onClick={() => setLastGeneratedAt('')}
            className="text-[#64748B] hover:text-[#1E293B] text-xs px-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-5">
            {/* Step 1: Template */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  1. Report Category
                </h2>
                <span className="text-[11px] text-[#64748B] font-mono">
                  {reportTypes.length} Available
                </span>
              </div>

              <div className="space-y-2">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedReportType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedReportType(type.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-xs'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#FFFFFF] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                          {type.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] leading-relaxed mt-0.5 line-clamp-1">
                          {type.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Performance Metrics Checklist */}
            <div className="pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  2. Campus Performance Metrics to Include
                </h2>
                <span className="text-[11px] font-mono text-[#2563EB] font-bold">
                  {selectedMetricsCount} of {metricOptions.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {metricOptions.map((opt) => {
                  const isChecked = !!selectedMetrics[opt.key];
                  const Icon = opt.icon;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => toggleMetric(opt.key)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-70 hover:opacity-100 hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-0 shrink-0 pointer-events-none"
                        />
                        <Icon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="text-[#1E293B] font-medium truncate">{opt.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B] shrink-0 ml-2">
                        {opt.summary}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Generation Trigger */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <button
                onClick={handleDirectGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Compiling Document ({generationProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Report ({selectedMetricsCount} Metrics)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenModal}
                disabled={isGenerating}
                className="w-full py-2 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Configure Format &amp; Date Range</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Report Preview */}
        <div className="lg:col-span-7">
          {generatedReport && (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                      CITYOS VERIFIED AUDIT
                    </span>
                    <span className="text-xs text-[#64748B]">{generatedReport.period}</span>
                    <span className="text-xs font-mono text-[#16A34A] font-semibold">[{generatedReport.format || 'PDF'}]</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">
                    {generatedReport.title}
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Compiled by {generatedReport.author} on {generatedReport.generatedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#1E293B] flex items-center gap-1.5 transition-colors border border-[#E2E8F0] cursor-pointer"
                    title="Export as CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handlePrintPdf}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E40AF] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Print or Save PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Scope Box */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-center justify-between text-[#64748B]">
                <span>Facility Scope:</span>
                <span className="font-semibold text-[#1E293B]">{generatedReport.scope}</span>
              </div>

              {/* Highlights */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Key Operational Telemetry Findings
                </h3>
                <div className="space-y-2">
                  {generatedReport.highlights.map((h: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Strategic Energy &amp; Facility Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {generatedReport.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-[#1E293B] flex items-start gap-2.5">
                      <span className="text-[#2563EB] font-mono font-bold shrink-0">{idx + 1}.</span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signoff */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                <span>Digital Signature: SHA-256 (0x7F21...9B08)</span>
                <span className="text-[#16A34A] font-semibold">ISO 50001 Standard Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog: Format & Date Range Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
          <div 
            className="w-full max-w-xl rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xl p-6 space-y-6 relative overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                    REPORT COMPILER
                  </span>
                  <span className="text-xs text-[#64748B]">{activeTypeObj?.name}</span>
                </div>
                <h2 id="modal-title" className="text-lg font-bold text-[#1E293B]">
                  Configure Report Format &amp; Range
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Select export format and temporal baseline before initiating telemetry synthesis.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5">
              {/* Section 1: Format Selection (PDF / CSV / Both) */}
              <div>
                <label className="text-xs font-semibold text-[#1E293B] block mb-2 uppercase tracking-wider">
                  1. Output Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* PDF Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('pdf')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === 'pdf'
                        ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${selectedFormat === 'pdf' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      {selectedFormat === 'pdf' && (
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#1E293B]">PDF Document</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">Printable executive audit</div>
                  </button>

                  {/* CSV Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('csv')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === 'csv'
                        ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${selectedFormat === 'csv' ? 'bg-[#16A34A] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      {selectedFormat === 'csv' && (
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#1E293B]">CSV Dataset</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">Raw telemetry records</div>
                  </button>

                  {/* Both Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('both')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === 'both'
                        ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${selectedFormat === 'both' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#64748B]'}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      {selectedFormat === 'both' && (
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#1E293B]">Bundle (Both)</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">Executive + Raw CSV</div>
                  </button>
                </div>
              </div>

              {/* Section 2: Date Range Selection */}
              <div>
                <label className="text-xs font-semibold text-[#1E293B] block mb-2 uppercase tracking-wider">
                  2. Date Range Horizon
                </label>
                
                {/* Presets Segmented Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRangePreset('today')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedRangePreset === 'today'
                        ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRangePreset('7d')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedRangePreset === '7d'
                        ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRangePreset('30d')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedRangePreset === '30d'
                        ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRangePreset('semester')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedRangePreset === 'semester'
                        ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    Semester
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRangePreset('custom')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedRangePreset === 'custom'
                        ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Date Pickers */}
                {selectedRangePreset === 'custom' && (
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">End Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Facility Scope */}
              <div>
                <label className="text-xs font-semibold text-[#1E293B] block mb-1.5 uppercase tracking-wider">
                  3. Facility Scope
                </label>
                <select
                  value={modalScope}
                  onChange={(e) => setModalScope(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="all">Full Campus (All 12 Facilities · 248 IoT Nodes)</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Section 4: Audit Checkboxes */}
              <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[#1E293B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAiAudit}
                    onChange={(e) => setIncludeAiAudit(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-0"
                  />
                  <span>Include CITYOS AI neural anomaly diagnosis &amp; recommendations</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#1E293B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIsoCompliance}
                    onChange={(e) => setIncludeIsoCompliance(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-0"
                  />
                  <span>Include ISO 50001 energy compliance signature &amp; certification hash</span>
                </label>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B] font-mono">
                Estimated time: ~0.7s · Format: {selectedFormat.toUpperCase()}
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#1E293B] border border-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleConfirmGenerateFromModal}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Compiling Document ({generationProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate &amp; Export</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

