import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Zap, 
  Droplet, 
  Trash2, 
  Users, 
  Car, 
  Wind, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Settings,
  X,
  Radio,
  ShieldAlert,
  Flame,
  Leaf,
  Info
} from 'lucide-react';
import { ViewTab } from '../../types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isOpen: boolean;
  onClose: () => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  activeAlertsCount,
}) => {
  const mainNavigation = [
    { id: 'overview' as ViewTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'digital-twin' as ViewTab, label: 'Digital Twin', icon: Cpu, badge: '3D' },
  ];

  const subsystemNavigation = [
    { id: 'energy' as ViewTab, label: 'Energy Grid', icon: Zap },
    { id: 'water' as ViewTab, label: 'Water Network', icon: Droplet },
    { id: 'waste' as ViewTab, label: 'Waste & ESG', icon: Trash2 },
    { id: 'crowd' as ViewTab, label: 'Crowd & Density', icon: Users },
    { id: 'parking' as ViewTab, label: 'Smart Parking', icon: Car },
    { id: 'environment' as ViewTab, label: 'Environment', icon: Wind },
  ];

  const intelligenceNavigation = [
    { id: 'insights' as ViewTab, label: 'AI Insights', icon: Sparkles },
    { id: 'predictions' as ViewTab, label: 'Predictions', icon: TrendingUp },
    { id: 'anomalies' as ViewTab, label: 'Anomaly Engine', icon: ShieldAlert },
    { 
      id: 'alerts' as ViewTab, 
      label: 'Alerts Center', 
      icon: AlertTriangle, 
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : undefined,
      badgeColor: activeAlertsCount > 0 ? 'bg-[#DC2626] text-white' : undefined
    },
    { id: 'heatmaps' as ViewTab, label: 'Campus Heatmaps', icon: Flame },
    { id: 'sustainability' as ViewTab, label: 'Sustainability & ESG', icon: Leaf },
    { id: 'sensors' as ViewTab, label: 'IoT Sensor Directory', icon: Radio, badge: '248' },
    { id: 'analytics' as ViewTab, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as ViewTab, label: 'Reports & Audits', icon: FileText },
    { id: 'settings' as ViewTab, label: 'Settings', icon: Settings },
    { id: 'about' as ViewTab, label: 'About CITYOS', icon: Info },
  ];

  interface NavItem {
    id: ViewTab;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id);
              onClose();
            }}
            className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
              isActive
                ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
            }`}
          >
            {/* Subtle blue left indicator for selected item */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#2563EB]" />
            )}

            <div className="flex items-center gap-2.5 truncate pl-1">
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-[#64748B] group-hover:text-[#1E293B]'
              }`} />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                item.badgeColor || (isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#F1F5F9] text-[#64748B]')
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 h-screen lg:h-[calc(100vh-57px)] w-64 bg-[#FFFFFF] border-r border-[#E2E8F0] z-50 lg:z-20 flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2563EB] text-white font-black text-xs flex items-center justify-center">
              C
            </div>
            <span className="font-extrabold text-sm text-[#1E293B]">CITYOS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
          {/* Main Group */}
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1.5">
              Core Platform
            </div>
            {renderNavGroup(mainNavigation)}
          </div>

          {/* Subsystems Group */}
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1.5">
              Campus Subsystems
            </div>
            {renderNavGroup(subsystemNavigation)}
          </div>

          {/* Intelligence & Analytics */}
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1.5">
              AI &amp; Administration
            </div>
            {renderNavGroup(intelligenceNavigation)}
          </div>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <div>
                <div className="text-[11px] font-semibold text-[#1E293B]">System Nominal</div>
                <div className="text-[10px] text-[#64748B] font-mono">248/248 IoT Nodes</div>
              </div>
            </div>
            <span className="text-[10px] text-[#2563EB] font-bold font-mono">98.4%</span>
          </div>
        </div>
      </aside>
    </>
  );
};
