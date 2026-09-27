import React, { useState } from 'react';
import { AiInsight } from '../../types';
import { 
  Sparkles, 
  AlertTriangle, 
  Zap, 
  Users, 
  Droplet, 
  Wind, 
  Trash2, 
  SunMedium, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface AiInsightsViewProps {
  insights: AiInsight[];
  onApplyAction: (insightId: string) => void;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  insights,
  onApplyAction,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const getCategoryIcon = (category: AiInsight['category']) => {
    switch (category) {
      case 'Energy': return Zap;
      case 'Crowd': return Users;
      case 'Water': return Droplet;
      case 'Environment': return Wind;
      case 'Waste': return Trash2;
      case 'Grid': return SunMedium;
      default: return Sparkles;
    }
  };

  const getSeverityBadge = (severity: AiInsight['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
    }
  };

  const filteredInsights = insights.filter(i => {
    if (selectedFilter === 'all') return true;
    return i.severity === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs uppercase tracking-wider text-[#2563EB] font-semibold">
                Autonomous Intelligence Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              CITYOS Intelligence
            </h1>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              Continuous neural pattern recognition correlating 248 IoT telemetry streams with historical baselines, timetable rosters, and weather forecasts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] self-start md:self-center">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === 'all' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              All ({insights.length})
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === 'critical' ? 'bg-red-50 text-[#DC2626] border border-red-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedFilter('warning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setSelectedFilter('info')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFilter === 'info' ? 'bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Optimizations
            </button>
          </div>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInsights.map((insight) => {
          const Icon = getCategoryIcon(insight.category);
          const isCompleted = insight.actionStatus === 'completed';

          return (
            <div
              key={insight.id}
              className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs hover:border-[#2563EB]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Badges & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
                      {insight.category} Insight
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${getSeverityBadge(insight.severity)}`}>
                      {insight.severity}
                    </span>
                    <span className="text-xs font-mono text-[#2563EB] font-semibold px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                      {insight.confidence}% Conf.
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-[#1E293B] mb-2 leading-snug">
                  {insight.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {insight.description}
                </p>

                {/* Context Metadata */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>Affected Area:</span>
                    <span className="text-[#1E293B] font-medium">{insight.affectedArea}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>Detected Time:</span>
                    <span className="text-[#1E293B] font-mono">{insight.detectedTime}</span>
                  </div>
                  {insight.potentialSavings && (
                    <div className="flex items-center justify-between text-[#64748B] pt-1 border-t border-[#E2E8F0]">
                      <span>Projected Benefit:</span>
                      <span className="text-[#16A34A] font-mono font-medium">{insight.potentialSavings}</span>
                    </div>
                  )}
                </div>

                {/* Recommended Action Box */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 mb-4">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#2563EB] mb-1">
                    Recommended Action
                  </div>
                  <div className="text-xs text-[#1E293B] font-medium">
                    "{insight.recommendedAction}"
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                  Status: {insight.actionStatus}
                </span>

                {isCompleted ? (
                  <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Action Deployed
                  </span>
                ) : (
                  <button
                    onClick={() => onApplyAction(insight.id)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Execute Recommendation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
