"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ThreatAnalysisSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('ThreatAnalysis', ThreatAnalysisSchema);
//# sourceMappingURL=ThreatAnalysis.js.map