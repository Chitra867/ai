import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardData {
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkTraffic: number;
  };
  threats: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  recentAlerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'High' | 'Medium' | 'Low';
    timestamp: string;
    aiInsight: string;
  }>;
  riskTrends: Array<{
    date: string;
    riskScore: number;
    threats: number;
  }>;
  aiSummary: {
    overallRisk: 'High' | 'Medium' | 'Low';
    keyFindings: string[];
    recommendations: string[];
  };
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      addNotification('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-900/20 border-red-500 text-red-400';
      case 'Medium': return 'bg-yellow-900/20 border-yellow-500 text-yellow-400';
      case 'Low': return 'bg-green-900/20 border-green-500 text-green-400';
      default: return 'bg-gray-900/20 border-gray-500 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 text-lg">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Monitoring</span>
        </div>
      </motion.div>

      {/* System Health Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">CPU Usage</p>
              <p className="text-2xl font-bold text-white">{dashboardData.systemHealth.cpuUsage}%</p>
            </div>
            <div className="text-3xl">🖥️</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Memory Usage</p>
              <p className="text-2xl font-bold text-white">{dashboardData.systemHealth.memoryUsage}%</p>
            </div>
            <div className="text-3xl">💾</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Disk Usage</p>
              <p className="text-2xl font-bold text-white">{dashboardData.systemHealth.diskUsage}%</p>
            </div>
            <div className="text-3xl">💽</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Network Traffic</p>
              <p className="text-2xl font-bold text-white">{dashboardData.systemHealth.networkTraffic} MB/s</p>
            </div>
            <div className="text-3xl">🌐</div>
          </div>
        </div>
      </motion.div>

      {/* Threats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Threats</p>
              <p className="text-2xl font-bold text-white">{dashboardData.threats.total}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Risk</p>
              <p className="text-2xl font-bold text-red-400">{dashboardData.threats.high}</p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-400">{dashboardData.threats.medium}</p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Risk</p>
              <p className="text-2xl font-bold text-green-400">{dashboardData.threats.low}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🤖</span>
            AI Risk Assessment
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Overall Risk Level</span>
                <span className={`font-bold ${getRiskColor(dashboardData.aiSummary.overallRisk)}`}>
                  {dashboardData.aiSummary.overallRisk}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Key Findings</h3>
              <ul className="space-y-1">
                {dashboardData.aiSummary.keyFindings.map((finding, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">AI Recommendations</h3>
              <ul className="space-y-1">
                {dashboardData.aiSummary.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Risk Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-6">Risk Trends (7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.riskTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={3} name="Risk Score" />
              <Line type="monotone" dataKey="threats" stroke="#f97316" strokeWidth={2} name="Threats" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-6">Recent Security Alerts</h2>
        
        <div className="space-y-4">
          {dashboardData.recentAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-gray-400 text-sm">{alert.type}</span>
                  </div>
                  <p className="text-white text-sm">{alert.message}</p>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                <p className="text-blue-300 text-xs">
                  <span className="font-medium">AI Insight:</span> {alert.aiInsight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;