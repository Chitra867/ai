export interface ThreatLevel {
  level: 'low' | 'medium' | 'high';
  score: number;
  color: string;
}

export interface Threat {
  id: string;
  username: string;
  ip: string;
  timestamp: Date;
  action: string;
  riskLevel: ThreatLevel;
  description: string;
  aiConfidence: number;
  location?: string;
  deviceType?: string;
}

export interface MalwareResult {
  id: string;
  fileName: string;
  fileSize: number;
  malwareType: string | null;
  severity: ThreatLevel;
  scanTime: Date;
  threats: string[];
  quarantined: boolean;
  aiAnalysis: string;
}

export interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  user?: string;
  ip?: string;
}

export interface DashboardStats {
  totalScans: number;
  threatsFound: number;
  malwareCount: number;
  systemHealth: number;
  activeMonitoring: boolean;
  lastScanTime: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export interface UserSettings {
  emailNotifications: boolean;
  aiSuggestions: boolean;
  dataRetentionDays: number;
  apiKey: string;
  autoQuarantine: boolean;
  realTimeScanning: boolean;
}