import { campusService } from './campusService';
import { Building, Alert, AnomalyItem, ViewTab } from '../types';

export type CampusIntent =
  | 'GENERAL_CAPABILITIES'
  | 'CAMPUS_SUMMARY'
  | 'ENERGY_ANALYSIS'
  | 'WATER_ANALYSIS'
  | 'ENVIRONMENT_ANALYSIS'
  | 'OCCUPANCY_ANALYSIS'
  | 'PARKING_ANALYSIS'
  | 'WASTE_ANALYSIS'
  | 'ALERT_ANALYSIS'
  | 'ANOMALY_ANALYSIS'
  | 'PREDICTION'
  | 'COMPARISON'
  | 'DIGITAL_TWIN'
  | 'SENSOR_LOOKUP'
  | 'REPORT_GENERATION'
  | 'RECOMMENDATION'
  | 'UNKNOWN';

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
  lastTopic: 'energy' | 'water' | 'crowd' | 'environment' | 'aqi' | 'alerts' | 'anomalies' | 'predictions' | 'waste' | 'parking' | 'summary' | 'digital-twin' | 'comparison' | null;
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

  /**
   * Intent Detection Engine
   * Classifies user queries into discrete operational intents without exposing classification tags to the user.
   */
  public detectIntent(query: string): CampusIntent {
    const q = query.trim().toLowerCase();

    // 1. Follow-up pronoun and contextual queries
    const isFollowUp = 
      q.includes('is that') || 
      q.includes('is this') || 
      q.includes('is it high') || 
      q.includes('is it normal') ||
      q.includes('is that high') ||
      q.includes('is that normal') ||
      q.includes('is that safe') ||
      q.includes('why is it') ||
      q.includes('why is that') ||
      q.includes('which building is responsible') ||
      q.includes('who is responsible') ||
      q.includes('which building has an issue') ||
      q.includes('tell me more about that') ||
      q.includes('compare it with yesterday') ||
      q.includes('compare it');

    if (isFollowUp && this.context.lastTopic) {
      if (q.includes('compare')) return 'COMPARISON';
      if (q.includes('which building')) return 'DIGITAL_TWIN';
      if (this.context.lastTopic === 'energy') return 'ENERGY_ANALYSIS';
      if (this.context.lastTopic === 'water') return 'WATER_ANALYSIS';
      if (this.context.lastTopic === 'environment' || this.context.lastTopic === 'aqi') return 'ENVIRONMENT_ANALYSIS';
      if (this.context.lastTopic === 'crowd') return 'OCCUPANCY_ANALYSIS';
      if (this.context.lastTopic === 'alerts') return 'ALERT_ANALYSIS';
      if (this.context.lastTopic === 'anomalies') return 'ANOMALY_ANALYSIS';
    }

    // 2. GENERAL CAPABILITIES
    if (
      q.includes('what can you do') ||
      q.includes('what can you help') ||
      q.includes('what can cityos ai do') ||
      q.includes('how can you help') ||
      q.includes('what are your capabilities') ||
      q.includes('what are you capable of') ||
      q.includes('capabilities') ||
      q === 'help' ||
      q === 'help me' ||
      q.includes('who are you') ||
      q.includes('what do you do')
    ) {
      return 'GENERAL_CAPABILITIES';
    }

    // 3. COMPARISON (Checked before general energy/water to handle "compare today's energy with yesterday")
    if (
      q.includes('compare') ||
      q.includes('comparison') ||
      q.includes('versus') ||
      q.includes(' vs ') ||
      q.includes('difference between today and yesterday')
    ) {
      return 'COMPARISON';
    }

    // 4. PREDICTIONS (Checked before general energy/water to handle "predict tomorrow's electricity demand")
    if (
      q.includes('predict') ||
      q.includes('prediction') ||
      q.includes('forecast') ||
      q.includes('tomorrow') ||
      q.includes('projection') ||
      q.includes('what should we expect') ||
      q.includes('future demand')
    ) {
      return 'PREDICTION';
    }

    // 5. ANOMALY ANALYSIS
    if (
      q.includes('anomaly') ||
      q.includes('anomalies') ||
      q.includes('abnormal') ||
      q.includes('unusual') ||
      q.includes('outlier') ||
      q.includes('suspicious') ||
      q.includes('sensor reading') && (q.includes('wrong') || q.includes('spike'))
    ) {
      return 'ANOMALY_ANALYSIS';
    }

    // 6. ALERT ANALYSIS
    if (
      (q.includes('alert') || q.includes('alerts')) &&
      !q.includes('why') // "why is aqi warning" handled in environment or alert explanation
      || q.includes('show alerts')
      || q.includes('active alerts')
      || q.includes('current alerts')
      || q.includes('incident')
    ) {
      return 'ALERT_ANALYSIS';
    }

    // 7. RECOMMENDATION / SYSTEM ATTENTION
    if (
      q.includes('need attention') ||
      q.includes('needs attention') ||
      q.includes('which systems need') ||
      q.includes('recommendation') ||
      q.includes('recommendations') ||
      q.includes('what should we do') ||
      q.includes('how to reduce') ||
      q.includes('how to save') ||
      q.includes('optimize energy')
    ) {
      return 'RECOMMENDATION';
    }

    // 8. REPORT GENERATION
    if (
      q.includes('generate report') ||
      q.includes('create report') ||
      q.includes('daily report') ||
      q.includes('operations report') ||
      q.includes('audit report') ||
      (q.includes('report') && (q.includes('generate') || q.includes('download') || q.includes('export')))
    ) {
      return 'REPORT_GENERATION';
    }

    // 9. CAMPUS SUMMARY (Strict: Only when user explicitly asks for campus summary / status overview)
    if (
      q.includes('campus summary') ||
      q.includes('overall campus status') ||
      q.includes('current campus status') ||
      q.includes('give me a campus overview') ||
      q.includes('how is the campus doing') ||
      q.includes('system status') ||
      q.includes('campus overview') ||
      q.includes('overall status') ||
      q.includes('campus status') ||
      q.includes("today's status") ||
      q.includes('summarize campus') ||
      q.includes('summarize today')
    ) {
      return 'CAMPUS_SUMMARY';
    }

    // 10. ENERGY ANALYSIS
    if (
      q.includes('energy') ||
      q.includes('electricity') ||
      q.includes('kwh') ||
      q.includes('power demand') ||
      q.includes('power consumption') ||
      q.includes('power usage') ||
      q.includes('kilowatt') ||
      q.includes('grid load')
    ) {
      return 'ENERGY_ANALYSIS';
    }

    // 11. WATER ANALYSIS
    if (
      q.includes('water') ||
      q.includes('l/min') ||
      q.includes('lpm') ||
      q.includes('liters') ||
      q.includes('flow rate') ||
      q.includes('hydraulic') ||
      q.includes('riser pressure') ||
      q.includes('plumbing')
    ) {
      return 'WATER_ANALYSIS';
    }

    // 12. ENVIRONMENT ANALYSIS
    if (
      q.includes('aqi') ||
      q.includes('air quality') ||
      q.includes('environment') ||
      q.includes('temperature') ||
      q.includes('humidity') ||
      q.includes('noise') ||
      q.includes('co2') ||
      q.includes('weather')
    ) {
      return 'ENVIRONMENT_ANALYSIS';
    }

    // 13. OCCUPANCY ANALYSIS
    if (
      q.includes('occupancy') ||
      q.includes('crowd') ||
      q.includes('headcount') ||
      q.includes('people') ||
      q.includes('population') ||
      q.includes('crowded') ||
      q.includes('how many people') ||
      q.includes('attendees')
    ) {
      return 'OCCUPANCY_ANALYSIS';
    }

    // 14. PARKING ANALYSIS
    if (
      q.includes('parking') ||
      q.includes('car park') ||
      q.includes('parking bays') ||
      q.includes('parking spaces') ||
      q.includes('vehicles')
    ) {
      return 'PARKING_ANALYSIS';
    }

    // 15. WASTE ANALYSIS
    if (
      q.includes('waste') ||
      q.includes('recycling') ||
      q.includes('trash') ||
      q.includes('garbage') ||
      q.includes('compost') ||
      q.includes('solid waste')
    ) {
      return 'WASTE_ANALYSIS';
    }

    // 16. DIGITAL TWIN / 3D MODEL
    if (
      q.includes('digital twin') ||
      q.includes('3d map') ||
      q.includes('3d model') ||
      q.includes('spatial model') ||
      q.includes('which building') ||
      q.includes('building uses the most') ||
      q.includes('show me zone') ||
      q.includes('show building')
    ) {
      return 'DIGITAL_TWIN';
    }

    // 17. SENSOR LOOKUP
    if (
      q.includes('sensor') ||
      q.includes('sensors') ||
      q.includes('transducer') ||
      q.includes('iot node') ||
      q.includes('iot mesh') ||
      q.includes('how many sensors')
    ) {
      return 'SENSOR_LOOKUP';
    }

    return 'UNKNOWN';
  }

  public generateResponse(query: string): AiResponse {
    const raw = query.trim();
    const q = raw.toLowerCase();
    this.context.history.push({ query: raw, timestamp: new Date() });

    // Live Campus Telemetry State
    const kpis = campusService.getKPIs();
    const buildings = campusService.getBuildings();
    const alerts = campusService.getAlerts();
    const anomalies = campusService.getAnomalies();
    const sensors = campusService.getSensors();
    const health = campusService.getCampusHealth();
    const sustainability = campusService.getSustainabilityScore();

    const activeAlerts = alerts.filter(a => a.status === 'active');
    const totalSensors = sensors.length; // Exactly 248
    const onlineSensors = sensors.filter(s => s.status === 'online').length; // <= 248

    // Intent Detection
    const intent = this.detectIntent(raw);

    // ==========================================
    // 1. GENERAL CAPABILITIES
    // ==========================================
    if (intent === 'GENERAL_CAPABILITIES') {
      return {
        text: `### CITYOS AI\n\nI can help you understand and manage campus operations.\n\nI can:\n⚡ Analyze energy consumption\n💧 Monitor water usage\n🌱 Analyze environmental conditions\n👥 Analyze campus occupancy\n🚨 Investigate alerts and anomalies\n🔮 Generate predictions\n🗺 Explore the Digital Twin\n📊 Compare campus metrics\n📄 Generate operational reports\n\nTry asking:\n• "Analyze today's energy consumption"\n• "Are there any anomalies?"\n• "Which systems need attention?"\n• "Predict tomorrow's electricity demand"`,
        actions: [
          { label: "Analyze Energy", actionType: 'ask', prompt: "Analyze today's energy consumption", variant: 'primary' },
          { label: "Check Anomalies", actionType: 'ask', prompt: "Are there any anomalies?", variant: 'secondary' },
          { label: "Active Alerts", actionType: 'ask', prompt: "What alerts are active?", variant: 'outline' },
          { label: "Campus Summary", actionType: 'ask', prompt: "Give me a campus summary", variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 2. ENERGY ANALYSIS
    // ==========================================
    if (intent === 'ENERGY_ANALYSIS') {
      this.context.lastTopic = 'energy';
      const cur = kpis.energy.currentKwh;
      const median = 198;
      const diffPct = Math.round(((cur - median) / median) * 1000) / 10;
      const statusText = cur > 210 ? 'Warning' : 'Nominal';

      // Follow-up context handling: "Why is it lower?"
      if (q.includes('why is it lower') || (q.includes('why') && (q.includes('low') || q.includes('lower') || q.includes('decrease')))) {
        return {
          text: `### ⚡ Energy Analysis — Why Demand Is Lower\n\nToday's electricity demand (**${cur} kWh**) is lower than normal due to two primary factors:\n\n1. **High Rooftop Solar Offset**: The Renewable Energy & Utility Hub is currently generating **138 kW peak**, directly offsetting the academic quad.\n2. **Dynamic Chiller Pre-Cooling**: Automated HVAC pre-cooling was executed at 06:00, allowing secondary chiller loops in Block A & B to operate at reduced compressor cycle frequency during mid-day hours.\n\nCumulative consumption today stands at **${kpis.energy.todayTotalKwh.toLocaleString()} kWh**.`,
          badges: [
            { label: 'Current Demand', value: `${cur} kWh`, status: 'nominal' },
            { label: 'Solar Generation', value: '138 kW', status: 'nominal', subtext: 'Offsets ~44% draw' },
            { label: 'Variance', value: `${diffPct}%`, trend: 'down' },
          ],
          actions: [
            { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
            { label: 'Which building is responsible?', actionType: 'ask', prompt: 'Which building is consuming the most electricity?', variant: 'secondary' },
            { label: 'Compare with Yesterday', actionType: 'ask', prompt: 'Compare today electricity usage with yesterday', variant: 'outline' },
          ],
        };
      }

      // Follow-up context handling: "Is that high?" or "Is that normal?"
      if (q.includes('is that') || q.includes('is this') || q.includes('is it high') || q.includes('is it normal')) {
        return {
          text: `### ⚡ Energy Analysis — Operating Range Evaluation\n\nCurrent electricity demand of **${cur} kWh** is **within the nominal operating range** (${Math.abs(diffPct)}% below monthly median of 198 kWh).\n\nThe campus threshold for peak demand alerts is **215 kWh**. While currently safe, Computer Science Block B is exhibiting an elevated local draw (42.0 kWh) due to GPU compute cluster activity.`,
          badges: [
            { label: 'Current Demand', value: `${cur} kWh`, status: 'nominal' },
            { label: 'Nominal Envelope', value: '150–210 kWh' },
            { label: 'Status', value: 'Nominal', status: 'nominal' },
          ],
          actions: [
            { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
            { label: 'Inspect Block B', actionType: 'inspect-building', buildingId: 'b-cs', variant: 'secondary' },
          ],
        };
      }

      // Standard Energy Analysis
      return {
        text: `### ⚡ ENERGY ANALYSIS\n\n**Current Demand**: ${cur} kWh\n**Monthly Median**: ${median} kWh\n**Difference**: ${diffPct > 0 ? `+${diffPct}` : diffPct}%\n**Status**: ${statusText}\n\n### Today's Analysis\nCurrent electricity demand is **${cur} kWh**, which is **${Math.abs(diffPct)}% ${diffPct < 0 ? 'below' : 'above'} the monthly median** (198 kWh).\n\nThe current reading is within the expected operating range (**Nominal**).\n\n### Trend\nEnergy demand is currently stable with a slight downward trend (-8.4% vs monthly median). Daily cumulative consumption stands at ${kpis.energy.todayTotalKwh.toLocaleString()} kWh.\n\n### Recommendation\nContinue monitoring high-consumption zones (e.g. Computer Science Block B chiller loop) and investigate any sudden increases.`,
        badges: [
          { label: 'Current Demand', value: `${cur} kWh`, status: 'nominal' },
          { label: 'Monthly Median', value: `${median} kWh` },
          { label: 'Difference', value: `${diffPct}%`, trend: diffPct < 0 ? 'down' : 'up', status: 'nominal' },
          { label: 'Status', value: statusText, status: 'nominal' },
        ],
        actions: [
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'primary' },
          { label: "Predict Tomorrow's Demand", actionType: 'ask', prompt: "Predict tomorrow's energy demand", variant: 'secondary' },
          { label: 'Compare with Yesterday', actionType: 'ask', prompt: 'Compare today electricity usage with yesterday', variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 3. WATER ANALYSIS
    // ==========================================
    if (intent === 'WATER_ANALYSIS') {
      this.context.lastTopic = 'water';
      const curFlow = kpis.water.currentLpm;

      return {
        text: `### 💧 WATER ANALYSIS\n\n**Current Flow**: ${curFlow} L/min\n**Status**: Normal\n**Average**: 395 L/min\n**Peak Today**: 512 L/min (morning residential surge at 08:15)\n**Trend**: Stable (-5.2% vs diurnal baseline)\n\n### Analysis\nCampus main ingress flow is operating nominally across all 12 facilities, with automated greywater filtration recycling 22% of daily volume. However, **Hostel Block A** has an active riser line pressure anomaly (18.2 PSI vs 54 PSI nominal) requiring priority maintenance.\n\n### Recommendation\nMaintain current greywater buffer cycling and prioritize plumber dispatch to isolate and inspect Hostel Block A booster riser line #3.`,
        badges: [
          { label: 'Current Flow', value: `${curFlow} L/min`, status: 'nominal' },
          { label: 'Status', value: 'Normal', status: 'nominal' },
          { label: 'Daily Average', value: '395 L/min' },
          { label: 'Today Total', value: `${kpis.water.todayTotalL.toLocaleString()} L` },
        ],
        actions: [
          { label: 'Open Water Network', actionType: 'navigate', targetTab: 'water', variant: 'primary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'secondary' },
          { label: 'Predict Water Demand', actionType: 'ask', prompt: 'Predict water demand', variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 4. ENVIRONMENT ANALYSIS
    // ==========================================
    if (intent === 'ENVIRONMENT_ANALYSIS') {
      this.context.lastTopic = 'environment';
      const curAqi = kpis.environment.aqi;
      const statusText = curAqi > 70 ? 'Warning' : 'Nominal';

      return {
        text: `### 🌱 ENVIRONMENT ANALYSIS\n\n**Current AQI**: ${curAqi}\n**Status**: ${statusText}\n**Affected Area**: Zone B Quad\n\n### Analysis\nThe current AQI is above the preferred operating level for Zone B Quad (acceptable baseline is 40–65 AQI).\n\n**Potential factors:**\n• High pedestrian density in Central Quad during class transitions\n• Logistics delivery van engine idling near catering service entrance\n• Stagnant atmospheric microclimate with low wind dispersion (1.8 m/s)\n\n### Recommended action\nInspect environmental conditions in Zone B Quad, confirm anti-idling compliance at loading bays, and increase intake air exchange in adjacent academic buildings.`,
        badges: [
          { label: 'Current AQI', value: `${curAqi} AQI`, status: 'warning' },
          { label: 'Status', value: statusText, status: 'warning' },
          { label: 'Affected Area', value: 'Zone B Quad' },
          { label: 'Ambient Temp', value: `${kpis.environment.temperature}°C` },
        ],
        actions: [
          { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'primary' },
          { label: 'Investigate Anomalies', actionType: 'navigate', targetTab: 'anomalies', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 5. OCCUPANCY ANALYSIS
    // ==========================================
    if (intent === 'OCCUPANCY_ANALYSIS') {
      this.context.lastTopic = 'crowd';
      const occPct = kpis.crowd.peakOccupancyPct;
      const population = kpis.crowd.currentPopulation;

      return {
        text: `### 👥 OCCUPANCY ANALYSIS\n\n**Current Occupancy**: ${occPct}%\n**Estimated Occupants**: ${population.toLocaleString()}\n**Status**: Normal\n\n### Analysis\nCampus population is currently at **${occPct}% of total capacity** (4,800 capacity ceiling). Foot traffic has distributed smoothly following midday peaks. Highest density zones are the Student Dining Canteen (84% capacity) and Central University Library (81% capacity).\n\n### Recommendation\nNo overcrowding mitigations required. Continue dynamic demand-controlled ventilation in Student Center and Library.`,
        badges: [
          { label: 'Current Occupancy', value: `${occPct}%`, status: 'nominal' },
          { label: 'Active Occupants', value: `${population.toLocaleString()}` },
          { label: 'Campus Capacity', value: '4,800' },
          { label: 'Busiest Facility', value: 'Student Center (84%)' },
        ],
        actions: [
          { label: 'View Crowd & Density Map', actionType: 'navigate', targetTab: 'crowd', variant: 'primary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 6. ALERT ANALYSIS
    // ==========================================
    if (intent === 'ALERT_ANALYSIS') {
      this.context.lastTopic = 'alerts';
      const critCount = activeAlerts.filter(a => a.severity === 'critical').length;
      const warnCount = activeAlerts.filter(a => a.severity === 'warning').length;

      return {
        text: `### 🚨 ACTIVE ALERTS\n\n**${activeAlerts.length} active alerts detected.**\n\n1. **Low Ingress Hydraulic Pressure**\n   • **Severity**: Critical\n   • **Location**: Hostel Block A (Basement Riser #3)\n   • **Current Value**: 18.2 PSI\n   • **Expected Value**: 50–55 PSI\n   • **Time**: 14 mins ago\n   • **Recommended Action**: Isolate booster manifold B-01 and dispatch plumbing technicians.\n\n2. **AQI Warning**\n   • **Severity**: Moderate (Warning)\n   • **Location**: Zone B Quad (Outdoor Sensor AQ-042)\n   • **Current Value**: 74 AQI\n   • **Expected Value**: 40–65 AQI\n   • **Time**: 22 mins ago\n   • **Recommended Action**: Inspect outdoor vehicle idling and adjust intake filtration.\n\n3. **Chiller Loop Staging Spike**\n   • **Severity**: Moderate (Warning)\n   • **Location**: Computer Science Block B\n   • **Current Value**: 42.0 kWh (+23.4% above baseline)\n   • **Expected Value**: 30–35 kWh\n   • **Time**: 35 mins ago\n   • **Recommended Action**: Re-stage Chiller Loop #2 to Eco Setpoint.\n\n4. **Parking Capacity Warning**\n   • **Severity**: Low (Warning)\n   • **Location**: Central Parking Structure\n   • **Current Value**: 78% Occupied (66 bays remaining)\n   • **Expected Value**: < 75%\n   • **Time**: 40 mins ago\n   • **Recommended Action**: Direct ingress vehicles to overflow parking zones in East Quad.`,
        badges: [
          { label: 'Active Alerts', value: `${activeAlerts.length}`, status: critCount > 0 ? 'critical' : 'warning' },
          { label: 'Critical', value: `${critCount}`, status: 'critical' },
          { label: 'Warnings', value: `${warnCount}`, status: 'warning' },
        ],
        actions: [
          { label: 'Open Alert Center', actionType: 'navigate', targetTab: 'alerts', variant: 'primary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'secondary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 7. ANOMALY ANALYSIS
    // ==========================================
    if (intent === 'ANOMALY_ANALYSIS') {
      this.context.lastTopic = 'anomalies';
      const aqiVal = kpis.environment.aqi;

      return {
        text: `### 🔎 ANOMALY ANALYSIS\n\n**2 potential anomalies detected.**\n\n1. **Air Quality — Zone B Quad**\n   • **Current**: ${aqiVal} AQI\n   • **Expected**: 40–65 AQI\n   • **Deviation**: +18.4%\n   • **Possible Cause**: Particulate accumulation from delivery van idling and pedestrian congregation.\n\n2. **Hydraulic Ingress Pressure — Hostel Block A**\n   • **Current**: 18.2 PSI\n   • **Expected**: 50–55 PSI\n   • **Deviation**: -66.3%\n   • **Possible Cause**: Main booster riser line cavitation or localized valve failure.\n\n### Recommended Investigation\nInspect environmental intake dampers in Zone B and dispatch facilities technicians to verify Hostel Block A basement booster valve B-01.`,
        anomaly: {
          title: 'Air Quality — Zone B Quad',
          sensor: 'AQI Micro-optical Node #AQ-042',
          current: `${aqiVal} AQI`,
          expected: '40–65 AQI',
          difference: '+18.4%',
          possibleCause: 'Localized quad gathering near loading dock or delivery vehicle idling.',
          recommendedAction: 'Inspect ventilation intakes and air handlers in adjacent academic blocks.',
          targetTab: 'environment',
        },
        actions: [
          { label: 'Open Environment', actionType: 'navigate', targetTab: 'environment', variant: 'primary' },
          { label: 'View Sensors', actionType: 'navigate', targetTab: 'sensors', variant: 'secondary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 8. PREDICTIONS
    // ==========================================
    if (intent === 'PREDICTION') {
      this.context.lastTopic = 'predictions';

      // Water Prediction
      if (q.includes('water')) {
        return {
          text: `### 🔮 WATER DEMAND PREDICTION\n\n• **Expected Demand**: 380–490 L/min (~8,650 L/day)\n• **Trend**: Slightly decreasing (-5.2%)\n• **Confidence**: High (91%)\n• **Reason**: Diurnal class dismissal schedules and automated greywater recycling buffers during evening hours.`,
          prediction: {
            title: 'Tomorrow Diurnal Hydraulic Demand',
            expected: '~415 L/min',
            expectedRange: '380–490 L/min',
            trend: '↓ Decreasing (-5.2%)',
            confidence: 'High (91%)',
            explanation: 'Based on lecture timetables and automated greywater recycling schedules.',
            targetTab: 'predictions',
          },
          actions: [
            { label: 'View Predictions', actionType: 'navigate', targetTab: 'predictions', variant: 'primary' },
            { label: 'View Water Network', actionType: 'navigate', targetTab: 'water', variant: 'secondary' },
          ],
        };
      }

      // Check for unavailable data prediction
      if (q.includes('crypto') || q.includes('bitcoin') || q.includes('stock') || q.includes('cafeteria menu') || q.includes('flight')) {
        return {
          text: `I don't have enough historical data to generate a reliable prediction for that request.\n\nCITYOS AI generates predictions strictly from **${sensors.length} connected campus telemetry nodes** (energy grids, hydraulic distribution, microclimate stations, and turnstiles).`,
          actions: [
            { label: "Predict Tomorrow's Energy Demand", actionType: 'ask', prompt: "Predict tomorrow's energy demand", variant: 'primary' },
            { label: "Predict Water Demand", actionType: 'ask', prompt: "Predict water demand", variant: 'secondary' },
          ],
        };
      }

      // Energy Prediction (Default)
      return {
        text: `### 🔮 ENERGY DEMAND PREDICTION\n\n• **Expected Demand**: 185–200 kWh\n• **Trend**: Slightly increasing (+4.2%)\n• **Confidence**: Moderate (88%)\n• **Reason**: Recent consumption trend, scheduled afternoon laboratory compute sessions, and a projected +3.2°C ambient temperature rise elevating secondary chiller loads.`,
        prediction: {
          title: 'Tomorrow Diurnal Energy Load',
          expected: '~192 kWh',
          expectedRange: '185–200 kWh',
          trend: '↑ Slightly increasing (+4.2%)',
          confidence: 'Moderate (88%)',
          explanation: 'Recent consumption trend and current occupancy levels combined with forecasted ambient temperature rise.',
          targetTab: 'predictions',
        },
        actions: [
          { label: 'View Prediction Details', actionType: 'navigate', targetTab: 'predictions', variant: 'primary' },
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 9. COMPARISON
    // ==========================================
    if (intent === 'COMPARISON') {
      this.context.lastTopic = 'comparison';
      const cur = kpis.energy.currentKwh;

      return {
        text: `### 📊 ENERGY COMPARISON\n\n             Today     Yesterday\nDemand       ${cur} kWh   194 kWh\n\nChange:\n↓ 6.7%\n\n### Interpretation\nToday's electricity demand (**${cur} kWh**) is **6.7% lower than yesterday** (194 kWh) at this hour.\n\nThis efficiency gain is driven by:\n1. Automated HVAC pre-cooling executed at 06:00, mitigating mid-day compressor spikes.\n2. High rooftop solar generation (+11.3% vs yesterday) at the Renewable Energy Substation.`,
        badges: [
          { label: 'Today (Live)', value: `${cur} kWh` },
          { label: 'Yesterday', value: '194 kWh' },
          { label: 'Delta', value: '↓ 6.7%', trend: 'down', status: 'nominal' },
        ],
        table: {
          headers: ['Metric', 'Today', 'Yesterday', 'Change'],
          rows: [
            ['Active Demand', `${cur} kWh`, '194 kWh', '↓ 6.7%'],
            ['Diurnal Peak', '218 kWh', '234 kWh', '↓ 6.8%'],
            ['Solar Output', '138 kW', '124 kW', '↑ 11.3%'],
          ],
        },
        actions: [
          { label: 'View Energy Analytics', actionType: 'navigate', targetTab: 'analytics', variant: 'primary' },
          { label: 'Open Energy Grid', actionType: 'navigate', targetTab: 'energy', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 10. DIGITAL TWIN
    // ==========================================
    if (intent === 'DIGITAL_TWIN') {
      this.context.lastTopic = 'digital-twin';
      const sorted = [...buildings].sort((a, b) => b.energyUsage - a.energyUsage);
      const topConsumer = sorted[0];

      return {
        text: `### 🗺 DIGITAL TWIN & 3D SPATIAL MODEL\n\n• **12 Dynamic 3D Facility Geometries** online with live telemetry binding.\n• **${totalSensors} Edge Sensors** spatially mapped across North Apex Campus.\n• **Active Layers**: Energy Grid (BACnet/IP), Water Network (Modbus), Density (Turnstiles), Environmental Microclimate (LoRaWAN).\n\n${
          q.includes('most') || q.includes('highest') || q.includes('which building')
            ? `**${topConsumer.name}** currently consumes the most electricity on campus at **${topConsumer.energyUsage} kWh** (+23.4% above baseline), driven by secondary chiller pump #2 and GPU lab compute loads.`
            : 'Select any facility in the 3D twin to inspect floor-by-floor submetering, HVAC loop performance, and structural occupancy.'
        }`,
        badges: [
          { label: '3D Facilities', value: '12 Facilities' },
          { label: 'Mapped Sensors', value: `${totalSensors} Nodes` },
          { label: 'Top Consumer', value: `${topConsumer.shortName} (${topConsumer.energyUsage} kWh)` },
        ],
        actions: [
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'primary' },
          { label: `Inspect ${topConsumer.shortName}`, actionType: 'inspect-building', buildingId: topConsumer.id, variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 11. SENSOR LOOKUP
    // ==========================================
    if (intent === 'SENSOR_LOOKUP') {
      return {
        text: `### 📡 SENSOR MESH & TELEMETRY REGISTRY\n\n• **Total Registered Sensors**: **${totalSensors} Nodes** across 12 facilities\n• **Online & Streaming**: **${onlineSensors} of ${totalSensors} sensors online** (${Math.round((onlineSensors / totalSensors) * 1000) / 10}% availability)\n• **Protocols**: BACnet/IP (98), LoRaWAN (64), Modbus (46), MQTT (40)\n\n### Sensor Delta Highlight\nThe sensor displaying the highest variance over the past 2 hours is **Pressure Transducer #SNS-W014 (Hostel Block A)**:\n• **Current Reading**: 18.2 PSI\n• **Expected Baseline**: 54.0 PSI\n• **Deviation**: **-66.3%** (Triggered incident Alert #ALT-101)`,
        badges: [
          { label: 'Total Nodes', value: `${totalSensors}` },
          { label: 'Online Status', value: `${onlineSensors} / ${totalSensors}` },
          { label: 'Highest Delta', value: '-66.3% (SNS-W014)', status: 'critical' },
        ],
        actions: [
          { label: 'View Sensor Registry', actionType: 'navigate', targetTab: 'sensors', variant: 'primary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 12. PARKING ANALYSIS
    // ==========================================
    if (intent === 'PARKING_ANALYSIS') {
      this.context.lastTopic = 'parking';
      const parking = kpis.parking;

      return {
        text: `### 🚗 PARKING ANALYSIS\n\n• **Current Occupancy**: **${parking.occupiedPct}%** (${parking.totalSpaces - parking.availableSpaces} of ${parking.totalSpaces} bays occupied)\n• **Available Spaces**: **${parking.availableSpaces} bays** remaining\n• **Status**: Approaching Threshold (78% vs 75% nominal limit)\n\n### Analysis & Recommendation\nIngress traffic from afternoon arrivals is filling the Central Structure. Facilities operators should display digital overflow routing toward East Quad surface parking.`,
        badges: [
          { label: 'Parking Occupancy', value: `${parking.occupiedPct}%`, status: 'warning' },
          { label: 'Available Bays', value: `${parking.availableSpaces} / ${parking.totalSpaces}` },
        ],
        actions: [
          { label: 'Open Parking & Mobility', actionType: 'navigate', targetTab: 'parking', variant: 'primary' },
        ],
      };
    }

    // ==========================================
    // 13. WASTE ANALYSIS
    // ==========================================
    if (intent === 'WASTE_ANALYSIS') {
      this.context.lastTopic = 'waste';
      const waste = kpis.waste;

      return {
        text: `### ♻️ SOLID WASTE & RECYCLING ANALYSIS\n\n• **Today's Waste Collected**: **${waste.todayWasteKg} kg**\n• **Diversion / Recycling Rate**: **${waste.recyclingRatePct}%** (Status: Good, +14.3% vs last month)\n• **Trend**: **${waste.trend}%** reduction in landfill waste\n• **Smart Bin Mesh**: 22 automated solar compactors operating nominally.`,
        badges: [
          { label: 'Today Waste', value: `${waste.todayWasteKg} kg` },
          { label: 'Recycling Rate', value: `${waste.recyclingRatePct}%`, status: 'nominal' },
        ],
        actions: [
          { label: 'Open Sustainability', actionType: 'navigate', targetTab: 'sustainability', variant: 'primary' },
        ],
      };
    }

    // ==========================================
    // 14. RECOMMENDATION / SYSTEM ATTENTION
    // ==========================================
    if (intent === 'RECOMMENDATION') {
      return {
        text: `### 🛠 RECOMMENDED OPERATIONAL DIRECTIVES\n\nBased on real-time edge telemetry, the following systems require operator intervention:\n\n1. 🔴 **Hostel Block A Booster Riser**: Dispatch plumbing technicians to Basement Manifold B-01 to address 18.2 PSI pressure drop.\n2. 🟡 **Computer Science Block B HVAC**: Re-stage Chiller Loop #2 to Eco Setpoint (saves ~185 kWh/day).\n3. 🟡 **Zone B Quad Microclimate**: Direct campus security to enforce anti-idling at the catering loading bay to reduce 74 AQI particulate elevation.`,
        badges: [
          { label: 'Urgent Directives', value: '3 Items', status: 'warning' },
          { label: 'Potential Energy Savings', value: '~185 kWh/day' },
        ],
        actions: [
          { label: 'View Alert Center', actionType: 'navigate', targetTab: 'alerts', variant: 'primary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 15. REPORT GENERATION
    // ==========================================
    if (intent === 'REPORT_GENERATION') {
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        text: `**Generated Daily Campus Operations Report**\nStructured operational audit based on ${totalSensors} streaming edge sensors.`,
        report: {
          title: 'Daily Campus Comprehensive Operations Report',
          date: todayStr,
          summary: `Campus is overall Operational with a composite health score of ${health.overall}/100 and sustainability score of ${sustainability.overall}/100. 12 of 12 buildings online with ${onlineSensors} of ${totalSensors} sensors active.`,
          keyMetrics: [
            { label: 'Campus Health', value: `${health.overall}/100`, status: 'Operational' },
            { label: 'Electricity Demand', value: `${kpis.energy.currentKwh} kWh`, status: 'Nominal' },
            { label: 'Water Flow', value: `${kpis.water.currentLpm} L/min`, status: 'Nominal' },
            { label: 'Occupancy Rate', value: `${kpis.crowd.peakOccupancyPct}%`, status: 'Nominal' },
            { label: 'Active Alerts', value: `${activeAlerts.length} Alerts`, status: activeAlerts.length > 2 ? 'Warning' : 'Nominal' },
          ],
          problemsDetected: [
            'Hostel Block A: Riser water line pressure drop to 18.2 PSI (Critical).',
            'Zone B Quad: Air Quality Index elevated at 74 AQI (Warning).',
            'Block B: Computer Science chilled water loop running 23% above baseline.',
          ],
          trends: [
            'Solid waste diversion rate reached 71%, up 14.3% this month.',
            'Diurnal water consumption stabilized at 426 L/min with greywater cycling.',
          ],
          recommendations: [
            'Prioritize dispatch of plumbing crew to Hostel Block A.',
            'Audit ventilation air filters in Zone B Quad academic facilities.',
            'Engage peak shaving mode on solar battery arrays during 14:00 peak hours.',
          ],
        },
        actions: [
          { label: 'View Full Reports Section', actionType: 'navigate', targetTab: 'reports', variant: 'primary' },
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'secondary' },
        ],
      };
    }

    // ==========================================
    // 16. CAMPUS SUMMARY (Only on explicit request!)
    // ==========================================
    if (intent === 'CAMPUS_SUMMARY') {
      this.context.lastTopic = 'summary';
      const critCount = activeAlerts.filter(a => a.severity === 'critical').length;
      const warnCount = activeAlerts.filter(a => a.severity === 'warning').length;

      return {
        text: `### 🏛 CAMPUS STATUS SUMMARY\n\n• **Overall State**: **Operational** (Campus Health Score: ${health.overall}/100)\n• **Active Electricity Demand**: **${kpis.energy.currentKwh} kWh** (Nominal, -8.4% vs monthly median)\n• **Water Ingress Flow**: **${kpis.water.currentLpm} L/min** (Normal)\n• **Environmental Quality**: **${kpis.environment.aqi} AQI** (1 Warning in Zone B Quad)\n• **Campus Occupancy**: **${kpis.crowd.peakOccupancyPct}%** (${kpis.crowd.currentPopulation} occupants across 12 facilities)\n• **IoT Node Mesh**: **${onlineSensors} of ${totalSensors} sensors online**\n• **Active Alerts**: **${activeAlerts.length}** (${critCount} critical, ${warnCount} warning)\n\n### Priority areas requiring attention\n1. 🔴 **Hostel Block A**: Water riser line pressure drop to 18.2 PSI.\n2. 🟡 **Zone B Quad**: Outdoor AQI elevated at 74 AQI.\n3. 🟡 **Computer Science Block B**: Chiller staging power spike (+23.4% above baseline).`,
        badges: [
          { label: 'Campus Health', value: `${health.overall}/100`, status: 'nominal' },
          { label: 'Active Alerts', value: `${activeAlerts.length}`, status: critCount > 0 ? 'critical' : 'warning' },
          { label: 'Online Sensors', value: `${onlineSensors} / ${totalSensors}` },
          { label: 'Campus Occupancy', value: `${kpis.crowd.peakOccupancyPct}%` },
        ],
        actions: [
          { label: 'Open Digital Twin', actionType: 'navigate', targetTab: 'digital-twin', variant: 'primary' },
          { label: 'View Latest Alerts', actionType: 'navigate', targetTab: 'alerts', variant: 'secondary' },
          { label: 'Inspect Hostel Block A', actionType: 'inspect-building', buildingId: 'b-hostel-a', variant: 'outline' },
        ],
      };
    }

    // ==========================================
    // 17. UNKNOWN / DATA HONESTY FALLBACK
    // ==========================================
    return {
      text: `I don't have telemetry data for that query.\n\nCITYOS AI is connected specifically to **${totalSensors} campus facilities, electrical submetering, hydraulic flow rings, environmental stations, and crowd turnstiles** across North Apex Campus.\n\nYou can ask me about:\n⚡ Energy consumption & demand\n💧 Water flow & pressure\n🌱 Air quality & temperature\n👥 Campus occupancy & headcount\n🚨 Active incident alerts & anomalies\n🔮 24-hour demand predictions\n🗺 Digital Twin 3D exploration`,
      actions: [
        { label: "What can you do for me?", actionType: 'ask', prompt: "What can you do for me?", variant: 'primary' },
        { label: "Analyze Energy", actionType: 'ask', prompt: "Analyze today's energy consumption", variant: 'secondary' },
        { label: "Give me a Campus Summary", actionType: 'ask', prompt: "Give me a campus summary", variant: 'outline' },
      ],
    };
  }
}

export const aiIntelligenceService = new AiIntelligenceService();
