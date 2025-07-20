import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import ThreatAnalysis from '../models/ThreatAnalysis';
import MalwareScan from '../models/MalwareScan';

const router = express.Router();

// Get dashboard overview
router.get('/overview', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get threat analysis statistics
    const threatStats = await Promise.all([
      ThreatAnalysis.countDocuments({ userId, createdAt: { $gte: last24Hours } }),
      ThreatAnalysis.countDocuments({ userId, createdAt: { $gte: last7Days } }),
      ThreatAnalysis.countDocuments({ userId, createdAt: { $gte: last30Days } }),
      ThreatAnalysis.countDocuments({ 
        userId, 
        'threats.severity': { $in: ['high', 'critical'] },
        createdAt: { $gte: last24Hours }
      })
    ]);

    // Get malware scan statistics
    const malwareStats = await Promise.all([
      MalwareScan.countDocuments({ userId, createdAt: { $gte: last24Hours } }),
      MalwareScan.countDocuments({ userId, createdAt: { $gte: last7Days } }),
      MalwareScan.countDocuments({ userId, createdAt: { $gte: last30Days } }),
      MalwareScan.countDocuments({ 
        userId, 
        'scanResults.isInfected': true,
        createdAt: { $gte: last24Hours }
      })
    ]);

    // Get recent alerts (high priority threats)
    const recentAlerts = await ThreatAnalysis.find({
      userId,
      'threats.severity': { $in: ['high', 'critical'] },
      createdAt: { $gte: last7Days }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('threats analysisType createdAt');

    // System health simulation
    const systemHealth = {
      status: 'operational',
      uptime: '99.9%',
      aiEngineStatus: 'active',
      lastUpdate: new Date(),
      activeScans: Math.floor(Math.random() * 5),
      queuedAnalyses: Math.floor(Math.random() * 10)
    };

    // AI predictions (mock data)
    const aiPredictions = {
      riskTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
      predictedThreats: Math.floor(Math.random() * 20) + 10,
      confidenceLevel: Math.floor(Math.random() * 30) + 70,
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    res.json({
      systemHealth,
      statistics: {
        threats: {
          last24Hours: threatStats[0],
          last7Days: threatStats[1],
          last30Days: threatStats[2],
          highPriorityToday: threatStats[3]
        },
        malware: {
          last24Hours: malwareStats[0],
          last7Days: malwareStats[1],
          last30Days: malwareStats[2],
          infectedToday: malwareStats[3]
        }
      },
      recentAlerts: recentAlerts.flatMap(analysis => 
        analysis.threats
          .filter(threat => threat.severity === 'high' || threat.severity === 'critical')
          .map(threat => ({
            id: threat.id,
            type: threat.type,
            severity: threat.severity,
            description: threat.description,
            timestamp: threat.timestamp,
            analysisId: analysis._id
          }))
      ).slice(0, 5),
      aiPredictions
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get threat trends for charts
router.get('/threat-trends', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Aggregate threat data by day
    const threatTrends = await ThreatAnalysis.aggregate([
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
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            severity: '$threats.severity'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Process data for chart format
    const chartData: { [key: string]: any } = {};
    threatTrends.forEach(item => {
      const date = item._id.date;
      if (!chartData[date]) {
        chartData[date] = { date, low: 0, medium: 0, high: 0, critical: 0 };
      }
      chartData[date][item._id.severity] = item.count;
    });

    res.json(Object.values(chartData));
  } catch (error) {
    console.error('Threat trends error:', error);
    res.status(500).json({ message: 'Error fetching threat trends' });
  }
});

// Get malware statistics for charts
router.get('/malware-stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get malware type distribution
    const malwareTypes = await MalwareScan.aggregate([
      {
        $match: {
          userId,
          'scanResults.isInfected': true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$scanResults.malwareType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get scan results over time
    const scanTrends = await MalwareScan.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            infected: '$scanResults.isInfected'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Process scan trends data
    const scanChartData: { [key: string]: any } = {};
    scanTrends.forEach(item => {
      const date = item._id.date;
      if (!scanChartData[date]) {
        scanChartData[date] = { date, clean: 0, infected: 0 };
      }
      scanChartData[date][item._id.infected ? 'infected' : 'clean'] = item.count;
    });

    res.json({
      malwareTypes: malwareTypes.map(type => ({
        name: type._id || 'Unknown',
        value: type.count
      })),
      scanTrends: Object.values(scanChartData)
    });
  } catch (error) {
    console.error('Malware stats error:', error);
    res.status(500).json({ message: 'Error fetching malware statistics' });
  }
});

// Get system activity logs
router.get('/activity-logs', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Get recent threat analyses
    const threatLogs = await ThreatAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit / 2)
      .select('analysisType status summary createdAt');

    // Get recent malware scans
    const malwareLogs = await MalwareScan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit / 2)
      .select('filename scanResults.isInfected status createdAt');

    // Combine and sort logs
    const combinedLogs = [
      ...threatLogs.map(log => ({
        id: log._id,
        type: 'threat_analysis',
        description: `${log.analysisType} completed`,
        status: log.status,
        details: `Found ${log.summary.totalThreats} threats`,
        timestamp: log.createdAt
      })),
      ...malwareLogs.map(log => ({
        id: log._id,
        type: 'malware_scan',
        description: `Scanned file: ${log.filename}`,
        status: log.status,
        details: log.scanResults.isInfected ? 'Malware detected' : 'Clean file',
        timestamp: log.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      logs: combinedLogs.slice(0, limit),
      pagination: {
        page,
        limit,
        hasMore: combinedLogs.length === limit
      }
    });
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

export default router;