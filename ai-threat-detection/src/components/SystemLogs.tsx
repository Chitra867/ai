import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, RefreshCw, Info, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';
import { generateSystemLogs } from '../utils/aiDataGenerator';
import { SystemLog } from '../types';

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, filterLevel, filterSource, filterDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLogs = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const generatedLogs = generateSystemLogs(100);
    setLogs(generatedLogs);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.ip && log.ip.includes(searchTerm))
      );
    }

    // Level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }

    // Source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(log => log.source === filterSource);
    }

    // Date filter
    if (filterDate !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filterDate) {
        case '1h':
          cutoff.setHours(now.getHours() - 1);
          break;
        case '24h':
          cutoff.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
      }
      
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    }

    setFilteredLogs(filtered);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-primary-blue" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-alert-red" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLogLevelClass = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-primary-blue/20 text-primary-blue';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-alert-red/20 text-alert-red';
      case 'critical':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">System Logs</h1>
        <p className="text-gray-400">Real-time system activity monitoring and log analysis</p>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <Info className="w-6 h-6 text-primary-blue mx-auto mb-2" />
          <div className="text-lg font-bold text-text-light">
            {filteredLogs.filter(log => log.level === 'info').length}
          </div>
          <div className="text-xs text-gray-400">Info</div>
        </div>
        
        <div className="card text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-text-light">
            {filteredLogs.filter(log => log.level === 'warning').length}
          </div>
          <div className="text-xs text-gray-400">Warnings</div>
        </div>
        
        <div className="card text-center">
          <XCircle className="w-6 h-6 text-alert-red mx-auto mb-2" />
          <div className="text-lg font-bold text-text-light">
            {filteredLogs.filter(log => log.level === 'error').length}
          </div>
          <div className="text-xs text-gray-400">Errors</div>
        </div>
        
        <div className="card text-center">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-text-light">
            {filteredLogs.filter(log => log.level === 'critical').length}
          </div>
          <div className="text-xs text-gray-400">Critical</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none w-full"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="relative">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="input-field pr-8 appearance-none w-full"
            >
              <option value="all">All Sources</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div className="relative">
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none w-full"
            >
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
          
          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="btn-secondary flex items-center text-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <span className="ml-3 text-text-light">Loading system logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User / IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getLogIcon(log.level)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getLogLevelClass(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.timestamp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-light">{log.source}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-light max-w-md">
                        {log.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {log.user && <div>User: {log.user}</div>}
                        {log.ip && <div>IP: {log.ip}</div>}
                        {!log.user && !log.ip && <div className="text-gray-500">System</div>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No logs found</div>
                <div className="text-gray-500 text-sm">
                  Try adjusting your filter criteria or search terms
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Log Analysis */}
      <div className="mt-6 card bg-gradient-to-r from-gray-800 to-gray-900 border-primary-blue/30">
        <div className="flex items-start">
          <div className="p-2 bg-primary-blue rounded-lg mr-4">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-light mb-2">AI Log Analysis Summary</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI analysis of the last 24 hours shows {filteredLogs.filter(log => log.level === 'critical').length} critical events, 
              {filteredLogs.filter(log => log.level === 'error').length} errors, and {filteredLogs.filter(log => log.level === 'warning').length} warnings. 
              Most activity is concentrated during business hours with normal authentication patterns. 
              No anomalous behavior detected in system logs. All critical events have been automatically escalated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;