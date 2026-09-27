import React, { useState, useEffect } from 'react';
import { ViewTab, Building, CampusKPIs, ActivityFeedItem, Alert, AiInsight, Sensor } from './types';
import { campusService } from './services/campusService';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewView } from './components/dashboard/OverviewView';
import { DigitalTwinView } from './components/digitaltwin/DigitalTwinView';
import { LiveMonitoringView } from './components/monitoring/LiveMonitoringView';
import { AiInsightsView } from './components/insights/AiInsightsView';
import { PredictionsView } from './components/predictions/PredictionsView';
import { AlertsView } from './components/alerts/AlertsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AnomalyDetectionView } from './components/anomalies/AnomalyDetectionView';
import { CampusHeatmapView } from './components/heatmaps/CampusHeatmapView';
import { SustainabilityView } from './components/sustainability/SustainabilityView';
import { SensorManagementView } from './components/sensors/SensorManagementView';
import { AboutView } from './components/about/AboutView';
import { AiAssistantModal } from './components/ai/AiAssistantModal';
import { BuildingDetailDrawer } from './components/common/BuildingDetailDrawer';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Reactive state from campusService
  const [buildings, setBuildings] = useState<Building[]>(campusService.getBuildings());
  const [kpis, setKpis] = useState<CampusKPIs>(campusService.getKPIs());
  const [activities, setActivities] = useState<ActivityFeedItem[]>(campusService.getActivities());
  const [alerts, setAlerts] = useState<Alert[]>(campusService.getAlerts());
  const [insights, setInsights] = useState<AiInsight[]>(campusService.getInsights());
  const [sensors, setSensors] = useState<Sensor[]>(campusService.getSensors());
  const [isSimulating, setIsSimulating] = useState<boolean>(campusService.isLiveSimulationActive());

  useEffect(() => {
    const unsubscribe = campusService.subscribe(() => {
      setBuildings(campusService.getBuildings());
      setKpis(campusService.getKPIs());
      setActivities(campusService.getActivities());
      setAlerts(campusService.getAlerts());
      setInsights(campusService.getInsights());
      setSensors(campusService.getSensors());
      setIsSimulating(campusService.isLiveSimulationActive());
    });
    return () => unsubscribe();
  }, []);

  const handleResolveAlert = (alertId: string) => {
    campusService.resolveAlert(alertId);
  };

  const handleApplyInsight = (insightId: string) => {
    campusService.applyInsightAction(insightId);
  };

  const handleToggleSimulation = () => {
    campusService.toggleSimulation();
  };

  const handleNavigateFromLanding = (targetTab?: string) => {
    if (targetTab) {
      setCurrentTab(targetTab as ViewTab);
    }
    setAppMode('dashboard');
  };

  // If in landing view
  if (appMode === 'landing') {
    return (
      <div className="relative">
        <LandingPage
          onEnterDashboard={handleNavigateFromLanding}
          onNavigateLogin={() => setAppMode('login')}
        />
        {/* Floating Ask AI Button also accessible from landing page */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer group"
          aria-label="Ask CITYOS AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs font-bold">Ask CITYOS AI</span>
        </button>
        <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      </div>
    );
  }

  // If in login view
  if (appMode === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => setAppMode('dashboard')}
        onBackToLanding={() => setAppMode('landing')}
      />
    );
  }

  // Active dashboard view renderer
  const renderDashboardContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewView
            buildings={buildings}
            kpis={kpis}
            activities={activities}
            alerts={alerts}
            insights={insights}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
          />
        );

      case 'digital-twin':
        return (
          <DigitalTwinView
            buildings={buildings}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        );

      case 'energy':
      case 'water':
      case 'waste':
      case 'crowd':
      case 'parking':
      case 'environment':
      case 'monitoring':
        return (
          <LiveMonitoringView
            sensors={sensors}
            buildings={buildings}
            initialCategory={currentTab}
          />
        );

      case 'insights':
        return (
          <AiInsightsView
            insights={insights}
            onApplyAction={handleApplyInsight}
          />
        );

      case 'predictions':
        return <PredictionsView />;

      case 'anomalies':
        return (
          <AnomalyDetectionView
            anomalies={campusService.getAnomalies()}
            onMitigate={(id) => campusService.mitigateAnomaly(id)}
          />
        );

      case 'heatmaps':
        return (
          <CampusHeatmapView
            buildings={buildings}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        );

      case 'sustainability':
        return (
          <SustainabilityView
            score={campusService.getSustainabilityScore()}
            buildings={buildings}
          />
        );

      case 'sensors':
        return (
          <SensorManagementView
            sensors={sensors}
            buildings={buildings}
          />
        );

      case 'alerts':
        return (
          <AlertsView
            alerts={alerts}
            buildings={buildings}
            onResolveAlert={handleResolveAlert}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        );

      case 'analytics':
        return <AnalyticsView buildings={buildings} />;

      case 'reports':
        return <ReportsView buildings={buildings} kpis={kpis} />;

      case 'settings':
        return <SettingsView />;

      case 'about':
        return <AboutView onNavigateToTab={(tab) => setCurrentTab(tab)} />;

      default:
        return (
          <OverviewView
            buildings={buildings}
            kpis={kpis}
            activities={activities}
            alerts={alerts}
            insights={insights}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
          />
        );
    }
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Top Navbar adhering to Top Bar contract */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onLogout={() => setAppMode('landing')}
        alerts={alerts}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeAlertsCount={activeAlertsCount}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto bg-[#F8FAFC]">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Floating Global AI Assistant Trigger */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
        aria-label="Open Ask CITYOS AI"
      >
        <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-xs font-bold">Ask CITYOS AI</span>
      </button>

      {/* AI Assistant Slide-over Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Global Building Telemetry Inspector Drawer */}
      <BuildingDetailDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
