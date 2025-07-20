import mongoose, { Document } from 'mongoose';
export interface IThreatAnalysis extends Document {
    userId: mongoose.Types.ObjectId;
    analysisType: 'log_analysis' | 'behavioral_analysis' | 'real_time_monitoring';
    sourceData: {
        type: 'file' | 'api' | 'manual';
        filename?: string;
        size?: number;
        uploadPath?: string;
    };
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
    status: 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=ThreatAnalysis.d.ts.map