import { Threat, ThreatLevel, MalwareResult, SystemLog, DashboardStats, ChartData } from '../types';

// AI-generated threat patterns and data
const usernames = [
  'john.doe', 'sarah.smith', 'mike.johnson', 'emma.wilson', 'david.brown',
  'lisa.anderson', 'mark.taylor', 'jennifer.lee', 'robert.garcia', 'amy.davis',
  'chris.martinez', 'jessica.rodriguez', 'daniel.thompson', 'michelle.white',
  'kevin.lopez', 'stephanie.clark', 'ryan.lewis', 'nicole.walker', 'brandon.hall'
];

const suspiciousActions = [
  'Unusual file access after hours',
  'Multiple failed login attempts',
  'Large data download detected',
  'Access to restricted directory',
  'Suspicious email attachment opened',
  'Abnormal network traffic pattern',
  'Unauthorized software installation',
  'USB device connected outside policy',
  'Database query anomaly detected',
  'Privilege escalation attempt',
  'Unusual geographic login location',
  'Mass file deletion detected',
  'Encrypted file transfer initiated',
  'Administrative account misuse',
  'Suspicious API calls detected'
];

const malwareTypes = [
  'Trojan Horse', 'Ransomware', 'Spyware', 'Adware', 'Rootkit',
  'Keylogger', 'Worm', 'Virus', 'Browser Hijacker', 'Backdoor',
  'Cryptominer', 'Botnet Agent', 'Zero-day Exploit', 'Fileless Malware'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Moscow, Russia', 'Beijing, China',
  'London, UK', 'Tokyo, Japan', 'Berlin, Germany'
];

const deviceTypes = ['Windows Desktop', 'MacBook Pro', 'iPhone', 'Android Phone', 'Linux Server', 'iPad'];

const generateIP = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateThreatLevel = (): ThreatLevel => {
  const rand = Math.random();
  if (rand < 0.6) {
    return { level: 'low', score: Math.floor(Math.random() * 30) + 10, color: '#5CB85C' };
  } else if (rand < 0.85) {
    return { level: 'medium', score: Math.floor(Math.random() * 30) + 40, color: '#F0AD4E' };
  } else {
    return { level: 'high', score: Math.floor(Math.random() * 30) + 70, color: '#D9534F' };
  }
};

const generateAIDescription = (action: string, confidence: number): string => {
  const patterns = [
    `AI detected anomalous behavior pattern. Confidence: ${confidence}%`,
    `Machine learning algorithm flagged this activity as suspicious based on historical patterns`,
    `Behavioral analysis indicates potential insider threat with ${confidence}% certainty`,
    `Deep learning model identified deviation from normal user behavior baseline`,
    `Neural network classification suggests elevated risk based on time and access patterns`,
    `Predictive model indicates potential security breach with high probability`,
    `Advanced analytics detected unusual data access pattern inconsistent with role`
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
};

export const generateThreats = (count: number = 10): Threat[] => {
  const threats: Threat[] = [];
  
  for (let i = 0; i < count; i++) {
    const riskLevel = generateThreatLevel();
    const aiConfidence = Math.floor(Math.random() * 40) + 60; // 60-99%
    const action = suspiciousActions[Math.floor(Math.random() * suspiciousActions.length)];
    
    threats.push({
      id: `threat-${Date.now()}-${i}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      ip: generateIP(),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
      action,
      riskLevel,
      description: generateAIDescription(action, aiConfidence),
      aiConfidence,
      location: locations[Math.floor(Math.random() * locations.length)],
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
    });
  }
  
  return threats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateMalwareResults = (count: number = 5): MalwareResult[] => {
  const results: MalwareResult[] = [];
  const fileNames = [
    'document.pdf.exe', 'invoice_2024.docx', 'setup.exe', 'update.bat',
    'photo.jpg.scr', 'report.xlsx', 'video.mp4', 'software.zip',
    'backup.tar.gz', 'config.ini', 'data.csv', 'presentation.pptx'
  ];
  
  for (let i = 0; i < count; i++) {
    const hasMalware = Math.random() < 0.3; // 30% chance of malware
    const severity = hasMalware ? generateThreatLevel() : { level: 'low' as const, score: 0, color: '#5CB85C' };
    const fileName = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    const threats = hasMalware ? [
      malwareTypes[Math.floor(Math.random() * malwareTypes.length)],
      ...(Math.random() < 0.3 ? [malwareTypes[Math.floor(Math.random() * malwareTypes.length)]] : [])
    ] : [];
    
    results.push({
      id: `scan-${Date.now()}-${i}`,
      fileName,
      fileSize: Math.floor(Math.random() * 10000000) + 1000, // 1KB to 10MB
      malwareType: hasMalware ? threats[0] : null,
      severity,
      scanTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
      threats,
      quarantined: hasMalware && severity.level !== 'low',
      aiAnalysis: hasMalware 
        ? `Advanced AI analysis detected ${threats.length} threat(s). Pattern matching with known malware signatures shows ${Math.floor(Math.random() * 30) + 70}% similarity to known ${threats[0]} variants.`
        : 'AI analysis shows no malicious patterns. File behavior and signature analysis indicate safe content.'
    });
  }
  
  return results.sort((a, b) => b.scanTime.getTime() - a.scanTime.getTime());
};

export const generateSystemLogs = (count: number = 20): SystemLog[] => {
  const logs: SystemLog[] = [];
  const sources = [
    'Authentication Service', 'File Monitor', 'Network Scanner', 'Malware Engine',
    'User Activity Monitor', 'Database Auditor', 'Email Security', 'Firewall',
    'Intrusion Detection', 'Data Loss Prevention', 'Endpoint Security'
  ];
  
  const messages = {
    info: [
      'System scan completed successfully',
      'User logged in from authorized location',
      'Scheduled backup completed',
      'Security patch applied',
      'Database maintenance completed',
      'Regular security check passed'
    ],
    warning: [
      'Unusual login time detected',
      'High CPU usage detected',
      'Multiple file access attempts',
      'Network traffic anomaly',
      'Disk space running low',
      'Suspicious user behavior pattern'
    ],
    error: [
      'Failed authentication attempt',
      'Access denied to restricted resource',
      'Malware signature update failed',
      'Network connection timeout',
      'File quarantine failed',
      'Service unavailable'
    ],
    critical: [
      'Security breach detected',
      'Malware found in system',
      'Unauthorized admin access',
      'Data exfiltration attempt',
      'System compromise detected',
      'Emergency shutdown initiated'
    ]
  };
  
  for (let i = 0; i < count; i++) {
    const levels = ['info', 'warning', 'error', 'critical'] as const;
    const weights = [0.5, 0.3, 0.15, 0.05]; // Distribution of log levels
    let level: typeof levels[number];
    
    const rand = Math.random();
    if (rand < weights[0]) level = 'info';
    else if (rand < weights[0] + weights[1]) level = 'warning';
    else if (rand < weights[0] + weights[1] + weights[2]) level = 'error';
    else level = 'critical';
    
    const messageList = messages[level];
    
    logs.push({
      id: `log-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
      level,
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messageList[Math.floor(Math.random() * messageList.length)],
      user: Math.random() < 0.7 ? usernames[Math.floor(Math.random() * usernames.length)] : undefined,
      ip: Math.random() < 0.6 ? generateIP() : undefined
    });
  }
  
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateDashboardStats = (): DashboardStats => {
  return {
    totalScans: Math.floor(Math.random() * 10000) + 50000,
    threatsFound: Math.floor(Math.random() * 500) + 1200,
    malwareCount: Math.floor(Math.random() * 50) + 150,
    systemHealth: Math.floor(Math.random() * 20) + 80, // 80-100%
    activeMonitoring: true,
    lastScanTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000) // Last hour
  };
};

export const generateRiskChart = (): ChartData => {
  const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'];
  const data = [
    Math.floor(Math.random() * 30) + 50, // Low: 50-80
    Math.floor(Math.random() * 20) + 15, // Medium: 15-35
    Math.floor(Math.random() * 10) + 5,  // High: 5-15
    Math.floor(Math.random() * 5) + 1    // Critical: 1-6
  ];
  
  return {
    labels: riskLevels,
    datasets: [{
      label: 'Threat Distribution',
      data,
      backgroundColor: ['#5CB85C', '#F0AD4E', '#D9534F', '#8B0000'],
      borderColor: ['#4CAF50', '#FF9800', '#F44336', '#660000']
    }]
  };
};

export const generateThreatTrendChart = (): ChartData => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
  
  return {
    labels: last7Days,
    datasets: [{
      label: 'Threats Detected',
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5),
      backgroundColor: ['#2E89C1'],
      borderColor: ['#1976D2']
    }]
  };
};