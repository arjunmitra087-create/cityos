export type SystemStatus = 'normal' | 'warning' | 'critical';

export interface Building {
  id: string;
  name: string;
  shortName: string;
  category: 'Academic' | 'Administrative' | 'Residential' | 'Recreational' | 'Utility';
  status: SystemStatus;
  occupancy: number; // percentage
  headcount: number;
  maxCapacity: number;
  energyUsage: number; // kWh
  waterUsage: number; // L/min
  temperature: number; // °C
  humidity: number; // %
  noise: number; // dB
  aqi: number;
  co2: number; // ppm
  activeAlertsCount: number;
  coordinates: { x: number; z: number }; // 3D coordinates
  dimensions: { width: number; height: number; depth: number };
  color: string;
  aiPrediction: string;
  recommendedAction?: string;
  sensorsCount: number;
  lastUpdated: string;
}

export interface Sensor {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  type: 'Energy' | 'Water' | 'Temperature' | 'Humidity' | 'AQI' | 'Noise' | 'Occupancy' | 'Parking';
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning' | 'calibrating';
  location: string;
  protocol: 'LoRaWAN' | 'BACnet/IP' | 'MQTT' | 'Modbus';
  batteryLevel?: number;
  lastPing: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  buildingId: string;
  buildingName: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'Energy' | 'Water' | 'Safety' | 'Environment' | 'HVAC' | 'Crowd';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  assignedTo?: string;
  currentValue?: string;
  expectedValue?: string;
  metricValue?: string;
  aiExplanation?: string;
  recommendedAction?: string;
  resolvedAt?: string;
}

export interface PredictionMetric {
  timestamp: string;
  historical?: number;
  predicted?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

export interface AnomalyItem {
  id: string;
  title: string;
  metricType: 'Energy' | 'Water' | 'Temperature' | 'Noise' | 'Crowd' | 'Parking';
  buildingId: string;
  buildingName: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  normalRange: string;
  currentValue: string;
  deviationPct: number;
  possibleCause: string;
  recommendedAction: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'mitigated';
}

export interface AiInsight {
  id: string;
  title: string;
  description: string;
  category: 'Energy' | 'Crowd' | 'Water' | 'Environment' | 'Waste' | 'Grid';
  severity: 'critical' | 'warning' | 'info';
  confidence: number; // 0-100%
  detectedTime: string;
  affectedArea: string;
  recommendedAction: string;
  actionStatus: 'pending' | 'in-progress' | 'completed';
  potentialSavings?: string;
}

export interface PredictionItem {
  id: string;
  domain: 'Energy' | 'Crowd' | 'Water' | 'Parking' | 'Waste';
  headline: string;
  targetEntity: string;
  timeHorizon: string;
  projectedPeakTime: string;
  projectedPeakValue: string;
  expectedChange: string;
  confidencePct: number;
  explanation: string;
  recommendedMitigation: string;
}

export interface CampusHealthScore {
  overall: number; // e.g. 92/100
  energyEfficiency: number; // 88%
  waterEfficiency: number; // 94%
  wasteManagement: number; // 81%
  environmentQuality: number; // 90%
}

export interface SustainabilityScore {
  overall: number; // e.g. 86/100
  lastMonth: number; // 79
  improvementPct: number; // +8.9%
  energyEfficiency: number; // 85
  waterConservation: number; // 88
  wasteReduction: number; // 82
  recyclingRate: number; // 71
  environmentalQuality: number; // 91
}

export interface ActivityFeedItem {
  id: string;
  title: string;
  time: string;
  type: 'energy' | 'water' | 'crowd' | 'parking' | 'ai' | 'waste' | 'maintenance';
  severity: 'normal' | 'warning' | 'critical';
  buildingName?: string;
}

export interface CampusKPIs {
  energy: {
    currentKwh: number;
    todayTotalKwh: number;
    trend: number; // e.g. -8.4%
    status: 'normal' | 'warning' | 'critical';
  };
  water: {
    currentLpm: number;
    todayTotalL: number;
    trend: number; // e.g. -5.2%
    status: 'normal' | 'warning' | 'critical';
  };
  crowd: {
    currentPopulation: number;
    peakOccupancyPct: number;
    status: 'low' | 'moderate' | 'high';
  };
  waste: {
    todayWasteKg: number;
    recyclingRatePct: number;
    trend: number; // e.g. -11.7%
    status: 'good' | 'warning';
  };
  parking: {
    occupiedPct: number;
    availableSpaces: number;
    totalSpaces: number;
  };
  environment: {
    temperature: number;
    aqi: number;
    noiseDb: number;
    humidity: number;
  };
}

export type ViewTab =
  | 'overview'
  | 'digital-twin'
  | 'energy'
  | 'water'
  | 'waste'
  | 'crowd'
  | 'parking'
  | 'environment'
  | 'insights'
  | 'predictions'
  | 'anomalies'
  | 'alerts'
  | 'analytics'
  | 'heatmaps'
  | 'building-analytics'
  | 'sustainability'
  | 'monitoring'
  | 'sensors'
  | 'reports'
  | 'about'
  | 'settings';
