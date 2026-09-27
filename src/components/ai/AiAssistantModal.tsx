import React, { useState, useRef, useEffect } from 'react';
import { campusService } from '../../services/campusService';
import { aiIntelligenceService, AiResponse, AiAction } from '../../services/aiIntelligenceService';
import { Building, ViewTab } from '../../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw,
  Zap,
  Droplet,
  Users,
  AlertTriangle,
  Flame,
  ArrowRight,
  Mic,
  MicOff,
  Building2,
  FileText,
  Sliders,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Radio,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: ViewTab) => void;
  onSelectBuilding?: (building: Building) => void;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  responseObj?: AiResponse;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToTab,
  onSelectBuilding,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [showQuickIntel, setShowQuickIntel] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Live campus state for context banner
  const [kpis, setKpis] = useState(campusService.getKPIs());
  const [alerts, setAlerts] = useState(campusService.getAlerts());
  const [anomalies, setAnomalies] = useState(campusService.getAnomalies());
  const [sensors, setSensors] = useState(campusService.getSensors());

  useEffect(() => {
    const unsub = campusService.subscribe(() => {
      setKpis(campusService.getKPIs());
      setAlerts(campusService.getAlerts());
      setAnomalies(campusService.getAnomalies());
      setSensors(campusService.getSensors());
    });
    return () => unsub();
  }, []);

  // Initialize conversation
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: "Welcome to **CITYOS AI**, your intelligent campus operations assistant.\n\nI monitor **248 edge telemetry streams**, analyze real-time resource loads, detect anomalies, and predict facility demands across North Apex Campus. How can I assist you with campus operations today?",
          timestamp: 'Just now',
          responseObj: {
            text: '',
            badges: [
              { label: 'Campus Status', value: 'Operational', status: 'nominal' },
              { label: 'IoT Mesh', value: '248 Online' },
              { label: 'Occupancy', value: `${kpis.crowd.peakOccupancyPct}%` },
            ],
            actions: [
              { label: "Summarize Campus Status", actionType: 'ask', prompt: "Summarize today's campus status", variant: 'primary' },
              { label: "Analyze Energy", actionType: 'ask', prompt: "Analyze today's energy consumption", variant: 'secondary' },
              { label: "Check Anomalies", actionType: 'ask', prompt: "Are there any abnormal sensor readings?", variant: 'outline' },
            ]
          }
        }
      ]);
    }
  }, []);

  // If initialPrompt is passed when opening
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Formulate response using deep campus AI intelligence service
    setTimeout(() => {
      const response = aiIntelligenceService.generateResponse(text);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        responseObj: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    aiIntelligenceService.resetContext();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: "Campus session context reset. What telemetry stream, facility, or forecast would you like to investigate?",
        timestamp: 'Just now',
        responseObj: {
          text: '',
          actions: [
            { label: "Summarize Campus Status", actionType: 'ask', prompt: "Summarize today's campus status", variant: 'primary' },
            { label: "Inspect High Power Demand", actionType: 'ask', prompt: "Which building is consuming the most electricity?", variant: 'secondary' },
          ]
        }
      },
    ]);
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechNotice("Speech recognition is unavailable in this browser environment. You can type directly in the input bar.");
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice("Listening for campus query...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
        setSpeechNotice(null);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechNotice("Voice recognition encountered an error. Please try again or type.");
        setTimeout(() => setSpeechNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechNotice(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechNotice("Unable to start microphone.");
      setTimeout(() => setSpeechNotice(null), 3000);
    }
  };

  const executeAction = (action: AiAction) => {
    if (action.actionType === 'navigate' && action.targetTab && onNavigateToTab) {
      onNavigateToTab(action.targetTab);
      onClose();
    } else if (action.actionType === 'inspect-building' && action.buildingId) {
      const b = campusService.getBuildingById(action.buildingId);
      if (b && onSelectBuilding) {
        onSelectBuilding(b);
        onClose();
      } else if (onNavigateToTab) {
        onNavigateToTab('digital-twin');
        onClose();
      }
    } else if (action.actionType === 'ask' && action.prompt) {
      handleSend(action.prompt);
    }
  };

  const copyReport = (report: any, id: string) => {
    const textToCopy = `CITYOS CAMPUS REPORT: ${report.title}\nDate: ${report.date}\n\nSUMMARY:\n${report.summary}\n\nKEY METRICS:\n${report.keyMetrics.map((m: any) => `• ${m.label}: ${m.value} (${m.status})`).join('\n')}\n\nPROBLEMS DETECTED:\n${report.problemsDetected.map((p: any) => `• ${p}`).join('\n')}\n\nRECOMMENDATIONS:\n${report.recommendations.map((r: any) => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedReportId(id);
    setTimeout(() => setCopiedReportId(null), 2500);
  };

  const suggestedActionCards = [
    { label: "Analyze today's energy consumption", query: "Analyze today's energy consumption" },
    { label: "Are there any abnormal sensor readings?", query: "Are there any abnormal sensor readings?" },
    { label: "Why is the AQI showing a warning?", query: "Why is the AQI showing a warning?" },
    { label: "Summarize today's campus status", query: "Summarize today's campus status" },
    { label: "Which systems need attention?", query: "Which systems need attention?" },
    { label: "Predict tomorrow's water demand", query: "Predict tomorrow's water demand" },
    { label: "Show me the latest alerts", query: "Show me the latest alerts" },
    { label: "Compare today's electricity usage with yesterday", query: "Compare today's electricity usage with yesterday" },
  ];

  const quickIntelCards = [
    { id: 'energy', label: 'Energy Analysis', icon: Zap, prompt: "Analyze current campus energy consumption, solar generation, and high-load facilities." },
    { id: 'water', label: 'Water Analysis', icon: Droplet, prompt: "Analyze water network ingress flow, pressure distribution, and conservation efficiency." },
    { id: 'env', label: 'Environmental Analysis', icon: Flame, prompt: "Analyze campus microclimate, air quality index, and quad ambient temperatures." },
    { id: 'crowd', label: 'Occupancy Analysis', icon: Users, prompt: "Analyze current campus population density, turnstile counts, and facility capacity." },
    { id: 'alerts', label: 'Alert Analysis', icon: AlertTriangle, prompt: "Which systems currently need attention? Explain all active warnings and critical alerts." },
    { id: 'pred', label: 'Predictions', icon: TrendingUp, prompt: "Predict tomorrow's electricity demand, water consumption, and peak crowd hours." },
    { id: 'twin', label: 'Digital Twin', icon: Building2, prompt: "Summarize the 3D Digital Twin model and list building operational metrics." },
  ];

  const reportTypes = [
    { label: "Daily Operations Report", prompt: "Generate daily operations report" },
    { label: "Energy Management Report", prompt: "Generate energy report" },
    { label: "Water & Hydraulic Report", prompt: "Generate water report" },
    { label: "Environmental & Air Quality Report", prompt: "Generate environmental report" },
    { label: "Active Incident & Alert Report", prompt: "Generate alert report" },
    { label: "Sustainability & ESG Report", prompt: "Generate sustainability report" },
  ];

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const activeAnomaliesCount = anomalies.filter(a => a.status === 'active').length;
  const onlineSensorsCount = sensors.filter(s => s.status === 'online').length;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] md:w-[560px] lg:w-[600px] bg-[#FFFFFF] border-l border-[#E2E8F0] z-50 flex flex-col shadow-2xl transition-all">
      {/* 1. Header (PART 2 Specification) */}
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FFFFFF] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#2563EB] text-white shadow-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1E293B] leading-none">
                CITYOS AI
              </h2>
              {/* Online status indicator */}
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                AI Online
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Your intelligent campus operations assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors"
            title="Reset Context Memory"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Contextual Campus Status Banner (PART 2 Specification) */}
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5 font-medium">
          <span className="font-semibold text-[#1E293B] uppercase tracking-wider text-[10px]">
            Live Campus Context
          </span>
          <span className="text-[#2563EB] font-mono flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#2563EB] animate-pulse" />
            Telemetry Stream Active
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B]">Sensors</div>
            <div className="font-bold text-[#1E293B] font-mono">{onlineSensorsCount} Online</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B]">Active Alerts</div>
            <div className={`font-bold font-mono ${activeAlertsCount > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
              {activeAlertsCount} Active
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B]">Anomalies</div>
            <div className="font-bold text-[#F59E0B] font-mono">{activeAnomaliesCount} Detected</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B]">Occupancy</div>
            <div className="font-bold text-[#2563EB] font-mono">{kpis.crowd.peakOccupancyPct}%</div>
          </div>
        </div>
      </div>

      {/* 3. Quick Intelligence & Reports Toggle Bar */}
      <div className="px-4 py-2 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowQuickIntel(!showQuickIntel);
              setShowReportsMenu(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showQuickIntel ? 'bg-blue-50 border-blue-200 text-[#2563EB]' : 'border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Quick Intelligence</span>
          </button>

          <button
            onClick={() => {
              setShowReportsMenu(!showReportsMenu);
              setShowQuickIntel(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showReportsMenu ? 'bg-blue-50 border-blue-200 text-[#2563EB]' : 'border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>

        <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
          Context-Aware Engine
        </span>
      </div>

      {/* Quick Intelligence Drawer Menu */}
      {showQuickIntel && (
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0 animate-in fade-in duration-150">
          {quickIntelCards.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setShowQuickIntel(false);
                  handleSend(item.prompt);
                }}
                className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-blue-50/40 text-left transition-all flex items-center gap-2 cursor-pointer shadow-2xs group"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#1E293B] group-hover:text-[#2563EB]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Reports Dropdown Menu */}
      {showReportsMenu && (
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0 animate-in fade-in duration-150">
          {reportTypes.map((rep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setShowReportsMenu(false);
                handleSend(rep.prompt);
              }}
              className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-blue-50/40 text-left transition-all flex items-center justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#1E293B]">{rep.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          ))}
        </div>
      )}

      {/* 4. Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const resp = msg.responseObj;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#1E293B] shadow-2xs'
                    : 'bg-[#EFF6FF]/70 border border-[#BFDBFE] text-[#1E293B] shadow-xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-[11px] font-medium border-b pb-2 mb-2 border-[#E2E8F0]">
                  <span className={`font-bold flex items-center gap-1.5 ${isUser ? 'text-[#1E293B]' : 'text-[#2563EB]'}`}>
                    {isUser ? 'Campus Administrator' : 'CITYOS Intelligence'}
                  </span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">{msg.timestamp}</span>
                </div>

                {/* Primary text output formatted */}
                <div className="whitespace-pre-line text-xs font-normal text-[#1E293B] leading-relaxed">
                  {msg.text}
                </div>

                {/* Metric Badges if present (PART 12) */}
                {resp?.badges && resp.badges.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {resp.badges.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs"
                      >
                        <div className="text-[10px] text-[#64748B] font-medium truncate">{b.label}</div>
                        <div className={`text-sm font-bold font-mono mt-0.5 ${
                          b.status === 'critical' ? 'text-[#DC2626]' : b.status === 'warning' ? 'text-[#F59E0B]' : 'text-[#1E293B]'
                        }`}>
                          {b.value}
                        </div>
                        {b.subtext && (
                          <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">{b.subtext}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Anomaly Detected Card if present (PART 5) */}
                {resp?.anomaly && (
                  <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-amber-300 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#B45309]">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        Anomaly Detected
                      </span>
                      <span className="bg-amber-100 text-[#B45309] px-2 py-0.5 rounded">
                        {resp.anomaly.difference}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#1E293B]">
                      {resp.anomaly.title}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div>
                        <span className="text-[#64748B] block text-[10px] font-sans">Current Reading:</span>
                        <span className="font-bold text-[#DC2626]">{resp.anomaly.current}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[10px] font-sans">Expected Range:</span>
                        <span className="font-bold text-[#1E293B]">{resp.anomaly.expected}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#64748B]">
                      <strong className="text-[#1E293B]">Possible Cause:</strong> {resp.anomaly.possibleCause}
                    </div>

                    <div className="text-[11px] text-[#16A34A] bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <strong>Recommended Action:</strong> {resp.anomaly.recommendedAction}
                    </div>
                  </div>
                )}

                {/* Prediction Details Card if present (PART 6) */}
                {resp?.prediction && (
                  <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-blue-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Neural Forecast
                      </span>
                      <span className="bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded border border-blue-200 font-mono">
                        Conf: {resp.prediction.confidence}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#1E293B]">
                      {resp.prediction.title}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div>
                        <span className="text-[#64748B] block text-[10px] font-sans">Expected Value:</span>
                        <span className="font-bold text-[#2563EB]">{resp.prediction.expected}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[10px] font-sans">Expected Range:</span>
                        <span className="font-bold text-[#1E293B]">{resp.prediction.expectedRange}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#64748B]">
                      <strong className="text-[#1E293B]">Trend:</strong> {resp.prediction.trend}
                    </div>
                    <div className="text-[11px] text-[#64748B] leading-relaxed">
                      {resp.prediction.explanation}
                    </div>
                  </div>
                )}

                {/* Comparison Table if present */}
                {resp?.table && (
                  <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-[#FFFFFF]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                        <tr>
                          {resp.table.headers.map((h, i) => (
                            <th key={i} className="p-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] font-mono">
                        {resp.table.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-[#F8FAFC]">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 font-sans">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Campus Report Presentation if present (PART 15) */}
                {resp?.report && (
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-[#1E293B]">{resp.report.title}</h4>
                        <span className="text-[10px] text-[#64748B] font-mono">{resp.report.date}</span>
                      </div>
                      <button
                        onClick={() => copyReport(resp.report, msg.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[11px] font-medium text-[#2563EB] hover:bg-blue-50 flex items-center gap-1 transition-colors"
                      >
                        {copiedReportId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#16A34A]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Report</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#1E293B] leading-relaxed">
                      <strong className="block text-[10px] uppercase text-[#64748B] font-bold mb-0.5">Executive Summary:</strong>
                      {resp.report.summary}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {resp.report.keyMetrics.map((km, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                          <span className="text-[10px] text-[#64748B] block truncate">{km.label}</span>
                          <span className="font-bold text-[#1E293B] font-mono">{km.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Problems Detected */}
                    <div>
                      <span className="block text-[10px] uppercase text-[#DC2626] font-bold mb-1">Operational Issues Detected:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#64748B]">
                        {resp.report.problemsDetected.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <span className="block text-[10px] uppercase text-[#16A34A] font-bold mb-1">AI Directives:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#1E293B]">
                        {resp.report.recommendations.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Interactive Action Buttons (PART 11) */}
                {resp?.actions && resp.actions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0]/80">
                    {resp.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeAction(act)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                          act.variant === 'primary'
                            ? 'bg-[#2563EB] hover:bg-[#1E40AF] text-white'
                            : act.variant === 'secondary'
                            ? 'bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] text-[#2563EB] hover:bg-blue-50'
                            : 'bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B]'
                        }`}
                      >
                        <span>{act.label}</span>
                        {act.actionType === 'navigate' || act.actionType === 'inspect-building' ? (
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        ) : (
                          <ArrowRight className="w-3 h-3 opacity-80" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#E2E8F0] text-[#1E293B] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] p-3 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] w-fit shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#2563EB] animate-spin" />
            <span>CITYOS Neural Model evaluating campus telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Clickable Suggested Questions Chips (PART 2 Specification) */}
      <div className="p-3 bg-[#FFFFFF] border-t border-[#E2E8F0] shrink-0">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-[#64748B] mb-2">
          <span>Recommended Operational Queries</span>
          <span className="text-[#94A3B8]">Click to ask</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedActionCards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(card.query)}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 text-[11px] text-[#1E293B] hover:text-[#2563EB] whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer font-medium"
            >
              <span>{card.label}</span>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
            </button>
          ))}
        </div>
      </div>

      {/* 6. Input Form (PART 13 Specification) */}
      <div className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-[#FFFFFF] shrink-0 space-y-2">
        {speechNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#2563EB] flex items-center justify-between animate-in fade-in">
            <span className="font-medium">{speechNotice}</span>
            <button
              type="button"
              onClick={() => setSpeechNotice(null)}
              className="text-[#64748B] hover:text-[#1E293B] ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-50 border-rose-300 text-[#DC2626] animate-pulse'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
            }`}
            title={isListening ? "Listening... click to stop" : "Voice input query"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask CITYOS AI about electricity, water, anomalies, predictions..."
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] disabled:opacity-40 disabled:hover:bg-[#2563EB] text-white transition-colors shrink-0 shadow-sm cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
