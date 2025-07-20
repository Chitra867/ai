import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface LogEntry {
  _id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details?: any;
  userId?: string;
  ipAddress?: string;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { addNotification } = useNotification();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchLogs(true);
  }, [searchTerm, levelFilter, sourceFilter]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchLogs(true);
      }, 5000); // Refresh every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, searchTerm, levelFilter, sourceFilter]);

  const fetchLogs = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: reset ? '1' : page.toString(),
        limit: '50',
        search: searchTerm,
        level: levelFilter === 'all' ? '' : levelFilter,
        source: sourceFilter === 'all' ? '' : sourceFilter,
      });

      const response = await api.get(`/logs?${params}`);
      const newLogs = response.data.logs;
      
      if (reset) {
        setLogs(newLogs);
        setPage(1);
      } else {
        setLogs(prev => [...prev, ...newLogs]);
      }
      
      setHasMore(response.data.hasMore);
      
      if (reset && newLogs.length > 0) {
        scrollToBottom();
      }
    } catch (error) {
      addNotification('Failed to fetch system logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchLogs(false);
    }
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'error': return 'text-red-300 bg-red-900/10 border-red-400';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'info': return 'text-blue-400 bg-blue-900/20 border-blue-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const clearLogs = async () => {
    try {
      await api.delete('/logs');
      setLogs([]);
      addNotification('System logs cleared', 'success');
    } catch (error) {
      addNotification('Failed to clear logs', 'error');
    }
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        level: levelFilter === 'all' ? '' : levelFilter,
        source: sourceFilter === 'all' ? '' : sourceFilter,
      });

      const response = await api.get(`/logs/export?${params}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      addNotification('Logs exported successfully', 'success');
    } catch (error) {
      addNotification('Failed to export logs', 'error');
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">System Logs</h1>
        <div className="flex space-x-2">
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear Logs
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="auth">Authentication</option>
              <option value="api">API</option>
              <option value="threat">Threat Detection</option>
              <option value="malware">Malware Scanner</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Auto Refresh</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Showing {filteredLogs.length} logs</span>
          {autoRefresh && (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* Logs Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-lg border border-gray-700 max-h-[600px] overflow-y-auto"
      >
        {loading && filteredLogs.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No logs found</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getLevelIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(log.level)}`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">{log.source}</span>
                      <span className="text-gray-500 text-xs">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className="text-white text-sm mb-2">{log.message}</div>
                    {(log.userId || log.ipAddress) && (
                      <div className="flex space-x-4 text-xs text-gray-400">
                        {log.userId && <span>User: {log.userId}</span>}
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    )}
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                          Show Details
                        </summary>
                        <pre className="mt-2 text-xs text-gray-300 bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {hasMore && !loading && (
          <div className="p-4 text-center">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Load More
            </button>
          </div>
        )}
        
        <div ref={logsEndRef} />
      </motion.div>
    </div>
  );
};

export default SystemLogs;