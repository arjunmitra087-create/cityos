import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  Search, 
  MapPin, 
  Menu, 
  X, 
  LogOut, 
  Check, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Alert } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenAiAssistant: () => void;
  onLogout: () => void;
  alerts: Alert[];
  onNavigateToTab?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenAiAssistant,
  onLogout,
  alerts,
  onNavigateToTab,
}) => {
  const [selectedCampus, setSelectedCampus] = useState('North Apex Campus (Main)');
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  const campusOptions = [
    'North Apex Campus (Main)',
    'South Innovation Park',
    'East Biotech Quad',
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 lg:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Left: Hamburger & Brand & Campus Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] lg:hidden transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Single element Brand wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[#1E293B] leading-none">
                CITY<span className="text-[#2563EB]">OS</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-medium tracking-wide leading-none mt-0.5 hidden sm:inline">
                Campus OS
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block" />

          {/* Campus Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-semibold text-[#1E293B] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedCampus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {showCampusDropdown && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#64748B] tracking-wider border-b border-[#E2E8F0] mb-1">
                  Active Monitored Campus
                </div>
                {campusOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCampus(c);
                      setShowCampusDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between transition-colors ${
                      c === selectedCampus ? 'text-[#2563EB] font-semibold bg-[#EFF6FF]' : 'text-[#1E293B]'
                    }`}
                  >
                    <span>{c}</span>
                    {c === selectedCampus && <Check className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search sensors, buildings, telemetry..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
            />
          </div>
        </div>

        {/* Right: AI Assistant, Notifications, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ask AI Trigger Button with subtle hover animation */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1E40AF] text-xs font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">Ask CITYOS AI</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#1E293B] relative transition-colors"
              aria-label="Campus Alerts Notifications"
            >
              <Bell className="w-4 h-4 text-[#64748B]" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                    Campus Telemetry Alerts ({activeAlerts.length})
                  </div>
                  {onNavigateToTab && (
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigateToTab('alerts');
                      }}
                      className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1E40AF]"
                    >
                      View All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {activeAlerts.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (onNavigateToTab) onNavigateToTab('alerts');
                      }}
                      className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] cursor-pointer text-xs transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase ${a.severity === 'critical' ? 'text-[#DC2626]' : 'text-[#F59E0B]'}`}>
                          {a.severity} · {a.category}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">{a.timestamp}</span>
                      </div>
                      <div className="text-[#1E293B] font-semibold line-clamp-1">{a.title}</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{a.buildingName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#E2E8F0]">
            <img
              src="/src/assets/images/avatar_admin_user_1790358837797.jpg"
              alt="Dr. Sarah Chen"
              className="w-8 h-8 rounded-lg object-cover border border-[#E2E8F0]"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#1E293B] leading-tight">
                Dr. Sarah Chen
              </div>
              <div className="text-[10px] text-[#64748B] leading-tight">
                Campus Director
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#F1F5F9] transition-colors ml-1"
              title="Logout to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
