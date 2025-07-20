"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ThreatAnalysis_1 = __importDefault(require("../models/ThreatAnalysis"));
const aiService_1 = __importDefault(require("../services/aiService"));
const router = express_1.default.Router();
// Analyze threat logs
router.post('/analyze', auth_1.authenticate, async (req, res) => {
    try {
        const { logData, analysisType = 'log_analysis' } = req.body;
        if (!logData) {
            return res.status(400).json({ message: 'Log data is required' });
        }
        // Create initial analysis record
        const analysis = new ThreatAnalysis_1.default({
            userId: req.user._id,
            analysisType,
            sourceData: {
                type: 'manual',
                size: logData.length
            },
            status: 'processing'
        });
        await analysis.save();
        // Start AI analysis in background
        setImmediate(async () => {
            try {
                const result = await aiService_1.default.analyzeThreatLogs(logData);
                analysis.threats = result.threats;
                analysis.summary = result.summary;
                analysis.status = 'completed';
                await analysis.save();
            }
            catch (error) {
                console.error('AI analysis error:', error);
                analysis.status = 'failed';
                analysis.errorMessage = 'AI analysis failed';
                await analysis.save();
            }
        });
        res.status(202).json({
            message: 'Analysis started',
            analysisId: analysis._id,
            status: 'processing'
        });
    }
    catch (error) {
        console.error('Threat analysis error:', error);
        res.status(500).json({ message: 'Error starting threat analysis' });
    }
});
// Get all threat analyses
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const analyses = await ThreatAnalysis_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-threats'); // Exclude detailed threats for list view
        const total = await ThreatAnalysis_1.default.countDocuments({ userId });
        res.json({
            analyses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get threat analyses error:', error);
        res.status(500).json({ message: 'Error fetching threat analyses' });
    }
});
// Get specific threat analysis
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const analysis = await ThreatAnalysis_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json(analysis);
    }
    catch (error) {
        console.error('Get threat analysis error:', error);
        res.status(500).json({ message: 'Error fetching threat analysis' });
    }
});
// Get threat analysis status
router.get('/:id/status', auth_1.authenticate, async (req, res) => {
    try {
        const analysis = await ThreatAnalysis_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).select('status summary createdAt updatedAt');
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json({
            id: analysis._id,
            status: analysis.status,
            summary: analysis.summary,
            createdAt: analysis.createdAt,
            updatedAt: analysis.updatedAt
        });
    }
    catch (error) {
        console.error('Get analysis status error:', error);
        res.status(500).json({ message: 'Error fetching analysis status' });
    }
});
// Delete threat analysis
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const analysis = await ThreatAnalysis_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json({ message: 'Analysis deleted successfully' });
    }
    catch (error) {
        console.error('Delete analysis error:', error);
        res.status(500).json({ message: 'Error deleting analysis' });
    }
});
// Get threat statistics
router.get('/stats/overview', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        // Aggregate threat statistics
        const stats = await ThreatAnalysis_1.default.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $unwind: '$threats'
            },
            {
                $group: {
                    _id: {
                        type: '$threats.type',
                        severity: '$threats.severity'
                    },
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$threats.confidence' }
                }
            },
            {
                $group: {
                    _id: '$_id.type',
                    severityBreakdown: {
                        $push: {
                            severity: '$_id.severity',
                            count: '$count',
                            avgConfidence: '$avgConfidence'
                        }
                    },
                    totalCount: { $sum: '$count' }
                }
            },
            {
                $sort: { totalCount: -1 }
            }
        ]);
        res.json(stats);
    }
    catch (error) {
        console.error('Threat stats error:', error);
        res.status(500).json({ message: 'Error fetching threat statistics' });
    }
});
exports.default = router;
//# sourceMappingURL=threats.js.map