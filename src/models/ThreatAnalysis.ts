import mongoose, { Document, Schema } from 'mongoose';

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

const ThreatAnalysisSchema = new Schema<IThreatAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['log_analysis', 'behavioral_analysis', 'real_time_monitoring'],
    required: true
  },
  sourceData: {
    type: {
      type: String,
      enum: ['file', 'api', 'manual'],
      required: true
    },
    filename: String,
    size: Number,
    uploadPath: String
  },
  threats: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['insider_threat', 'suspicious_login', 'access_anomaly', 'data_exfiltration', 'privilege_escalation'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    affectedUser: String,
    affectedSystem: String,
    timestamp: {
      type: Date,
      required: true
    },
    indicators: [String],
    aiInsights: {
      type: String,
      required: true
    },
    suggestedActions: [String]
  }],
  summary: {
    totalThreats: {
      type: Number,
      default: 0
    },
    highRiskThreats: {
      type: Number,
      default: 0
    },
    mediumRiskThreats: {
      type: Number,
      default: 0
    },
    lowRiskThreats: {
      type: Number,
      default: 0
    },
    aiConfidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    processingTime: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  errorMessage: String
}, {
  timestamps: true
});

// Index for faster queries
ThreatAnalysisSchema.index({ userId: 1, createdAt: -1 });
ThreatAnalysisSchema.index({ 'threats.severity': 1 });
ThreatAnalysisSchema.index({ status: 1 });

export default mongoose.model<IThreatAnalysis>('ThreatAnalysis', ThreatAnalysisSchema);