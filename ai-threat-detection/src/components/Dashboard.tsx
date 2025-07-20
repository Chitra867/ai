import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Shield, AlertTriangle, Activity, Users, CheckCircle, Eye } from 'lucide-react';
import { generateDashboardStats, generateRiskChart, generateThreatTrendChart, generateThreats } from '../utils/aiDataGenerator';
import { DashboardStats, ChartData, Threat } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [riskChart, setRiskChart] = useState<ChartData | null>(null);
  const [trendChart, setTrendChart] = useState<ChartData | null>(null);
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading AI-generated data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setStats(generateDashboardStats());
      setRiskChart(generateRiskChart());
      setTrendChart(generateThreatTrendChart());
      setRecentThreats(generateThreats(5));
      setIsLoading(false);
    };

    loadData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description?: string;
  }> = ({ title, value, icon, color, description }) => (
    <div className="card hover:border-primary-blue transition-colors duration-300">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-text-light">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const ThreatBadge: React.FC<{ level: string }> = ({ level }) => {
    const getBadgeClass = (level: string) => {
      switch (level.toLowerCase()) {
        case 'high': return 'threat-badge-high';
        case 'medium': return 'threat-badge-medium';
        case 'low': return 'threat-badge-low';
        default: return 'threat-badge-low';
      }
    };

    return <span className={getBadgeClass(level)}>{level.toUpperCase()}</span>;
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <span className="ml-3 text-text-light">Loading AI-generated threat intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Security Dashboard</h1>
        <p className="text-gray-400">Real-time threat monitoring and AI-powered analysis</p>
      </div>

      {/* System Status Alert */}
      <div className="mb-6 p-4 bg-success-green/10 border border-success-green/20 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-success-green mr-3" />
          <div>
            <p className="text-success-green font-medium">System Status: All systems operational</p>
            <p className="text-sm text-gray-400">
              Last health check: {stats?.lastScanTime.toLocaleTimeString()} | 
              Health Score: {stats?.systemHealth}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Scans"
          value={stats?.totalScans.toLocaleString() || '0'}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-primary-blue"
          description="Files analyzed by AI"
        />
        <StatCard
          title="Threats Found"
          value={stats?.threatsFound.toLocaleString() || '0'}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="bg-alert-red"
          description="Potential security risks"
        />
        <StatCard
          title="Malware Detected"
          value={stats?.malwareCount.toLocaleString() || '0'}
          icon={<Shield className="w-6 h-6 text-white" />}
          color="bg-yellow-600"
          description="Malicious files quarantined"
        />
        <StatCard
          title="Active Users"
          value="847"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-success-green"
          description="Currently monitored"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text-light mb-4">Risk Level Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {riskChart && (
              <Pie 
                data={riskChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: '#E0E0E0',
                        padding: 20
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Threat Trend Bar Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold text-text-light mb-4">Weekly Threat Trends</h3>
          <div className="h-64">
            {trendChart && (
              <Bar 
                data={trendChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#E0E0E0' },
                      grid: { color: '#555555' }
                    },
                    y: {
                      ticks: { color: '#E0E0E0' },
                      grid: { color: '#555555' }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Threats Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-light">Recent Threat Detections</h3>
          <button className="btn-primary text-sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User / IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Threat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  AI Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-light">{threat.username}</div>
                      <div className="text-sm text-gray-400">{threat.ip}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-light max-w-xs">
                      {threat.action}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ThreatBadge level={threat.riskLevel.level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {threat.timestamp.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-text-light">{threat.aiConfidence}%</div>
                      <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-blue h-2 rounded-full" 
                          style={{ width: `${threat.aiConfidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="mt-6 card bg-gradient-to-r from-gray-800 to-gray-900 border-primary-blue/30">
        <div className="flex items-start">
          <div className="p-2 bg-primary-blue rounded-lg mr-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-light mb-2">AI Security Summary</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Our advanced AI has analyzed {stats?.totalScans.toLocaleString()} files and detected {stats?.threatsFound.toLocaleString()} potential threats in the past 30 days. 
              The system is currently operating at {stats?.systemHealth}% efficiency with no critical vulnerabilities detected. 
              Behavioral analysis indicates normal user activity patterns across all monitored endpoints. 
              Recommended action: Continue monitoring with current security policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;