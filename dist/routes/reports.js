"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ThreatAnalysis_1 = __importDefault(require("../models/ThreatAnalysis"));
const MalwareScan_1 = __importDefault(require("../models/MalwareScan"));
const router = express_1.default.Router();
// Generate comprehensive report
router.get('/generate', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const reportType = req.query.type || 'comprehensive';
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        // Get threat analysis data
        const threatAnalyses = await ThreatAnalysis_1.default.find({
            userId,
            createdAt: { $gte: startDate }
        }).sort({ createdAt: -1 });
        // Get malware scan data
        const malwareScans = await MalwareScan_1.default.find({
            userId,
            createdAt: { $gte: startDate }
        }).sort({ createdAt: -1 });
        // Calculate threat statistics
        const threatStats = {
            totalAnalyses: threatAnalyses.length,
            totalThreats: threatAnalyses.reduce((sum, analysis) => sum + analysis.threats.length, 0),
            severityBreakdown: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            },
            typeBreakdown: {}
        };
        threatAnalyses.forEach(analysis => {
            analysis.threats.forEach(threat => {
                threatStats.severityBreakdown[threat.severity]++;
                threatStats.typeBreakdown[threat.type] = (threatStats.typeBreakdown[threat.type] || 0) + 1;
            });
        });
        // Calculate malware statistics
        const malwareStats = {
            totalScans: malwareScans.length,
            infectedFiles: malwareScans.filter(scan => scan.scanResults.isInfected).length,
            cleanFiles: malwareScans.filter(scan => !scan.scanResults.isInfected).length,
            malwareTypes: {},
            severityBreakdown: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            }
        };
        malwareScans.forEach(scan => {
            if (scan.scanResults.isInfected && scan.scanResults.malwareType) {
                malwareStats.malwareTypes[scan.scanResults.malwareType] =
                    (malwareStats.malwareTypes[scan.scanResults.malwareType] || 0) + 1;
                malwareStats.severityBreakdown[scan.scanResults.severity]++;
            }
        });
        // Get recent high-priority alerts
        const recentAlerts = threatAnalyses
            .flatMap(analysis => analysis.threats
            .filter(threat => threat.severity === 'high' || threat.severity === 'critical')
            .map(threat => ({
            id: threat.id,
            type: threat.type,
            severity: threat.severity,
            description: threat.description,
            timestamp: threat.timestamp,
            analysisId: analysis._id
        })))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20);
        // Generate recommendations based on findings
        const recommendations = generateRecommendations(threatStats, malwareStats);
        const report = {
            reportMetadata: {
                generatedAt: new Date(),
                reportType,
                period: `${days} days`,
                startDate,
                endDate: new Date(),
                generatedBy: req.user.username
            },
            executiveSummary: {
                overallRiskLevel: calculateOverallRiskLevel(threatStats, malwareStats),
                keyFindings: generateKeyFindings(threatStats, malwareStats),
                criticalIssues: recentAlerts.filter(alert => alert.severity === 'critical').length,
                recommendationCount: recommendations.length
            },
            threatAnalysis: {
                statistics: threatStats,
                topThreats: Object.entries(threatStats.typeBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => ({ type, count })),
                recentAlerts
            },
            malwareAnalysis: {
                statistics: malwareStats,
                topMalwareTypes: Object.entries(malwareStats.malwareTypes)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => ({ type, count }))
            },
            recommendations,
            appendices: {
                detailedThreatList: threatAnalyses.slice(0, 50), // Limit for performance
                detailedMalwareList: malwareScans.slice(0, 50)
            }
        };
        res.json(report);
    }
    catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});
// Get available report templates
router.get('/templates', auth_1.authenticate, (req, res) => {
    const templates = [
        {
            id: 'comprehensive',
            name: 'Comprehensive Security Report',
            description: 'Complete analysis of threats and malware with detailed statistics',
            sections: ['Executive Summary', 'Threat Analysis', 'Malware Analysis', 'Recommendations']
        },
        {
            id: 'threat-focused',
            name: 'Threat Analysis Report',
            description: 'Detailed analysis focusing on insider threats and behavioral anomalies',
            sections: ['Threat Analysis', 'Risk Assessment', 'Mitigation Strategies']
        },
        {
            id: 'malware-focused',
            name: 'Malware Detection Report',
            description: 'Comprehensive malware analysis and infection statistics',
            sections: ['Malware Statistics', 'Infection Trends', 'Quarantine Actions']
        },
        {
            id: 'executive',
            name: 'Executive Summary Report',
            description: 'High-level overview for management and stakeholders',
            sections: ['Executive Summary', 'Key Metrics', 'Strategic Recommendations']
        }
    ];
    res.json(templates);
});
// Get report history
router.get('/history', auth_1.authenticate, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // In a real implementation, you would store report generation history
        // For now, we'll return mock data based on user's analyses
        const userId = req.user._id;
        const recentAnalyses = await ThreatAnalysis_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('analysisType summary createdAt');
        const reportHistory = recentAnalyses.map(analysis => ({
            id: analysis._id,
            name: `${analysis.analysisType} Report`,
            type: 'threat-analysis',
            generatedAt: analysis.createdAt,
            status: 'completed',
            fileSize: Math.floor(Math.random() * 500 + 100) + 'KB' // Mock file size
        }));
        res.json({
            reports: reportHistory,
            pagination: {
                page,
                limit,
                total: recentAnalyses.length,
                hasMore: recentAnalyses.length === limit
            }
        });
    }
    catch (error) {
        console.error('Report history error:', error);
        res.status(500).json({ message: 'Error fetching report history' });
    }
});
// Helper functions
function calculateOverallRiskLevel(threatStats, malwareStats) {
    const criticalThreats = threatStats.severityBreakdown.critical;
    const highThreats = threatStats.severityBreakdown.high;
    const criticalMalware = malwareStats.severityBreakdown.critical;
    const highMalware = malwareStats.severityBreakdown.high;
    const totalCritical = criticalThreats + criticalMalware;
    const totalHigh = highThreats + highMalware;
    if (totalCritical > 0)
        return 'Critical';
    if (totalHigh > 5)
        return 'High';
    if (totalHigh > 0)
        return 'Medium';
    return 'Low';
}
function generateKeyFindings(threatStats, malwareStats) {
    const findings = [];
    if (threatStats.severityBreakdown.critical > 0) {
        findings.push(`${threatStats.severityBreakdown.critical} critical security threats detected`);
    }
    if (malwareStats.infectedFiles > 0) {
        findings.push(`${malwareStats.infectedFiles} malware-infected files identified`);
    }
    const topThreatType = Object.entries(threatStats.typeBreakdown)
        .sort(([, a], [, b]) => b - a)[0];
    if (topThreatType) {
        findings.push(`Most common threat type: ${topThreatType[0]} (${topThreatType[1]} incidents)`);
    }
    if (malwareStats.totalScans > 0) {
        const infectionRate = (malwareStats.infectedFiles / malwareStats.totalScans * 100).toFixed(1);
        findings.push(`File infection rate: ${infectionRate}%`);
    }
    return findings;
}
function generateRecommendations(threatStats, malwareStats) {
    const recommendations = [];
    if (threatStats.severityBreakdown.critical > 0) {
        recommendations.push({
            priority: 'Critical',
            category: 'Incident Response',
            recommendation: 'Immediate investigation of critical threats required. Activate incident response protocol.'
        });
    }
    if (malwareStats.infectedFiles > 0) {
        recommendations.push({
            priority: 'High',
            category: 'Malware Protection',
            recommendation: 'Review and update antivirus definitions. Consider network segmentation for infected systems.'
        });
    }
    if (threatStats.typeBreakdown.insider_threat > 0) {
        recommendations.push({
            priority: 'High',
            category: 'Access Control',
            recommendation: 'Implement enhanced monitoring for insider threat detection. Review user access privileges.'
        });
    }
    if (threatStats.typeBreakdown.suspicious_login > 0) {
        recommendations.push({
            priority: 'Medium',
            category: 'Authentication',
            recommendation: 'Consider implementing multi-factor authentication and geolocation-based access controls.'
        });
    }
    recommendations.push({
        priority: 'Medium',
        category: 'Security Training',
        recommendation: 'Conduct regular security awareness training for all employees.'
    });
    recommendations.push({
        priority: 'Low',
        category: 'Monitoring',
        recommendation: 'Establish regular security monitoring and reporting schedules.'
    });
    return recommendations;
}
exports.default = router;
//# sourceMappingURL=reports.js.map