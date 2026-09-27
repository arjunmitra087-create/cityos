import { campusService } from './campusService';
import { Building, Alert, AnomalyItem, ViewTab } from '../types';

export interface AiAction {
  label: string;
  actionType: 'navigate' | 'inspect-building' | 'ask';
  targetTab?: ViewTab;
  buildingId?: string;
  prompt?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface MetricBadge {
  label: string;
  value: string;
  subtext?: string;
  difference?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'nominal' | 'warning' | 'critical';
}

export interface AnomalyCardData {
  title: string;
  sensor: string;
  current: string;
  expected: string;
  difference: string;
  possibleCause: string;
  recommendedAction: string;
  targetTab?: ViewTab;
}

export interface PredictionCardData {
  title: string;
  expected: string;
  expectedRange: string;
  trend: string;
  confidence: string;
  explanation: string;
  targetTab?: ViewTab;
}

export interface CampusReportData {
  title: string;
  date: string;
  summary: string;
  keyMetrics: { label: string; value: string; status: string }[];
  problemsDetected: string[];
  trends: string[];
  recommendations: string[];
}

export interface AiResponse {
  text: string;
  badges?: MetricBadge[];
  anomaly?: AnomalyCardData;
  prediction?: PredictionCardData;
  report?: CampusReportData;
  actions?: AiAction[];
  table?: { headers: string[]; rows: (string | number)[][] };
}

interface SessionContext {
  lastTopic: 'energy' | 'water' | 'crowd' | 'environment' | 'aqi' | 'temperature' | 'alerts' | 'anomalies' | 'predictions' | 'waste' | 'parking' | 'summary' | 'building' | 'digital-twin' | null;
  lastBuilding: Building | null;
  lastMetric: string | null;
  lastAlert: Alert | null;
  lastAnomaly: AnomalyItem | null;
  history: { query: string; timestamp: Date }[];
}

class AiIntelligenceService {
  private context: SessionContext = {
    lastTopic: null,
    lastBuilding: null,
    lastMetric: null,
    lastAlert: null,
    lastAnomaly: null,
    history: [],
  };

  public resetContext(): void {
    this.context = {
      lastTopic: null,
      lastBuilding: null,
      lastMetric: null,
      lastAlert: null,
      lastAnomaly: null,
      history: [],
    };
  }

  public getContext(): SessionContext {
    return { ...this.context };
  }

  public generateResponse(query: string): AiResponse {
    const raw = query.trim();
    const q = raw.toLowerCase();
    this.context.history.push({ query: raw, timestamp: new Date() });

    // Retrieve fresh live campus state
    const kpis = campusService.getKPIs();
    const buildings = campusService.getBuildings();
    const alerts = campusService.getAlerts();
    const anomalies = campusService.getAnomalies();
    const sensors = campusService.getSensors();
    const predictions = campusService.getPredictions();
    const health = campusService.getCampusHealth();
    const sustainability = campusService.getSustainabilityScore();
    const activeAlerts = alerts.filter(a => a.status === 'active');
    const onlineSensors = sensors.filter(s => s.status === 'online').length;

    // --- CONVERSATIONAL FOLLOW-UP RESOLUTION (AI MEMORY) ---
    // User says "Is that high?", "Is that normal?", "Why is it high?"
    if (
      (q.includes('is that') || q.includes('is this') || q.includes('why is it') || q.includes('is it normal')) &&
      this.context.lastTopic
    ) {
      if (this.context.lastTopic === 'energy') {
        const cur = kpis.energy.currentKwh;
        const avg = 168.4;
        const diffPct = Math.round(((cur - avg) / avg) * 1000) / 10;
        return {
          text: `Current active electricity demand (**${cur} kWh**) is **+${diffPct}% above today's baseline average** of 168.4 kWh.\n\nWhile currently below the critical 215 kWh ceiling, it represents an elevated diurnal curve caused by concurrent chiller cycle staging and GPU laboratory compute loads in Computer Science Block B.`,
          badges: [
            { label: 'Current Demand', value: `${cur} kWh`, status: cur > 200 ? 'warning' : 'nominal' },
            { label: "Today's Average", value: `${avg} kWh` },
            { label: 'Variance', value: `+${diffPct}%`, trend: 'up' },
          ],
          actions: [
            { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
            { label: 'Inspect Block B', actionType: 'inspect-building', buildingId: 'b-cs', variant: 'outline' },
          ],
        };
      }

      if (this.context.lastTopic === 'water') {
        return {
          text: `Current water ingress flow is **${kpis.water.currentLpm} L/min** against an expected baseline of 440 L/min (-4.5%).\n\nOverall campus volume is nominal, but **Hostel Block A** has an active riser pressure anomaly (18.2 PSI vs 54 PSI nominal) requiring attention.`,
          badges: [
            { label: 'Ingress Flow', value: `${kpis.water.currentLpm} L/min`, status: 'nominal' },
            { label: 'Hostel A Pressure', value: '18.2 PSI', status: 'critical', subtext: 'Threshold: 45 PSI' },
          ],
          actions: [
            { label: 'View Water Network', actionType: 'navigate', targetTab: 'water', variant: 'primary' },
            { label: 'Inspect Hostel A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'outline' },
          ],
        };
      }

      if (this.context.lastTopic === 'aqi' || this.context.lastTopic === 'environment') {
        return {
          text: `Yes, **${kpis.environment.aqi} AQI** is elevated above the preferred healthy campus baseline of 50–65 AQI. The system flags anything over 70 AQI as a **Warning** to protect student health.`,
          badges: [
            { label: 'Current AQI', value: `${kpis.environment.aqi} AQI`, status: 'warning' },
            { label: 'Nominal Ceiling', value: '65 AQI' },
          ],
          actions: [
            { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'primary' },
            { label: 'View Anomaly Trace', actionType: 'navigate', targetTab: 'anomalies', variant: 'outline' },
          ],
        };
      }
    }

    // Follow-up: "Compare it with yesterday" or "Compare with yesterday"
    if (
      (q.includes('compare') && (q.includes('yesterday') || q.includes('last week') || q.includes('previous'))) &&
      (this.context.lastTopic === 'energy' || !this.context.lastTopic)
    ) {
      this.context.lastTopic = 'energy';
      return {
        text: `**Electricity Consumption Comparison:**\n• **Today's demand:** ~${kpis.energy.currentKwh} kWh active (~2,840 kWh projected day total)\n• **Yesterday at this hour:** 198.2 kWh (Total: 3,100 kWh)\n• **Net variance:** **-8.4% reduction** compared to yesterday's peak, primarily resulting from intelligent HVAC pre-cooling applied at 06:00.`,
        badges: [
          { label: 'Today (Live)', value: `${kpis.energy.currentKwh} kWh` },
          { label: 'Yesterday', value: '198.2 kWh' },
          { label: 'Daily Delta', value: '-8.4%', trend: 'down', status: 'nominal' },
        ],
        table: {
          headers: ['Metric', 'Today', 'Yesterday', 'Delta'],
          rows: [
            ['Active Demand', `${kpis.energy.currentKwh} kWh`, '198.2 kWh', '-6.8%'],
            ['Peak Load', '218.0 kWh', '234.5 kWh', '-7.0%'],
            ['Solar Generation', '138 kW', '124 kW', '+11.2%'],
          ],
        },
        actions: [
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
          { label: 'View Analytics', actionType: 'navigate', targetTab: 'analytics', variant: 'secondary' },
        ],
      };
    }

    // --- 1. CAMPUS STATUS SUMMARY (PART 8) ---
    if (
      q.includes('summary') ||
      q.includes('campus status') ||
      q.includes('overview') ||
      q.includes('how is the campus') ||
      q.includes("today's status")
    ) {
      this.context.lastTopic = 'summary';
      const warningCount = activeAlerts.filter(a => a.severity === 'warning').length;
      const critCount = activeAlerts.filter(a => a.severity === 'critical').length;

      return {
        text: `**CAMPUS STATUS SUMMARY**\n─────────────\n• **Overall State**: **Operational** (Campus Health Score: ${health.overall}/100)\n• **Energy Grid**: **Nominal** (${kpis.energy.currentKwh} kWh, -8.4% vs monthly median)\n• **Water Network**: **Normal** (${kpis.water.currentLpm} L/min, greywater recycling active)\n• **Environment**: **${warningCount + 1} Warnings** (AQI: ${kpis.environment.aqi}, Ambient Temp: ${kpis.environment.temperature}°C)\n• **Occupancy**: **${kpis.crowd.peakOccupancyPct}%** (${kpis.crowd.currentPopulation} campus population)\n• **Active Alerts**: **${activeAlerts.length}** (${critCount} critical, ${warningCount} warning)\n• **Potential Anomalies**: **${anomalies.filter(a => a.status === 'active').length}** detected\n\n**Priority areas requiring attention:**\n1. 🔴 **Hostel Block A**: Water riser line pressure drop to 18.2 PSI.\n2. 🟡 **Air Quality Index**: Zone B Quad outdoor particulate level (77 AQI).\n3. 🟡 **Computer Engineering Block B**: HVAC power spike (+23.4% above diurnal baseline).`,
        badges: [
          { label: 'Campus Health', value: `${health.overall}/100`, status: 'nominal' },
          { label: 'Occupancy', value: `${kpis.crowd.peakOccupancyPct}%`, subtext: `${kpis.crowd.currentPopulation} headcount` },
          { label: 'Active Alerts', value: `${activeAlerts.length}`, status: critCount > 0 ? 'critical' : 'warning' },
          { label: 'Online Sensors', value: `${onlineSensors} / 248` },
        ],
        actions: [
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'primary' },
          { label: 'View Latest Alerts', actionType: 'navigate', targetTab: 'alerts', variant: 'secondary' },
          { label: 'Inspect Hostel A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'outline' },
        ],
      };
    }

    // --- 2. CURRENT ELECTRICITY DEMAND ---
    if (
      q.includes('current electricity') ||
      q.includes('current energy') ||
      q.includes('power demand') ||
      q.includes('active electricity') ||
      q.includes('electricity demand')
    ) {
      this.context.lastTopic = 'energy';
      const cur = kpis.energy.currentKwh;
      const statusStr = cur > 210 ? 'Warning' : 'Nominal';
      return {
        text: `Current active electricity demand is **${cur} kWh**.\nThe current status is **${statusStr}**.\nToday's baseline average is **168.4 kWh** and the diurnal peak is **218.0 kWh**.`,
        badges: [
          { label: 'Active Demand', value: `${cur} kWh`, status: cur > 210 ? 'warning' : 'nominal' },
          { label: "Today's Average", value: '168.4 kWh' },
          { label: "Today's Peak", value: '218.0 kWh' },
          { label: 'Difference', value: '+9.6%', trend: 'up' },
        ],
        actions: [
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
          { label: 'Compare Yesterday', actionType: 'ask', prompt: 'Compare today electricity usage with yesterday', variant: 'secondary' },
          { label: 'Which Building Uses Most?', actionType: 'ask', prompt: 'Which building is consuming the most electricity?', variant: 'outline' },
        ],
      };
    }

    // --- 3. ABNORMALITY & SENSOR AUDIT ---
    if (
      q.includes('abnormal') ||
      q.includes('anything abnormal') ||
      q.includes('unusual') ||
      q.includes('anomaly') ||
      q.includes('anomalies') ||
      q.includes('sensor reading')
    ) {
      this.context.lastTopic = 'anomalies';
      const activeAnoms = anomalies.filter(a => a.status === 'active');
      return {
        text: `**${activeAnoms.length} potential anomalies detected** across the IoT edge mesh:\n\n• **Air Quality Index — Zone B Quad**: **${kpis.environment.aqi} AQI**\n  Status: **Warning** (Expected: 45–65 AQI, +${Math.round(((kpis.environment.aqi - 65) / 65) * 100)}% deviation). Outdoor sensor indicates localized particulate spike.\n\n• **Campus Ambient Temperature**: **${kpis.environment.temperature}°C**\n  Status: **Warning** (Expected: 21–25°C). Solar heat gain elevated on South Facade.\n\n• **Hostel Block A Water Pressure**: **18.2 PSI**\n  Status: **Critical** (Expected: 50–55 PSI, -64% drop). Possible pipe cavitation or pump valve fault.`,
        anomaly: {
          title: 'Air Quality Index — Zone B Quad',
          sensor: 'AQI Micro-optical Node #AQ-042',
          current: `${kpis.environment.aqi} AQI`,
          expected: '45–65 AQI',
          difference: '+18.4%',
          possibleCause: 'Localized quad gathering near loading dock or reduced natural air dispersion.',
          recommendedAction: 'Inspect ventilation intakes and air handlers in adjacent academic blocks.',
          targetTab: 'environment',
        },
        actions: [
          { label: 'Investigate Anomalies', actionType: 'navigate', targetTab: 'anomalies', variant: 'primary' },
          { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'secondary' },
          { label: 'Inspect Hostel A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'outline' },
        ],
      };
    }

    // --- 4. WHY IS AQI SHOWING A WARNING? (PART 9 ALERT EXPLANATION) ---
    if (
      q.includes('aqi') ||
      q.includes('air quality') ||
      (q.includes('warning') && (q.includes('environment') || q.includes('air')))
    ) {
      this.context.lastTopic = 'aqi';
      return {
        text: `**Air Quality Warning Explanation:**\n\n• **What Happened**: AQI is currently reading **${kpis.environment.aqi} AQI** (Nominal threshold: < 65 AQI).\n• **Sensor Generating Alert**: IoT Environmental Pod #AQ-042 (Zone B Quad).\n• **Deviation Significance**: **+18.4% above baseline**, placing Zone B into the moderate advisory bracket.\n• **Possible Contributing Factors**: Increased pedestrian density in Central Quad, coupled with delivery vans near the catering dock and low ambient wind velocity (1.8 m/s).\n• **Recommended Next Step**: Increase outdoor air exchange filtration in Central Library and dispatch quad patrol to verify no idling logistics vehicles.`,
        badges: [
          { label: 'Current AQI', value: `${kpis.environment.aqi} AQI`, status: 'warning' },
          { label: 'Normal Envelope', value: '45–65 AQI' },
          { label: 'Quad Headcount', value: '380 students' },
        ],
        actions: [
          { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'primary' },
          { label: 'View Alert Center', actionType: 'navigate', targetTab: 'alerts', variant: 'secondary' },
        ],
      };
    }

    // --- 5. WHICH SYSTEMS NEED ATTENTION? / ALERTS ---
    if (
      q.includes('attention') ||
      q.includes('need attention') ||
      q.includes('priority') ||
      q.includes('latest alert') ||
      q.includes('show alerts') ||
      q.includes('explain alert')
    ) {
      this.context.lastTopic = 'alerts';
      const crit = activeAlerts.find(a => a.severity === 'critical') || alerts[0];
      return {
        text: `**${activeAlerts.length} systems currently require operational attention:**\n\n1. 🔴 **CRITICAL: ${crit.title}**\n   • **Location**: ${crit.buildingName}\n   • **Reading**: ${crit.currentValue || '18.2 PSI'} (Nominal: ${crit.expectedValue || '54 PSI'})\n   • **Possible Cause**: Supply valve cavitation or localized pressure joint rupture.\n   • **Action**: Dispatch plumbing technician to Basement Manifold B-01.\n\n2. 🟡 **WARNING: High Power Draw Spike**\n   • **Location**: Computer Engineering Block B\n   • **Reading**: 42.0 kWh (+23.4% above baseline)\n   • **Action**: Re-stage Chiller Loop #2 to Eco Setpoint.\n\n3. 🟡 **WARNING: Microclimate AQI Elevation**\n   • **Location**: Zone B Quad (77 AQI vs 65 ceiling).`,
        badges: [
          { label: 'Active Alerts', value: `${activeAlerts.length}`, status: 'critical' },
          { label: 'Critical Items', value: `${activeAlerts.filter(a => a.severity === 'critical').length}`, status: 'critical' },
          { label: 'Warning Items', value: `${activeAlerts.filter(a => a.severity === 'warning').length}`, status: 'warning' },
        ],
        actions: [
          { label: 'View Incident Alerts', actionType: 'navigate', targetTab: 'alerts', variant: 'primary' },
          { label: 'Inspect Hostel A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'secondary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'outline' },
        ],
      };
    }

    // --- 6. PREDICTIONS (ELECTRICITY, WATER, CROWD) ---
    if (
      q.includes('predict') ||
      q.includes('forecast') ||
      q.includes('tomorrow') ||
      q.includes('projection')
    ) {
      this.context.lastTopic = 'predictions';
      if (q.includes('water')) {
        return {
          text: `**PREDICTED WATER DEMAND (NEXT 24 HOURS)**\n\n• **Projected Consumption**: **8,650 Liters/day**\n• **Expected Flow Rate Range**: **380 – 490 L/min**\n• **Trend**: **↓ -5.2% Decreasing**\n• **Confidence**: **91% (High)**\n\n**Predictive Rationale**: Greywater buffer cycling and thermal cooling load reductions in evening hours will curb hydraulic demand across academic blocks.`,
          prediction: {
            title: 'Campus Ingress Hydraulic Forecast',
            expected: '~415 L/min',
            expectedRange: '380–490 L/min',
            trend: '↓ Decreasing (-5.2%)',
            confidence: 'High (91%)',
            explanation: 'Based on diurnal class dismissal timetables and automated greywater recycling schedules.',
            targetTab: 'predictions',
          },
          actions: [
            { label: 'View Prediction Details', actionType: 'navigate', targetTab: 'predictions', variant: 'primary' },
            { label: 'View Water Network', actionType: 'navigate', targetTab: 'water', variant: 'secondary' },
          ],
        };
      }

      if (q.includes('crowd') || q.includes('population') || q.includes('occupancy')) {
        const peak = kpis.crowd.peakOccupancyPct;
        return {
          text: `**PREDICTED CAMPUS CROWD & OCCUPANCY**\n\n• **Projected Peak**: **~${peak}% (~2,650 attendees)**\n• **Peak Interval**: **12:15 PM – 1:30 PM**\n• **Trend**: **↑ Increasing through mid-day**\n• **Confidence**: **94% (Very High)**\n\n**Contributing Factors**: 8 concurrent lectures scheduled in Block A & B, plus lunchtime congregation at Student Dining Canteen.`,
          prediction: {
            title: 'Diurnal Campus Population Profile',
            expected: '2,650 Headcount',
            expectedRange: '2,400–2,800 Attendees',
            trend: '↑ Peak at 12:45 PM',
            confidence: 'Very High (94%)',
            explanation: 'Correlated with lecture timetables, turnstile ingress logs, and Wi-Fi probe density.',
            targetTab: 'predictions',
          },
          actions: [
            { label: 'View Predictions', actionType: 'navigate', targetTab: 'predictions', variant: 'primary' },
            { label: 'Crowd & Density Map', actionType: 'navigate', targetTab: 'crowd', variant: 'secondary' },
          ],
        };
      }

      // Default to Electricity Prediction
      return {
        text: `**PREDICTED ELECTRICITY DEMAND**\n\n• **Expected Load**: **~192.4 kWh**\n• **Expected Range**: **180 – 205 kWh**\n• **Trend**: **↑ Increasing (+4.2%)**\n• **Confidence**: **Moderate (88%)**\n\n**Prediction Rationale**: Ambient temperatures are modeled to reach 30°C between 13:00 and 15:00, prompting automated chiller ramp-ups across academic wings.`,
        prediction: {
          title: 'Tomorrow Diurnal Energy Load',
          expected: '~192.4 kWh',
          expectedRange: '180–205 kWh',
          trend: '↑ Increasing (+4.2%)',
          confidence: 'Moderate (88%)',
          explanation: 'Weather forecast model predicts +3.2°C ambient rise, elevating secondary cooling chiller power.',
          targetTab: 'predictions',
        },
        actions: [
          { label: 'View Prediction Details', actionType: 'navigate', targetTab: 'predictions', variant: 'primary' },
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'secondary' },
        ],
      };
    }

    // --- 7. WHICH BUILDING IS CONSUMING THE MOST ELECTRICITY? (DIGITAL TWIN INTEGRATION) ---
    if (
      q.includes('most electricity') ||
      q.includes('highest electricity') ||
      q.includes('highest energy') ||
      q.includes('consuming the most') ||
      q.includes('highest demand')
    ) {
      this.context.lastTopic = 'building';
      const sorted = [...buildings].sort((a, b) => b.energyUsage - a.energyUsage);
      const top = sorted[0];
      this.context.lastBuilding = top;

      return {
        text: `**${top.name}** currently has the highest electricity demand on campus at **${top.energyUsage} kWh**.\n\n• **Status**: ${top.status.toUpperCase()}\n• **Occupancy**: ${top.occupancy}% (${top.headcount} occupants)\n• **Active Spikes**: Chilled water pump #2 and Informatics server rack load represent 42% of the facility's total draw.`,
        badges: [
          { label: top.name, value: `${top.energyUsage} kWh`, status: 'warning' },
          { label: 'Baseline', value: '34.1 kWh' },
          { label: 'Spike', value: '+23.4%', trend: 'up' },
        ],
        actions: [
          { label: `Open ${top.shortName}`, actionType: 'inspect-building', buildingId: top.id, variant: 'primary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'secondary' },
          { label: 'View Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'outline' },
        ],
      };
    }

    // --- 8. WHICH SYSTEMS ARE IN WARNING STATE? ---
    if (
      q.includes('warning state') ||
      q.includes('in warning') ||
      q.includes('show warnings') ||
      q.includes('systems in warning')
    ) {
      this.context.lastTopic = 'alerts';
      const warningBuildings = buildings.filter(b => b.status === 'warning');
      return {
        text: `**3 campus subsystems are currently operating in Warning state:**\n\n1. 🟡 **Environmental Air Quality (Zone B)**: 77 AQI (Threshold 65 AQI max)\n2. 🟡 **HVAC & Power in ${warningBuildings[0]?.name || 'Computer Science Block B'}**: 42.0 kWh (+23.4% baseline variance)\n3. 🟡 **Ambient Quad Temperature**: 29.4°C on South Quad courtyard sensor array`,
        table: {
          headers: ['Subsystem', 'Current Reading', 'Nominal Envelope', 'Status'],
          rows: [
            ['Zone B Air Quality', '77 AQI', '45–65 AQI', 'Warning'],
            ['Block B Power Draw', '42.0 kWh', '30–35 kWh', 'Warning'],
            ['Quad Ambient Temp', '29.4°C', '21–25°C', 'Warning'],
          ],
        },
        actions: [
          { label: 'View Alert Center', actionType: 'navigate', targetTab: 'alerts', variant: 'primary' },
          { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'secondary' },
        ],
      };
    }

    // --- 9. HOW HAS OCCUPANCY CHANGED TODAY? ---
    if (
      q.includes('occupancy') ||
      q.includes('crowd') ||
      q.includes('headcount') ||
      q.includes('population')
    ) {
      this.context.lastTopic = 'crowd';
      return {
        text: `**Campus Occupancy Dynamics:**\n• **Current Occupancy**: **${kpis.crowd.peakOccupancyPct}%** (~${kpis.crowd.currentPopulation} active occupants across 12 facilities).\n• **Morning Baseline (08:00)**: 28% (780 attendees)\n• **Mid-day Peak (12:30)**: 86% (2,410 attendees)\n• **Current Status**: **Nominal**, transitioning toward afternoon seminar distribution.\n• **Dense Hotspots**: Student Center & Dining Hall (${buildings.find(b => b.id === 'b-student')?.occupancy || 84}% capacity).`,
        badges: [
          { label: 'Total Headcount', value: `${kpis.crowd.currentPopulation}` },
          { label: 'Utilization', value: `${kpis.crowd.peakOccupancyPct}%` },
          { label: 'Busiest Facility', value: 'Student Center', subtext: '84% Capacity' },
        ],
        actions: [
          { label: 'View Crowd & Density', actionType: 'navigate', targetTab: 'crowd', variant: 'primary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'secondary' },
        ],
      };
    }

    // --- 10. ENERGY REDUCTION RECOMMENDATIONS ---
    if (
      q.includes('reduce') ||
      q.includes('save energy') ||
      q.includes('efficiency') ||
      q.includes('optimization') ||
      q.includes('what can we do')
    ) {
      this.context.lastTopic = 'energy';
      return {
        text: `**Recommended Autonomous & Operator Actions to Reduce Energy Demand:**\n\n1. **Auto-balance Block B HVAC**: Lower secondary chiller pump #2 by 15 Hz to shift into 23.5°C Eco Mode (estimated savings: **~185 kWh/day**).\n2. **Rooftop Solar Arbitrage**: Direct the 138 kW peak generation from Renewable Energy Hub into Battery Bank B-2.\n3. **Central Library Daylight Harvesting**: Dim 3rd-floor perimeter LED lighting by 40% using ambient light sensors (saves **~45 kWh/day**).`,
        badges: [
          { label: 'Potential Savings', value: '230 kWh/day', status: 'nominal' },
          { label: 'Cost Reduction', value: '~$340/week' },
        ],
        actions: [
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
          { label: 'Inspect Block B', actionType: 'inspect-building', buildingId: 'b-cs', variant: 'outline' },
        ],
      };
    }

    // --- 11. GENERATE CAMPUS REPORT (PART 15) ---
    if (
      q.includes('generate') && q.includes('report') ||
      q.includes('daily operations report') ||
      q.includes('energy report') ||
      q.includes('sustainability report')
    ) {
      this.context.lastTopic = 'summary';
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (q.includes('energy')) {
        return {
          text: `**Generated Energy Management Audit Report**\nPrepared for Campus Operations Directorate.`,
          report: {
            title: 'Campus Electrical & Power Operations Report',
            date: todayStr,
            summary: `Daily campus power demand peaked at 218 kWh with active consumption at ${kpis.energy.currentKwh} kWh. Total diurnal consumption is trending 8.4% below historical baseline due to rooftop solar contribution (138 kW peak).`,
            keyMetrics: [
              { label: 'Active Demand', value: `${kpis.energy.currentKwh} kWh`, status: 'Nominal' },
              { label: 'Solar Generation', value: '138 kW', status: 'Optimal' },
              { label: 'Monthly Variance', value: '-8.4%', status: 'Nominal' },
              { label: 'High-Demand Node', value: 'Block B (42 kWh)', status: 'Warning' },
            ],
            problemsDetected: [
              'Chiller loop #2 in Computer Engineering running at 100% capacity.',
              'Power factor deviation in East Substation Transformer #3.',
            ],
            trends: [
              'Electricity demand tracks 12% below summer baseline.',
              'Solar battery storage charging is currently at 88% capacity.',
            ],
            recommendations: [
              'Execute automated chiller setpoint adjustment for Block B.',
              'Dispatch electrical maintenance to inspect East Substation power factor capacitor.',
            ],
          },
          actions: [
            { label: 'View Full Reports Section', actionType: 'navigate', targetTab: 'reports', variant: 'primary' },
            { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'secondary' },
          ],
        };
      }

      // Default Daily Operations Report
      return {
        text: `**Generated Daily Campus Operations Report**\nStructured operational audit based on 248 streaming edge sensors.`,
        report: {
          title: 'Daily Campus Comprehensive Operations Report',
          date: todayStr,
          summary: `Campus is overall Operational with a composite health score of ${health.overall}/100 and sustainability score of ${sustainability.overall}/100. 12 of 12 buildings online with 98.4% sensor network uptime.`,
          keyMetrics: [
            { label: 'Campus Health', value: `${health.overall}/100`, status: 'Operational' },
            { label: 'Electricity Demand', value: `${kpis.energy.currentKwh} kWh`, status: 'Nominal' },
            { label: 'Water Flow', value: `${kpis.water.currentLpm} L/min`, status: 'Nominal' },
            { label: 'Occupancy Rate', value: `${kpis.crowd.peakOccupancyPct}%`, status: 'Nominal' },
            { label: 'Active Incidents', value: `${activeAlerts.length} Alerts`, status: activeAlerts.length > 2 ? 'Warning' : 'Nominal' },
          ],
          problemsDetected: [
            'Hostel Block A: Riser water line pressure drop to 18.2 PSI (Critical).',
            'Zone B Quad: Air Quality Index elevated at 77 AQI (Warning).',
            'Block B: Computer Science chilled water loop running 23% above baseline.',
          ],
          trends: [
            'Solid waste diversion rate reached 71%, up 14.3% this month.',
            'Diurnal water consumption stabilized at 420 L/min with greywater cycling.',
          ],
          recommendations: [
            'Prioritize dispatch of plumbing crew to Hostel Block A.',
            'Audit ventilation air filters in Zone B Quad academic facilities.',
            'Engage peak shaving mode on solar battery arrays during 14:00 peak hours.',
          ],
        },
        actions: [
          { label: 'View Reports View', actionType: 'navigate', targetTab: 'reports', variant: 'primary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'secondary' },
        ],
      };
    }

    // --- 12. DIGITAL TWIN SPECIFIC QUERIES ---
    if (
      q.includes('digital twin') ||
      q.includes('3d map') ||
      q.includes('spatial model') ||
      q.includes('buildings')
    ) {
      this.context.lastTopic = 'digital-twin';
      return {
        text: `**Digital Twin Status & Spatial Model:**\n• **12 Dynamic 3D Building Geometries** online with live telemetry binding.\n• **248 Edge Sensors** spatially mapped across North Apex Campus.\n• **Active Layers**: Energy Grid (BACnet/IP), Water Network (Modbus), Density (Wi-Fi/Turnstiles), and Environmental Microclimate (LoRaWAN).\n\nSelect any facility in the 3D twin to inspect structural dimensions, floor-by-floor submetering, and neural forecasting.`,
        badges: [
          { label: '3D Geometries', value: '12 Facilities' },
          { label: 'FPS Performance', value: '60 FPS' },
          { label: 'Mapped Sensors', value: '248 Nodes' },
        ],
        actions: [
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'primary' },
          { label: 'Inspect Central Library', actionType: 'inspect-building', buildingId: 'b-lib', variant: 'secondary' },
        ],
      };
    }

    // --- 13. SENSOR LOOKUP / SENSOR CHANGED MOST ---
    if (q.includes('sensor') && (q.includes('most') || q.includes('changed') || q.includes('variance'))) {
      return {
        text: `**Sensor Variance Analysis:**\nThe sensor showing the highest delta over the past 2 hours is **Pressure Transducer #SNS-W014 (Hostel Block A)**:\n• **Current Value**: 18.2 PSI\n• **Baseline Value**: 54.0 PSI\n• **Deviation**: **-66.3%**\n• **Triggered Incident**: Alert #ALT-101 (Low Ingress Hydraulic Pressure).`,
        badges: [
          { label: 'Sensor ID', value: 'SNS-W014', status: 'critical' },
          { label: 'Location', value: 'Hostel Block A' },
          { label: 'Delta', value: '-66.3%', trend: 'down' },
        ],
        actions: [
          { label: 'Inspect Hostel A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'primary' },
          { label: 'View Sensor Registry', actionType: 'navigate', targetTab: 'sensors', variant: 'secondary' },
        ],
      };
    }

    // --- 14. DATA HONESTY FALLBACK (PART 17) ---
    // If the user asks about unavailable data (e.g. food, flight, seismic)
    if (
      q.includes('food') ||
      q.includes('cafeteria menu') ||
      q.includes('flight') ||
      q.includes('drone') ||
      q.includes('seismic') ||
      q.includes('earthquake') ||
      q.includes('grade') ||
      q.includes('tuition')
    ) {
      return {
        text: `I don't have enough current telemetry data to determine that.\n\nCITYOS AI is connected specifically to **248 campus facilities, electrical submetering, hydraulic flow rings, environmental stations, and crowd turnstiles** across North Apex Campus. To support this query, integration with third-party enterprise services (such as dining POS, seismic telemetry, or flight control APIs) would be required.`,
        actions: [
          { label: 'View Available Sensors', actionType: 'navigate', targetTab: 'sensors', variant: 'primary' },
          { label: 'Ask About Energy or Water', actionType: 'ask', prompt: "What is the current electricity demand?", variant: 'secondary' },
        ],
      };
    }

    // --- 15. DEFAULT INTELLIGENT CAMPUS ASSISTANT RESPONSE ---
    return {
      text: `**CITYOS Operating System Status:**\n• **Active Electricity Demand**: **${kpis.energy.currentKwh} kWh** (Nominal, -8.4% vs monthly median)\n• **Water Ingress Flow**: **${kpis.water.currentLpm} L/min** (Normal)\n• **Campus Environmental Quality**: **${kpis.environment.aqi} AQI** (1 Warning in Zone B Quad)\n• **Campus Occupancy**: **${kpis.crowd.peakOccupancyPct}%** (${kpis.crowd.currentPopulation} occupants)\n• **IoT Node Mesh**: **${onlineSensors} of 248 sensors online**\n\nHow can I help you investigate or optimize campus operations?`,
      badges: [
        { label: 'Health Score', value: `${health.overall}/100`, status: 'nominal' },
        { label: 'Active Alerts', value: `${activeAlerts.length}`, status: activeAlerts.length > 0 ? 'warning' : 'nominal' },
        { label: 'Online Nodes', value: `${onlineSensors} / 248` },
      ],
      actions: [
        { label: 'Campus Summary', actionType: 'ask', prompt: "Give me today's campus summary.", variant: 'primary' },
        { label: 'Analyze Energy', actionType: 'ask', prompt: "Analyze today's energy consumption", variant: 'secondary' },
        { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'outline' },
      ],
    };
  }
}

export const aiIntelligenceService = new AiIntelligenceService();
