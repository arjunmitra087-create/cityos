import { 
  Building, 
  CampusKPIs, 
  ActivityFeedItem, 
  Alert, 
  AiInsight, 
  Sensor,
  CampusHealthScore,
  SustainabilityScore,
  AnomalyItem,
  PredictionItem
} from '../types';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_KPIS, 
  INITIAL_ACTIVITIES, 
  INITIAL_ALERTS, 
  INITIAL_INSIGHTS, 
  INITIAL_CAMPUS_HEALTH,
  INITIAL_SUSTAINABILITY,
  INITIAL_ANOMALIES,
  INITIAL_PREDICTIONS,
  generate248Sensors 
} from '../data/mockCampusData';

class CampusService {
  private buildings: Building[] = [...INITIAL_BUILDINGS];
  private kpis: CampusKPIs = { ...INITIAL_KPIS };
  private activities: ActivityFeedItem[] = [...INITIAL_ACTIVITIES];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private insights: AiInsight[] = [...INITIAL_INSIGHTS];
  private sensors: Sensor[] = generate248Sensors();
  private healthScore: CampusHealthScore = { ...INITIAL_CAMPUS_HEALTH };
  private sustainabilityScore: SustainabilityScore = { ...INITIAL_SUSTAINABILITY };
  private anomalies: AnomalyItem[] = [...INITIAL_ANOMALIES];
  private predictions: PredictionItem[] = [...INITIAL_PREDICTIONS];
  
  private dataSourceMode: 'live' | 'demo' = 'demo';
  private subscribers: Array<() => void> = [];
  private simulationInterval: number | null = null;
  private isSimulating: boolean = true;

  constructor() {
    this.startSimulation();
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb());
  }

  public getBuildings(): Building[] {
    return [...this.buildings];
  }

  public getBuildingById(id: string): Building | undefined {
    return this.buildings.find(b => b.id === id);
  }

  public getKPIs(): CampusKPIs {
    return { ...this.kpis };
  }

  public getCampusHealth(): CampusHealthScore {
    return { ...this.healthScore };
  }

  public getSustainabilityScore(): SustainabilityScore {
    return { ...this.sustainabilityScore };
  }

  public getAnomalies(): AnomalyItem[] {
    return [...this.anomalies];
  }

  public getPredictions(): PredictionItem[] {
    return [...this.predictions];
  }

  public getActivities(): ActivityFeedItem[] {
    return [...this.activities];
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getInsights(): AiInsight[] {
    return [...this.insights];
  }

  public getSensors(): Sensor[] {
    return [...this.sensors];
  }

  public getDataSourceMode(): 'live' | 'demo' {
    return this.dataSourceMode;
  }

  public setDataSourceMode(mode: 'live' | 'demo'): void {
    this.dataSourceMode = mode;
    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: `Telemetry mode switched to ${mode.toUpperCase()} DATA`,
      time: 'Just now',
      type: 'maintenance',
      severity: 'normal',
    });
    this.notify();
  }

  public isLiveSimulationActive(): boolean {
    return this.isSimulating;
  }

  public toggleSimulation(): boolean {
    if (this.isSimulating) {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
      }
      this.isSimulating = false;
    } else {
      this.startSimulation();
      this.isSimulating = true;
    }
    this.notify();
    return this.isSimulating;
  }

  // --- SENSOR CRUD (PART 11) ---
  public addSensor(newSensor: Omit<Sensor, 'id' | 'lastPing'>): Sensor {
    const id = `SNS-${String(this.sensors.length + 1).padStart(4, '0')}`;
    const created: Sensor = {
      ...newSensor,
      id,
      lastPing: 'Just now',
    };
    this.sensors.unshift(created);

    // Update building sensorsCount
    const b = this.buildings.find(item => item.id === newSensor.buildingId);
    if (b) {
      b.sensorsCount += 1;
    }

    this.activities.unshift({
      id: `act-${Date.now()}`,
      title: `Registered new IoT sensor: ${created.name} (${created.protocol})`,
      time: 'Just now',
      type: 'maintenance',
      severity: 'normal',
      buildingName: created.buildingName,
    });

    this.notify();
    return created;
  }

  public updateSensor(id: string, updates: Partial<Sensor>): void {
    const sensor = this.sensors.find(s => s.id === id);
    if (sensor) {
      Object.assign(sensor, updates);
      sensor.lastPing = 'Just now';
      this.notify();
    }
  }

  public deleteSensor(id: string): void {
    const idx = this.sensors.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.sensors.splice(idx, 1)[0];
      const b = this.buildings.find(item => item.id === removed.buildingId);
      if (b) {
        b.sensorsCount = Math.max(0, b.sensorsCount - 1);
      }
      this.activities.unshift({
        id: `act-${Date.now()}`,
        title: `Decommissioned sensor node ${id}`,
        time: 'Just now',
        type: 'maintenance',
        severity: 'normal',
        buildingName: removed.buildingName,
      });
      this.notify();
    }
  }

  // --- ALERTS RESOLVE & DISMISS (PART 6) ---
  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      const now = new Date();
      alert.resolvedAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const building = this.buildings.find(b => b.id === alert.buildingId);
      if (building) {
        building.activeAlertsCount = Math.max(0, building.activeAlertsCount - 1);
        if (building.activeAlertsCount === 0) {
          building.status = 'normal';
        }
      }

      this.activities.unshift({
        id: `act-${Date.now()}`,
        title: `Resolved incident: ${alert.title}`,
        time: 'Just now',
        type: 'maintenance',
        severity: 'normal',
        buildingName: alert.buildingName,
      });

      this.notify();
    }
  }

  public dismissAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'dismissed';
      const building = this.buildings.find(b => b.id === alert.buildingId);
      if (building) {
        building.activeAlertsCount = Math.max(0, building.activeAlertsCount - 1);
      }
      this.notify();
    }
  }

  // --- ANOMALY MITIGATION (PART 5) ---
  public mitigateAnomaly(anomalyId: string): void {
    const anomaly = this.anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      anomaly.status = 'mitigated';
      this.activities.unshift({
        id: `act-${Date.now()}`,
        title: `Mitigation deployed for anomaly: ${anomaly.title}`,
        time: 'Just now',
        type: 'ai',
        severity: 'normal',
        buildingName: anomaly.buildingName,
      });
      this.notify();
    }
  }

  public applyInsightAction(insightId: string): void {
    const insight = this.insights.find(i => i.id === insightId);
    if (insight) {
      insight.actionStatus = 'completed';
      this.activities.unshift({
        id: `act-${Date.now()}`,
        title: `Automated Action Applied: ${insight.recommendedAction}`,
        time: 'Just now',
        type: 'ai',
        severity: 'normal',
        buildingName: insight.affectedArea,
      });
      this.notify();
    }
  }

  // --- REALISTIC SMOOTH SIMULATION (PART 14) ---
  // Small micro-fluctuations (180 -> 183 -> 185 -> 184)
  private startSimulation(): void {
    if (typeof window === 'undefined') return;
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = window.setInterval(() => {
      // Small delta for energy ±1 to 2 kWh
      const energyDelta = (Math.random() - 0.49) * 2;
      this.kpis.energy.currentKwh = Math.round(Math.max(165, Math.min(215, this.kpis.energy.currentKwh + energyDelta)));
      this.kpis.energy.todayTotalKwh += 1;

      // Small delta for water ±1 to 3 L/min
      const waterDelta = (Math.random() - 0.49) * 3;
      this.kpis.water.currentLpm = Math.round(Math.max(400, Math.min(460, this.kpis.water.currentLpm + waterDelta)));

      // Small delta for crowd ±1 to 3 persons
      const crowdDelta = Math.floor((Math.random() - 0.49) * 3);
      this.kpis.crowd.currentPopulation = Math.max(2050, Math.min(2350, this.kpis.crowd.currentPopulation + crowdDelta));

      // Synchronize buildings without giant jumps
      const bBlockB = this.buildings.find(b => b.id === 'b-cs');
      if (bBlockB) {
        bBlockB.energyUsage = Math.round((42.0 + (Math.random() - 0.5) * 0.6) * 10) / 10;
      }

      this.notify();
    }, 3800);
  }

  // --- AI NATURAL LANGUAGE AGENT (PART 10) ---
  public queryCampusKnowledge(question: string): string {
    const q = question.toLowerCase();

    if (q.includes('most electricity') || q.includes('highest energy') || q.includes('uses the most')) {
      const sorted = [...this.buildings].sort((a, b) => b.energyUsage - a.energyUsage);
      const top = sorted[0];
      return `Currently, **${top.name}** is consuming the most electricity at **${top.energyUsage} kWh** (nominally 34 kWh). This represents a **+23% spike** driven by GPU laboratory training in the Department of Informatics and chilled water pump #2.`;
    }

    if (q.includes('block b') && (q.includes('alert') || q.includes('warning') || q.includes('showing'))) {
      return `**Block B (Computer Engineering Block)** has 1 active Warning alert:\n• **Metric**: Power draw is **42.0 kWh** (Normal baseline: 34.1 kWh, deviation **+23.4%**).\n• **Root Cause**: Chilled water pump #2 and server rack cooling circuits are running at peak velocity.\n• **Recommended Action**: Rebalance the HVAC supply setpoint to 23.5°C Eco Mode to reduce demand by ~35 kWh.`;
    }

    if (q.includes('peak crowd') || q.includes('predict today') || q.includes('crowd')) {
      return `CITYOS crowd analytics predicts today's peak campus population will reach **${this.kpis.crowd.peakOccupancyPct}% (~2,750 attendees)** between **12:45 PM and 1:30 PM**.\n• **Hotspot**: The **Student Dining Hall & Canteen** will peak at **94% capacity**.\n• **Mitigation**: Staggering laboratory dismissal intervals and opening covered terrace seating is recommended.`;
    }

    if (q.includes('highest water') || q.includes('most water') || q.includes('water consumption')) {
      const sorted = [...this.buildings].sort((a, b) => b.waterUsage - a.waterUsage);
      const top = sorted[0];
      return `**${top.name}** has the highest water consumption on campus at **${top.waterUsage} L/min**, followed by the Science & Biotechnology Complex at **72.0 L/min**. Hostel A is currently under critical monitoring due to an active pressure drop down to 18.2 PSI.`;
    }

    if (q.includes('reduce') || q.includes('save') || q.includes('energy usage')) {
      return `To immediately reduce today's energy demand:\n1. **Auto-balance Block B HVAC**: Lower chiller staging on pump #2 (saves ~185 kWh/day).\n2. **Rooftop Solar Arbitrage**: Channel 138 kW peak generation from the Renewable Energy Hub into Battery Bank B-2.\n3. **Central Library Eco Mode**: Transition 3rd floor quiet study lighting to ambient daylight harvesting.`;
    }

    if (q.includes('critical alert') || q.includes('critical') || q.includes('show me alerts')) {
      const activeCritical = this.alerts.filter(a => a.status === 'active' && a.severity === 'critical');
      if (activeCritical.length === 0) {
        return `There are currently **0 critical alerts** active across the campus. All primary systems are within normal envelopes.`;
      }
      return `There is currently **${activeCritical.length} critical alert** active:\n• 🔴 **${activeCritical[0].title}** in **${activeCritical[0].buildingName}**\n• Measured value: **${activeCritical[0].currentValue}** (Normal: ${activeCritical[0].expectedValue})\n• Recommended action: "${activeCritical[0].recommendedAction}"`;
    }

    if (q.includes('attention') || q.includes('immediate') || q.includes('areas require')) {
      return `Two priority areas currently require immediate operator attention:\n1. 🔴 **Hostel Block A**: Water riser pressure at 18.2 PSI (Baseline 54 PSI). Joint cavitation suspected.\n2. 🟡 **Computer Engineering Block (Block B)**: Electricity usage is +23.4% above normal diurnal envelope.`;
    }

    return `CITYOS Operating System status:\n• Campus Health Score: **${this.healthScore.overall}/100**\n• Sustainability Score: **${this.sustainabilityScore.overall}/100** (+${this.sustainabilityScore.improvementPct}% vs last month)\n• Live energy draw: **${this.kpis.energy.currentKwh} kWh** · Water: **${this.kpis.water.currentLpm} L/min**\n• Active IoT nodes: **${this.sensors.filter(s => s.status === 'online').length} online** of 248 total.`;
  }

  public exportTelemetryCSV(): void {
    const headers = ['SensorID', 'Name', 'Building', 'Type', 'Value', 'Unit', 'Status', 'Protocol', 'Location', 'LastPing'];
    const rows = this.sensors.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.buildingName}"`,
      s.type,
      s.value,
      s.unit,
      s.status,
      s.protocol,
      `"${s.location}"`,
      `"${s.lastPing}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CITYOS_Campus_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const campusService = new CampusService();
