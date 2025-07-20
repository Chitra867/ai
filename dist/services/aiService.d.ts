export interface ThreatDetectionResult {
    threats: Array<{
        id: string;
        type: 'insider_threat' | 'suspicious_login' | 'access_anomaly' | 'data_exfiltration' | 'privilege_escalation';
        severity: 'low' | 'medium' | 'high' | 'critical';
        confidence: number;
        description: string;
        affectedUser?: string;
        affectedSystem?: string;
        timestamp: Date;
        indicators: string[];
        aiInsights: string;
        suggestedActions: string[];
    }>;
    summary: {
        totalThreats: number;
        highRiskThreats: number;
        mediumRiskThreats: number;
        lowRiskThreats: number;
        aiConfidenceScore: number;
        processingTime: number;
    };
}
export interface MalwareAnalysisResult {
    isInfected: boolean;
    malwareType?: 'virus' | 'trojan' | 'worm' | 'ransomware' | 'spyware' | 'adware' | 'rootkit' | 'backdoor';
    malwareName?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    aiAnalysis: string;
    detectionMethods: string[];
    signatures: Array<{
        name: string;
        type: string;
        confidence: number;
    }>;
    behaviorAnalysis: {
        suspiciousActivities: string[];
        networkConnections: string[];
        fileModifications: string[];
        registryChanges: string[];
    };
    suggestedActions: string[];
}
declare class AIService {
    private generateThreatId;
    private getRandomElement;
    private generateRandomConfidence;
    analyzeThreatLogs(logData: string): Promise<ThreatDetectionResult>;
    analyzeMalwareFile(filePath: string, fileHash: {
        md5: string;
        sha1: string;
        sha256: string;
    }): Promise<MalwareAnalysisResult>;
    private generateThreatDescription;
    private generateThreatIndicators;
    private generateAIInsights;
    private generateSuggestedActions;
    private generateMalwareName;
    private generateMalwareAnalysis;
    private generateMalwareSignatures;
    private generateSuspiciousActivities;
    private generateNetworkConnections;
    private generateFileModifications;
    private generateRegistryChanges;
    private generateMalwareSuggestedActions;
}
declare const _default: AIService;
export default _default;
//# sourceMappingURL=aiService.d.ts.map