import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface ThreatAnalysis {
  _id: string;
  fileName: string;
  threatLevel: 'Low' | 'Medium' | 'High';
  threats: string[];
  recommendations: string[];
  aiInsights: string;
  createdAt: string;
}

const ThreatAnalysis: React.FC = () => {
  const [analyses, setAnalyses] = useState<ThreatAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/threats');
      setAnalyses(response.data);
    } catch (error) {
      addNotification('Failed to fetch threat analyses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/threats/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalyses(prev => [response.data, ...prev]);
      addNotification('Log file analyzed successfully', 'success');
    } catch (error) {
      addNotification('Failed to analyze log file', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'Low': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">Threat Analysis</h1>
        <div className="relative">
          <input
            type="file"
            accept=".log,.txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
            id="log-upload"
            disabled={uploading}
          />
          <label
            htmlFor="log-upload"
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Analyzing...' : 'Upload Log File'}
          </label>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {analyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-lg">
                No threat analyses yet. Upload a log file to get started.
              </div>
            </motion.div>
          ) : (
            analyses.map((analysis, index) => (
              <motion.div
                key={analysis._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {analysis.fileName}
                    </h3>
                    <div className="text-sm text-gray-400">
                      {new Date(analysis.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getThreatLevelColor(
                      analysis.threatLevel
                    )}`}
                  >
                    {analysis.threatLevel} Risk
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">AI Insights</h4>
                    <p className="text-gray-300 bg-gray-900 p-3 rounded-lg">
                      {analysis.aiInsights}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Detected Threats</h4>
                    <div className="space-y-2">
                      {analysis.threats.map((threat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ThreatAnalysis;