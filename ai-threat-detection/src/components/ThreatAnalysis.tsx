import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, AlertTriangle, Brain, MapPin, Monitor, Calendar } from 'lucide-react';
import { generateThreats } from '../utils/aiDataGenerator';
import { Threat } from '../types';

const ThreatAnalysis: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [filteredThreats, setFilteredThreats] = useState<Threat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  useEffect(() => {
    const loadThreats = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const generatedThreats = generateThreats(25);
      setThreats(generatedThreats);
      setFilteredThreats(generatedThreats);
      setIsLoading(false);
    };

    loadThreats();
  }, []);

  useEffect(() => {
    let filtered = threats;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(threat => 
        threat.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.ip.includes(searchTerm)
      );
    }

    // Filter by risk level
    if (filterLevel !== 'all') {
      filtered = filtered.filter(threat => threat.riskLevel.level === filterLevel);
    }

    // Filter by date
    if (filterDate !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filterDate) {
        case '24h':
          cutoff.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      
      if (filterDate !== 'all') {
        filtered = filtered.filter(threat => threat.timestamp >= cutoff);
      }
    }

    setFilteredThreats(filtered);
  }, [threats, searchTerm, filterLevel, filterDate]);

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newThreats = generateThreats(25);
    setThreats(newThreats);
    setIsLoading(false);
  };

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

  const aiInsights = [
    {
      title: 'Behavioral Pattern Alert',
      description: 'AI detected 15% increase in after-hours file access attempts',
      confidence: 89,
      type: 'warning'
    },
    {
      title: 'Anomalous Login Patterns',
      description: 'Machine learning identified unusual geographic login distribution',
      confidence: 76,
      type: 'info'
    },
    {
      title: 'Privilege Escalation Risk',
      description: 'Neural network flagged potential insider threat escalation',
      confidence: 94,
      type: 'critical'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Threat Analysis</h1>
        <p className="text-gray-400">AI-powered behavioral prediction and threat intelligence</p>
      </div>

      {/* AI Insights Panel */}
      <div className="mb-6 card bg-gradient-to-r from-gray-800 to-gray-900 border-primary-blue/30">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-primary-blue mr-3" />
          <h2 className="text-xl font-semibold text-text-light">AI Behavioral Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-text-light">{insight.title}</h3>
                <AlertTriangle className={`w-4 h-4 ${
                  insight.type === 'critical' ? 'text-alert-red' :
                  insight.type === 'warning' ? 'text-yellow-500' : 'text-primary-blue'
                }`} />
              </div>
              <p className="text-xs text-gray-400 mb-3">{insight.description}</p>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">AI Confidence:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-blue h-2 rounded-full" 
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs text-text-light ml-2">{insight.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by username, IP, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Risk Level Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400">
          Showing {filteredThreats.length} of {threats.length} threats
        </p>
        <div className="flex gap-2">
          <span className="text-xs bg-alert-red/20 text-alert-red px-2 py-1 rounded">
            {filteredThreats.filter(t => t.riskLevel.level === 'high').length} High Risk
          </span>
          <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
            {filteredThreats.filter(t => t.riskLevel.level === 'medium').length} Medium Risk
          </span>
          <span className="text-xs bg-success-green/20 text-success-green px-2 py-1 rounded">
            {filteredThreats.filter(t => t.riskLevel.level === 'low').length} Low Risk
          </span>
        </div>
      </div>

      {/* Threats Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <span className="ml-3 text-text-light">Analyzing threat patterns...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Threat Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Risk Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    AI Analysis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Context
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-light">{threat.username}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <span>{threat.ip}</span>
                          {threat.location && (
                            <>
                              <MapPin className="w-3 h-3 mx-1" />
                              <span className="text-xs">{threat.location}</span>
                            </>
                          )}
                        </div>
                        {threat.deviceType && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Monitor className="w-3 h-3 mr-1" />
                            {threat.deviceType}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-text-light">{threat.action}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {threat.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <ThreatBadge level={threat.riskLevel.level} />
                        <div className="text-xs text-gray-400">
                          Score: {threat.riskLevel.score}/100
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-xs text-gray-300 mb-2">
                          {threat.description}
                        </div>
                        <div className="flex items-center">
                          <div className="text-xs text-text-light">{threat.aiConfidence}%</div>
                          <div className="ml-2 w-16 bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-primary-blue h-1.5 rounded-full" 
                              style={{ width: `${threat.aiConfidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                          Risk Level: {threat.riskLevel.level.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Detection Time: {Math.floor(Math.random() * 5) + 1}s
                        </div>
                        <div className="text-xs text-gray-500">
                          Pattern Match: {Math.floor(Math.random() * 30) + 70}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatAnalysis;